import dotenv from 'dotenv';
// import { dbService } from '../falconDB/dbService.js';
const EMAIL_DOMAIN = "hdcms.com"; // For making fake email ID

import { getdbdata } from '../falconDB/dbHandler.js';

dotenv.config();

// const db = new getdbdata();     // Singleton service for Falcon DB

const invoiceCache = {};
export  function getInvoices() {

    // if (employeeCache[employeeId]) return employeeCache[employeeId];
    // console.log("in falcon dataservice ")

    const invoices =  getdbdata();

    const result = {
        invid: invoices.invoice_id,
        vndinvno: invoices.vendor_invoice_no,
        invdt: invoices.invoice_dt,
        vendor: invoices.vendor,
        amt: invoices.amount,
        invstat: invoices.inv_status,
        btid: invoices.bank_transaction_id
    }

    return result;
}


