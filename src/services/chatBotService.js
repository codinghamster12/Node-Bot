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
    
  
  