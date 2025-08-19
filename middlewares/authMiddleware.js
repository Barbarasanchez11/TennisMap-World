import admin from '../config/firebase.js';

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access token required. Format: Bearer <token>'
            });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not provided'
            });
        }

        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                emailVerified: decodedToken.email_verified,
                name: decodedToken.name,
                picture: decodedToken.picture
            };
            
            console.log('User authenticated:', req.user.email);
            next();
            
        } catch (firebaseError) {
            console.error('Firebase token verification failed:', firebaseError.message);
            
            if (firebaseError.code === 'auth/id-token-expired') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired. Please login again.'
                });
            }
            
            if (firebaseError.code === 'auth/id-token-revoked') {
                return res.status(401).json({
                    success: false,
                    message: 'Token revoked. Please login again.'
                });
            }
            
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }
        
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
    }
};

const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const userEmail = req.user.email;
            
            
            const userRole = 'user';
            
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
                });
            }
            
            req.user.role = userRole;
           
            next();
            
        } catch (error) {
            console.error(' Role verification error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during role verification'
            });
        }
    };
};

const requireAdmin = requireRole(['admin']);
const requireUser = requireRole(['user', 'admin']);

export {
    authenticateToken,
    requireRole,
    requireAdmin,
    requireUser
}; 