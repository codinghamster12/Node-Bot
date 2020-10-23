const request = require('request');

exports.getFacebookUserName= (sender_psid)=>{
    return new Promise((resolve, reject) => {
        let uri= `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${process.env.FB_PAGE_TOKEN}`
    request({
      "uri": uri,
      "method": "GET",
    }, (err, res, body) => {
        try{
            body= JSON.parse(body);
            let username= `${body.first_name} ${body.last_name}`;
            resolve(username);
        }
        catch(err){
            reject('Unable to send message: ' + err);
        }
      
    }); 
    });
}

exports.sendResponseWelcomeNewCustomer= async (username, sender_psid) => {
    return new Promise((resolve, reject) => {
        try{
        let response_first= {"text": `Welcome ${username} to Bisma's restaurant`};

        let response_second = {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": [{
                  "title": "Bisma's restaurant",
                  "subtitle": "Tap a button to answer.",
                  "image_url": "https://www.subtractive.pk/images/BellaVita/2.jpg",
                  "buttons": [
                    {
                      "type": "postback",
                      "title": "Main meny",
                      "payload": "MENU",
                    },
                    
                  ],
                }]
              }
            }
          }
          await send_Message(sender_psid, response_first);
          await send_Message(sender_psid, response_second);
          resolve("value done");

        }
        catch(e){
            reject(e);
        }
        
          
    });

}

exports.send_Message = (sender_psid, response) => {
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
    
  
  