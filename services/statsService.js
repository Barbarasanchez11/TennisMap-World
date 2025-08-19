import Tournament from '../models/Tournament.js';
import Player from '../models/Player.js';
import weatherService from './weatherService.js';

class StatsService {
    async getTournamentStats() {
        try {
            const totalTournaments = await Tournament.countDocuments();
            const tournamentsByCategory = await Tournament.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            const tournamentsBySurface = await Tournament.aggregate([
                { $group: { _id: '$surface', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            const tournamentsByCountry = await Tournament.aggregate([
                { $group: { _id: '$country', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            const tournamentsByMonth = await Tournament.aggregate([
                {
                    $addFields: {
                        month: { $month: '$startDate' }
                    }
                },
                { $group: { _id: '$month', count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]);

            const upcomingTournaments = await Tournament.countDocuments({
                startDate: { $gte: new Date() }
            });

            const ongoingTournaments = await Tournament.countDocuments({
                startDate: { $lte: new Date() },
                endDate: { $gte: new Date() }
            });

            return {
                total: totalTournaments,
                byCategory: tournamentsByCategory,
                bySurface: tournamentsBySurface,
                byCountry: tournamentsByCountry,
                byMonth: tournamentsByMonth,
                upcoming: upcomingTournaments,
                ongoing: ongoingTournaments
            };
        } catch (error) {
            console.error('Error getting tournament stats:', error);
            throw error;
        }
    }

    async getPlayerStats() {
        try {
            const totalPlayers = await Player.countDocuments();
            const playersByCountry = await Player.aggregate([
                { $group: { _id: '$country', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            const playersByGender = await Player.aggregate([
                { $group: { _id: '$gender', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            const playersByHand = await Player.aggregate([
                { $group: { _id: '$dominantHand', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]);

            const rankingDistribution = await Player.aggregate([
                { $match: { ranking: { $exists: true, $ne: null } } },
                {
                    $bucket: {
                        groupBy: '$ranking',
                        boundaries: [0, 10, 50, 100, 500, 1000],
                        default: '1000+',
                        output: { count: { $sum: 1 } }
                    }
                }
            ]);

            const ageStats = await Player.aggregate([
                {
                    $addFields: {
                        age: {
                            $floor: {
                                $divide: [
                                    { $subtract: [new Date(), '$dateOfBirth'] },
                                    365 * 24 * 60 * 60 * 1000
                                ]
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgAge: { $avg: '$age' },
                        minAge: { $min: '$age' },
                        maxAge: { $max: '$age' }
                    }
                }
            ]);

            return {
                total: totalPlayers,
                byCountry: playersByCountry,
                byGender: playersByGender,
                byHand: playersByHand,
                rankingDistribution,
                ageStats: ageStats[0] || { avgAge: 0, minAge: 0, maxAge: 0 }
            };
        } catch (error) {
            console.error('Error getting player stats:', error);
            throw error;
        }
    }

    async getCombinedStats() {
        try {
            const [tournamentStats, playerStats] = await Promise.all([
                this.getTournamentStats(),
                this.getPlayerStats()
            ]);

            const weatherStats = await this.getWeatherStats();

            return {
                tournaments: tournamentStats,
                players: playerStats,
                weather: weatherStats,
                summary: {
                    totalTournaments: tournamentStats.total,
                    totalPlayers: playerStats.total,
                    activeTournaments: tournamentStats.ongoing,
                    upcomingTournaments: tournamentStats.upcoming
                }
            };
        } catch (error) {
            console.error('Error getting combined stats:', error);
            throw error;
        }
    }

    async getWeatherStats() {
        try {
            const tournaments = await Tournament.find({}, 'location startDate endDate');
            let totalWeatherData = 0;
            let weatherConditions = {};

            for (const tournament of tournaments) {
                try {
                    const weather = await weatherService.getCurrentWeather(
                        tournament.location.lat,
                        tournament.location.lng
                    );
                    
                    totalWeatherData++;
                    const condition = weather.condition;
                    weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
                } catch (error) {
                    console.log(`Could not fetch weather for tournament ${tournament._id}`);
                }
            }

            return {
                totalTournamentsWithWeather: totalWeatherData,
                weatherConditions,
                coverage: (totalWeatherData / tournaments.length) * 100
            };
        } catch (error) {
            console.error('Error getting weather stats:', error);
            return {
                totalTournamentsWithWeather: 0,
                weatherConditions: {},
                coverage: 0
            };
        }
    }

    async getGeographicStats() {
        try {
            const tournaments = await Tournament.aggregate([
                {
                    $group: {
                        _id: '$country',
                        count: { $sum: 1 },
                        cities: { $addToSet: '$city' },
                        surfaces: { $addToSet: '$surface' }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            const players = await Player.aggregate([
                {
                    $group: {
                        _id: '$country',
                        count: { $sum: 1 },
                        cities: { $addToSet: '$city' }
                    }
                },
                { $sort: { count: -1 } }
            ]);

            return {
                tournaments,
                players,
                regions: {
                    europe: tournaments.filter(t => ['France', 'Spain', 'Italy', 'Germany', 'UK'].includes(t._id)).length,
                    americas: tournaments.filter(t => ['USA', 'Canada', 'Brazil', 'Argentina'].includes(t._id)).length,
                    asia: tournaments.filter(t => ['Japan', 'China', 'India', 'Australia'].includes(t._id)).length
                }
            };
        } catch (error) {
            console.error('Error getting geographic stats:', error);
            throw error;
        }
    }
}

export default new StatsService(); 