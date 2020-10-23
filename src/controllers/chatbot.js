const request= require('request');
const env = require("dotenv");
env.config();

exports.getWebHook = (req, res) => {
  let VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
  console.log(VERIFY_TOKEN);

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

exports.postWebHook = (req, res) => {
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      // Gets the body of the webhook event
       // Gets the body of the webhook event
  let webhook_event = entry.messaging[0];
  console.log(webhook_event);


  // Get the sender PSID
  let sender_psid = webhook_event.sender.id;
  console.log('Sender PSID: ' + sender_psid);

  // Check if the event is a message or postback and
  // pass the event to the appropriate handler function
  if (webhook_event.message) {
    handleMessage(sender_psid, webhook_event.message);        
  } else if (webhook_event.postback) {
    handlePostback(sender_psid, webhook_event.postback);
  }
    });

    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};
function firstTrait(nlp, name) {
  return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
}


// Handles messages events
function handleMessage(sender_psid, received_message) {
  let entitiesArr=['wit$greetings', 'wit$thanks', 'wit$bye'];
  let entityChosen='';
  entitiesArr.forEach(name => {
    let entity= firstTrait(received_message.nlp, name);
    if(entity && entity.confidence > 0.8){
      entityChosen= name;
    }
  });
    if(entityChosen===""){
      callSendAPI(sender_psid, 'Hi! The bot requires more training try using thanks or bye');

    }
    else {
      if(entityChosen==='wit$greetings'){
      callSendAPI(sender_psid, 'Hi there!');
    }
    if(entityChosen==='wit$thanks'){
      callSendAPI(sender_psid, 'You are welcome');
  
    }
    if(entityChosen==='wit$bye'){
      callSendAPI(sender_psid, 'Bubyee');
    }
  }
  


  
  
  // Send the response message
}

function getFacebookUserName (sender_psid){
  return new Promise((resolve, reject) => {
      let uri= 'https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=4${process.env.FB_PAGE_TOKEN}'
  request({
    "uri": uri,
    "method": "GET",
  }, (err, res, body) => {
      try{
          body= JSON.parse(body);
          let username= `${body.last_name} ${body.first_name}`;
          console.log(body);
          console.log(username);
          resolve(username);
      }
      catch(err){
          reject('Unable to send message: ' + err);
      }
    
  }); 
  });
}


// Handles messaging_postbacks events
let handlePostback= async (sender_psid, received_postback) => {
  let response;
  
  // Get the payload for the postback

  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch(payload){

    case "GET_STARTED":
      try{
        let username= getFacebookUserName(sender_psid);
        response= {"text": `Welcome ${username} to Bisma's restaurant`};
        break;

      }
      catch(err){
        console.log(err);
      }
   
    case "yes":
      response={}
      break;
    case "no":
      response={}
      break;
    default:
      console.log('Something went wrong with switch case payload');

    
  }
  
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  request({
    "uri": "https://graph.facebook.com/v6.0/me/messages",
    "qs": { "access_token": process.env.FB_PAGE_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}
