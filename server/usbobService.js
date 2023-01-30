import dotenv from 'dotenv';
import unirest from 'unirest';
import { Database } from 'sqlite-async';
import { db } from 'aa-sqlite';

dotenv.config();

var env_vars = dotenv.config();
var api_key = env_vars.parsed['KEY'];
var api_secret = env_vars.parsed['SECRET'];

var br_token  = btoa(api_key + ':' + api_secret);

const ftCache = {};
export async function rtpFundTransfer(invid, acctno, routno){

    if (ftCache.data) return ftCache.data;

    // var result = {};

    function getToken(){
        return new Promise((resolve, reject) => {
            unirest('POST', 'https://sandbox.usbank.com/auth/oauth2/v1/token')
                .headers({
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic '+ br_token
                })
                .send('grant_type=client_credentials')
                .end(function (response) { 
                    if (response.error){
                        return reject(response.error);
                    }
                    else {
                        return resolve(response.body.accessToken);
                    }
                });
        })
    }

    function fundtransfer (accessToken){
    return new Promise((resolve, reject) => {

    var ft = unirest('POST', 'https://sandbox.usbank.com/money-movement/rtp/v1/credit-transfers')
                    .headers({
                        'Accept-Encoding': '*',
                        'Authorization': 'Bearer ' + accessToken,
                        'Correlation-ID': '94ae86e2-2173-46ef-b8dd-131c704c22d0',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    })
  .send(JSON.stringify({
    "creditTransfer": {
      "clientDetails": {
        "clientRequestID": invid
      },
      "payerDetails": {
        "name": "Zeal Inc",
        "accountNumber": acctno,
        "routingNumber": routno,
        "address": {
          "addressLine1": "100 Main St",
          "addressLine2": "Apt 116",
          "city": "Chicago",
          "state": "IL",
          "zipCode": "60606",
          "country": "US"
        }
      },
      "ultimatePayerDetails": {
        "name": "John D",
        "identifier": "12344232122",
        "address": {
          "addressLine1": "100 Main St",
          "addressLine2": "Apt 116",
          "city": "Chicago",
          "state": "IL",
          "zipCode": "60606",
          "country": "US"
        }
      },
      "payeeDetails": {
        "name": "ABC Corp",
        "accountNumber": "asd-344232122",
        "routingNumber": "091000019",
        "address": {
          "addressLine1": "100 Main St",
          "addressLine2": "Apt 116",
          "city": "Chicago",
          "state": "IL",
          "zipCode": "60606",
          "country": "US"
        }
      },
      "ultimatePayeeDetails": {
        "name": "Jim K",
        "identifier": "12344232122",
        "address": {
          "addressLine1": "100 Main St",
          "addressLine2": "Apt 116",
          "city": "Chicago",
          "state": "IL",
          "zipCode": "60606",
          "country": "US"
        }
      },
      "transactionDetails": {
        "amount": 100.12,
        "paymentType": "STANDARD"
      },
      "remittanceData": {
        "remittanceID": "20151112INFOABCD",
        "remittanceLocationDetails": {
          "email": "remit@healthcorp.com",
          "URI": "https://remittances/healthcorp.com"
        },
        "additionalInfo": "Unstructured remittance Information"
      }
    }
  }))
  .end(function (res) { 
    if (res.error) 
        return reject(res.error);
    else
        return resolve(res.body);
    });
});

}

    var accessToken = await getToken();
    console.log(accessToken);
    
    var ft_response = await fundtransfer(accessToken);
    console.log(ft_response, ft_response.transactionID)

    var btid = ft_response.transactionID;
    var result = [];
    try{      
      await Database.open('falconDB/falconDb')
          .then( async db => {
              // result = await db.run(`update t_invoicelist set bank_transaction_id = $1, inv_status = 'Paid' where invoice_id = $2`, [btid, invid]);
              result = await db.run(`update t_invoices set bank_transaction_id = $1, invoice_status = 'Paid' where invoice_no = $2`, [btid, invid]);
              console.log ("in rtp async", result);
            })
          .catch(err => {
              console.log(err);
          });
      // res.send(result);
    }
    catch(error){
      console.log(`Error in db update handling: ${error}`);
      res.status(500).json({status: 500, statusText: error});
    }
    return ft_response;


}

const txnCache = {};
export async function getTxnDetails(transactionId){

    if (txnCache.data) return txnCache.data;

    function getToken(){
        return new Promise((resolve, reject) => {
            unirest('GET', 'https://sandbox.usbank.com/money-movement/rtp/v1/credit-transfers/202211282H0A1PB2LDNA83XRTV858039018')
                .headers({
                    'Accept': 'application/json',
                    'Accept-Encoding': '*',
                    'Correlation-Id': '4d08ca9d-e3bb-4312-8572-1658afeed4ee',
                    'Authorization': 'Bearer ' + token
                })
                .send('')
                .end(function (response) { 
                    if (response.error){
                        return reject(response.error);
                    }
                    else {
                        return resolve(response.body);
                    }
                });
        })
    }
}