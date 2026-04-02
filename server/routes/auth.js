const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['github'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: 'https://localhost:4000/login' }),
    (req, res) => res.redirect('https://localhost:4000/dashboard'));

router.get('/me', (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    res.json(req.user);
});

router.post('logout', (req, res) => {
    req.logout(() => res.json({ message: 'Logged out' }));
});

module.exports = router;