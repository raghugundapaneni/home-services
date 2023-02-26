// import * as React from 'react';
import React, { Component, useState, useEffect } from 'react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles, } from '@fluentui/react/lib/Dropdown';
import { Label } from '@fluentui/react-components';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens } from '@fluentui/react';
import { HashRouter as Router, Routes, useLocation, Redirect, Route, useNavigate } from "react-router-dom";
import { getInvoiceItems } from './util.js';
import { Button, Header, Box } from '@fluentui/react-northstar';
import { PlayIcon } from '@fluentui/react-icons-northstar';
import './usb.css';

const dropdownStyles = { dropdown: { width: 700 } };

const DropdownControlledMultiExampleOptions = [
  { key: 'Applnsheader', text: 'Appliances', itemType: DropdownMenuItemType.Header },
  { key: 'Furnace', text: 'Furnace' },
  { key: 'Refrigerator', text: 'Refrigerator' },
  { key: 'Airconditioner', text: 'Air Conditioner', disabled: true },
  { key: 'Dishwasher', text: 'Dishwasher' },
  { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'Electricheader', text: 'Electrical and Lighting', itemType: DropdownMenuItemType.Header },
  { key: 'Ceilingfan', text: 'Ceiling Fan' },
  { key: 'Electricaloutlet', text: 'Electrical outlet' },
  { key: 'MiscElec', text: 'Misc electrical' },
  { key: 'divider_2', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'DoorsLocks', text: 'Doors and Locks', itemType: DropdownMenuItemType.Header },
  { key: 'Frontdoor', text: 'Front door' },
  { key: 'Garagedoor', text: 'Garage door' },
  { key: 'Lock', text: 'Lock' },
  { key: 'Miscdoor', text: 'Misc' },
];

const stackTokens = { childrenGap: 40 };



const DropdownControlledMultiExample = () => {
  initializeIcons();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = React.useState([]);
  const [body, setBody] = useState('');
  const [posts, setPosts] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const labelStyles = { root: { color: '#f00' } };
  const onChange = (event, item) => {
    if (item) {
      setSelectedKeys(
        item.selected ? [...selectedKeys, item.key] : selectedKeys.filter(key => key !== item.key),
      );
    }
  };

  const addPosts = async (body) => {
    var api_user = 'RrBdMVtqG9bBcgbhBCWjgFB4';
    var api_password = 'sk_vqTHKf4bWqxR8qV8QjJTQ9tv';
    await fetch('https://uat.api.converge.eu.elavonaws.com/orders', {
       method: 'POST',
       body: JSON.stringify({
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
      }),
       headers: {
          'Content-type': 'application/json; charset=UTF-8','Access-Control-Allow-Origin': 'http://localhost:3000', 'Authorization': 'Basic '+ btoa(api_user+":"+api_password),
       },
    })
       .then((response) => response.json())
       .then((data) => {
          setPosts((posts) => [data, ...posts]);
          setBody('');
       })
       .catch((err) => {
          console.log(err.message);
       });
 };

  async function submitClicked(){
    console.log("========> Form submitted:" + selectedKeys );
    console.log("========> Form submitted:");
    let resp = await fetch(`/api/paymentProcess`, {
      "method": "post",
      "cache": "default",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "total": {
          "amount": "2.00",
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
      })
    });
    let data = await resp.text();
    console.log("Reso:::"+data);
    navigate('/payment', {
      state: {
        data
      }
    });    
  };

  return (
    <Box>
    <Stack vertical tokens={stackTokens}>
       <div><Header as="h2">&nbsp;&nbsp;&nbsp;&nbsp;Home Services</Header></div>
      <div>
      <Dropdown
        placeholder="Select services"
        // label="Multi-select controlled example"
        selectedKeys={selectedKeys}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onChange}
        multiSelect
        options={DropdownControlledMultiExampleOptions}
        styles={dropdownStyles}
      />
      </div>
      <div>&nbsp;&nbsp;&nbsp;&nbsp;
      <PrimaryButton text="Proceed" onClick={submitClicked} /*allowDisabledFocus disabled={disabled} checked={checked}*/ />
      </div>
    </Stack>
    </Box>
  );
};



var inv_total = 0;
var invid = 0;
var invdt = '';
var vendor = '';
var pstat = '';
var result = {};
var btid = '';

