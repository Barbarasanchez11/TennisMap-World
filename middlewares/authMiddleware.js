import admin from '../config/firebase.js';
import User from '../models/Users.js';

const findOrCreateUser = async (decodedToken) => {
  const { uid, email, name, picture, role } = decodedToken;

  let user = await User.findOne({ firebaseUid: uid }) || (email && await User.findOne({ email }));

  if (!user) {
    user = new User({
      firebaseUid: uid,
      email,
      firstName: name?.split(' ')[0] || 'User',
      lastName: name?.split(' ').slice(1).join(' ') || 'TennisMap',
      role: role || 'user',
      isActive: true,
      displayName: name || undefined,
      photoUrl: picture || undefined
    });
  } else {
    Object.assign(user, {
      email: email || user.email,
      displayName: name || user.displayName,
      photoUrl: picture || user.photoUrl,
      role: role || user.role,
      firebaseUid: user.firebaseUid || uid
    });
  }

  await user.save();
  return user;
};

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token required' });

    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken.email_verified) {
      return res.status(403).json({ success: false, message: 'Email not verified' });
    }

    const dbUser = await findOrCreateUser(decodedToken);

    if (!dbUser.isActive) {
      return res.status(403).json({ success: false, message: 'Account disabled' });
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name,
      picture: decodedToken.picture,
      role: decodedToken.role || dbUser.role,
      dbUserId: dbUser._id.toString()
    };

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({
      success: false,
      message: err.code === 'auth/id-token-expired' ? 'Token expired' :
               err.code === 'auth/id-token-revoked' ? 'Token revoked' :
               'Invalid token'
    });
  }
};

const requireRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Access denied. Allowed roles: ${allowedRoles.join(', ')}` });
  }
  next();
};

const requireAdmin = requireRole(['admin']);
const requireUser = requireRole(['user', 'admin']);

export {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireUser
};
