const request = require('request');

function getFacebookUserName(sender_psid){
    return new Promise((resolve, reject) => {
        let uri= 'https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=4${process.env.FB_PAGE_TOKEN}'
    request({
      "uri": uri,
      "method": "GET",
    }, (err, res, body) => {
      if (!err) {
          body= JSON.parse(body);
          let username= `${body.last_name} ${body.first_name}`;
          resolve(username);

      } else {
        resolve('Unable to send message: ' + err);
      }
    }); 
    });
    
  
  }