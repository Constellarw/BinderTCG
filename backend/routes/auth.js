const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// @route   GET /auth/status
// @desc    Check auth routes status
router.get('/status', (req, res) => {
  res.json({
    message: 'Auth routes working',
    routes: ['/auth/google', '/auth/google/callback', '/auth/logout', '/auth/me'],
    environment: process.env.NODE_ENV,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'missing'
  });
});

// @route   GET /auth/google
// @desc    Redirect to Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Create JWT token
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

// @route   GET /auth/logout
// @desc    Logout user
router.get('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// @route   GET /auth/me
// @desc    Get current user
router.get('/me', require('../middleware/auth'), (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar
  });
});

module.exports = router;
