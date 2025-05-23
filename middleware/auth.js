const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const DEFAULT_BLOCKS = ['A-Block', 'B-Block', 'C-Block', 'D-Block', 'E-Block'];

const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No auth token found',
      });
    }

    token = token.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Empty token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'OutingApplication@2026');

    if (!decoded || !decoded.role) {
      throw new Error('Invalid token payload');
    }

    const role = decoded.role;

    if (role === 'hostel-incharge') {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role,
        isAdmin: decoded.isAdmin || false,
        assignedBlocks: decoded.assignedBlocks || DEFAULT_BLOCKS
      };
      return next();
    }

    if (role === 'warden') {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role,
        isAdmin: true,
        assignedBlocks: DEFAULT_BLOCKS
      };
      console.log('Warden auth:', req.user);
      return next();
    }

    if (typeof role === 'string' && (role.includes('-incharge') || role === 'gate')) {
      const floors = Array.isArray(decoded.assignedFloor) ? decoded.assignedFloor : [decoded.assignedFloor];
      const hostelBlock = decoded.assignedBlock || decoded.hostelBlock;

      req.user = {
        id: decoded.id || decoded.email,
        email: decoded.email,
        role,
        assignedBlock: hostelBlock,
        assignedFloor: floors,
        hostelBlock,
        floor: floors
      };

      console.log('Auth middleware:', req.user);
      return next();
    }

    // Regular user fallback
    if (!decoded.id) {
      throw new Error('Missing user ID in token');
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      throw new Error('Invalid user ID format');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    return next();

  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      const userRole = (req.user?.role || '').toLowerCase();
      const normalizedRoles = roles.map(role => role.toLowerCase());

      // Allow gate role to act as 'security'
      if (userRole === 'gate' && normalizedRoles.includes('security')) {
        return next();
      }

      if (!normalizedRoles.includes(userRole)) {
        console.error('Access denied:', {
          userRole,
          allowedRoles: roles,
          path: req.path
        });
        return res.status(403).json({
          success: false,
          message: 'Access denied',
          details: {
            userRole,
            requiredRoles: roles,
            path: req.path
          }
        });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({
        success: false,
        message: 'Role verification failed'
      });
    }
  };
};

const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'OutingApplication@2026');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { auth, checkRole, authenticate };