function InvoiceDetails() {

  const navigate = useNavigate();

  const {state} = useLocation();

  console.log("=>" + state.data);
  var pid = state.data;

  async function handleClick(){
    
    console.log("========> Form submitted:");
    
    let resp1 = await fetch(`/api/paymentSession`, {
      "method": "post",
      "cache": "default",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "order": "https://uat.api.converge.eu.elavonaws.com/orders/"+pid,
        "returnUrl": null,
        "cancelUrl": null,
        "hppType": "lightbox",
        "originUrl": "http://localhost:3000",
        "doCreateTransaction": "true",
        
      })
      
    });
  
    let data1 = await resp1.text();
    console.log("Reso:::"+data1);
    window.location.assign('https://uat.hpp.converge.eu.elavonaws.com/?sessionId='+data1);
    
  };

  return (


    <>
      <div className="container">

        <h2>&nbsp;&nbsp;&nbsp;&nbsp;Invoice</h2>
        <br></br><br></br>
        <table id="inv-table" className="inv-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {
               <tr>
                <td>Refrigerator</td>
                <td>DIY </td>
                <td>1</td>
                <td>$20</td>
               </tr>}
            {   <tr>
                  <td>Refrigerator</td>
                  <td>DIY </td>
                  <td>1</td>
                  <td>$20</td>
                </tr>
            }
            {   <tr>
                  <td>Refrigerator</td>
                  <td>DIY </td>
                  <td>1</td>
                  <td>$20</td>
                </tr>
            }
            {   <tr>
                  <td>Refrigerator</td>
                  <td>DIY </td>
                  <td>1</td>
                  <td>$20</td>
                </tr>
            }
            {<tr>
                  <td>Total Amount</td>
                  <td> </td>
                  <td></td>
                  <td>$125</td>
                </tr>
            }
          </tbody>
        </table>
        <div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button disabled={pstat === "Paid"} onClick={handleClick} icon={<PlayIcon />} content="Click To Pay" Position='after' primary />
        </div>
      </div>

    </>


  );
}

function ConfirmPay() {
  const location = useLocation();
  const invtotal = useLocation().state.invtotal;
  const invid = useLocation().state.invid;
  const pstat = useLocation().state.pstat;
  const vendor = useLocation().state.vendor;
  const invdt = useLocation().state.invdt;

  const navigate = useNavigate();

  console.log(invid);

  // const [acctno, setAcctno] = useState('');

  const routno = '021000021';
  const acctno = '123456789';

  console.log('in get Token()', invid, acctno, routno);

  const clickToPay = () => {
    console.log('in get Token()');
    window.location.assign('http://github.com');
    fetch(`/api/rtpfundtransfer`, {
      "method": "post",
      "cache": "default",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      "body": JSON.stringify({ id: invid, acctno: acctno, routno: routno })
    });

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 2000);
  }

  return (
    <div className="testbox">
      <form action="/">
        <div className="banner">
          <h1>Confirm Payment</h1>
        </div>
        <div className="item" >
          <p><span style={{ width: "40%", float: "left" }}> Invoice ID:&nbsp;&nbsp;
          </span></p></div>
        <div className="item" >
          <p><span style={{ width: "60%", float: "right" }}>
            <label id="txt_tid">{invid}</label></span></p></div>

        <div className="item">
          <p><span style={{ width: "40%", float: "left" }}> Invoice Date:&nbsp;&nbsp;
          </span></p></div>
        <div class="item" >
          <p><span style={{ width: "60%", float: "right" }}>
            <label id="txt_invdt">{invdt}</label></span></p></div>

        <div class="item" >
          <p><span style={{ width: "40%", float: "left" }}>Vendor:&nbsp;&nbsp;
          </span></p></div>
        <div class="item" >
          <p><span style={{ width: "60%", float: "right" }}>
            <label id="txt_vendor">{vendor}</label></span></p></div>

        <div class="item" >
          <p> <span style={{ width: "40%", float: "left" }}> Amount:&nbsp;&nbsp;
          </span></p></div>
        <div class="item">
          <p><span style={{ width: "60%", float: "right" }}>
            <label id="txt_amt">{invtotal}</label></span></p>
        </div>

        <div class="item" >
          <p><span style={{ width: "40%", float: "left" }}>
            Payment Status:&nbsp;&nbsp;</span></p></div>
        <div class="item" >
          <p><span style={{ width: "60%", float: "right" }}>
            <label id="txt_status">{pstat}</label></span></p>
        </div>

        <div class="item">
          <p>Payee Account Number<span style={{ fontColor: "red" }}>*</span></p>
          <input type="text" id="txt_accno" name="accno" />
        </div>
        <div class="item">
          <p>Payee Routing Number<span style={{ fontColor: "red" }}>*</span></p>
          <input type="text" id="txt_routno" name="routno" />
        </div>
        <div class="item">
          <p>Notes</p>
          <textarea rows="2"></textarea>
        </div>
        <div class="btn-block">
          <button onClick={clickToPay} type="button" id="btn-send" >SEND</button>
        </div>
      </form>
    </div>
  );
}


// export default DropdownControlledMultiExample;

export function PaymentDashboard() {
  return (
    <Routes>
      <Route path="/" element={<DropdownControlledMultiExample />} exact />
      <Route path="/payment" element={<InvoiceDetails />} exact />
      
    </Routes>
  );
}

export default PaymentDashboard;
