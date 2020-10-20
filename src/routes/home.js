const express= require('express');
const { getHomePage, getFacebookUserProfile, setUpUserFacebookProfile } = require('../controllers/home');
const router= express.Router();

router.get('/', getHomePage);
router.get('/profile', getFacebookUserProfile);
router.post('/set-up-user-fb-profile', setUpUserFacebookProfile);

module.exports= router;