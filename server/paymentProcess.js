import dotenv from 'dotenv';
import unirest from 'unirest';

dotenv.config();

var env_vars = dotenv.config();
var api_user = 'RrBdMVtqG9bBcgbhBCWjgFB4';
var api_password = 'sk_vqTHKf4bWqxR8qV8QjJTQ9tv';


const ftCache = {};
export async function paymentProcess(){

    if (ftCache.data) return ftCache.data;

    // var result = {};
    console.log('In paymentProcess');
    function createOrder(){
        return new Promise((resolve, reject) => {
            unirest('POST', 'https://uat.api.converge.eu.elavonaws.com/orders')
                .headers({
                'Accept': 'application/json',
                'Authorization': 'Basic '+ btoa(api_user+":"+api_password),
                'Correlation-ID': '94ae86e2-2173-46ef-b8dd-131c704c22d0',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                })
                .send(JSON.stringify({
                  "total": {
                    "amount": "1.00",
                    "currencyCode": "EUR"
                  },
                  "description": "parts",
                  "items": [
                   {
                    "total": {
                      "amount": "1.00",
                      "currencyCode": "EUR"
                    },
                   "description": "widget"
                   }
                  ]
                }))
                .end(function (res) { 
                  if (res.error) 
                      return reject(res.error);
                  else
                      return resolve(res.body);
                  });
              });
            }

    var resp = await createOrder();
    console.log('Response:::::'+resp.id);
    
    var result = [];
    
    return resp.id;


}

