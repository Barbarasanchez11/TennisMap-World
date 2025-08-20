import admin from '../config/firebase.js';
import User from '../models/Users.js';

export const getMe = async (req, res) => {
    try {
        const { uid } = req.user;
        const dbUser = await User.findOne({ firebaseUid: uid }).lean();
        return res.json({
            success: true,
            user: req.user,
            profile: dbUser || null
        });
    } catch (error) {
        console.error('getMe error:', error);
        return res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
};

export const setUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body || {};

        const allowed = ['user', 'admin'];
        if (!allowed.includes(role)) {
            return res.status(400).json({ success: false, message: `Invalid role. Allowed roles: ${allowed.join(', ')}` });
        }

        await admin.auth().setCustomUserClaims(uid, { role });

        const user = await User.findOneAndUpdate(
            { firebaseUid: uid },
            { role },
            { new: true }
        );

        return res.json({ success: true, message: 'Role updated', role, user });
    } catch (error) {
        console.error('setUserRole error:', error);
        return res.status(500).json({ success: false, message: 'Error updating role' });
    }
};


