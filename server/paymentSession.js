import dotenv from 'dotenv';
import unirest from 'unirest';

dotenv.config();

var env_vars = dotenv.config();
var api_user = 'RrBdMVtqG9bBcgbhBCWjgFB4';
var api_password = 'sk_vqTHKf4bWqxR8qV8QjJTQ9tv';


const ftCache = {};
export async function paymentSession(invid){

    if (ftCache.data) return ftCache.data;

    // var result = {};
    console.log('In paymentSession');
    function createSession(){
        return new Promise((resolve, reject) => {
            unirest('POST', 'https://uat.api.converge.eu.elavonaws.com/payment-sessions')
                .headers({
                'Accept': 'application/json',
                'Authorization': 'Basic '+ btoa(api_user+":"+api_password),
                'Correlation-ID': '',
                'Content-Type': 'application/json'
                })
                .send(JSON.stringify({
                    "order": invid,
                    "returnUrl": null,
                    "cancelUrl": null,
                    "hppType": "lightbox",
                    "originUrl": "http://localhost:3000",
                    "doCreateTransaction": "true",
                }))
                .end(function (res) { 
                  if (res.error) {
                      console.log(res.error);
                      return reject(res.error);
                  }
                  else
                      return resolve(res.body);
                  });
              });
            }

    var resp = await createSession();
    console.log('Response payment session:::::'+resp.id);
    
    var result = [];
    
    return resp.id;


}

