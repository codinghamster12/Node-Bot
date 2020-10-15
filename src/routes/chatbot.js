const express= require('express');
const { getWebHook, postWebHook } = require('../controllers/chatbot');
const router= express.Router();

router.get('/webhook',  getWebHook);
router.post('/webhook', postWebHook);

module.exports= router;