// import * as React from 'react';
import React, { Component, useState, useEffect } from 'react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles, } from '@fluentui/react/lib/Dropdown';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Stack, IStackTokens } from '@fluentui/react';
import { HashRouter as Router, Routes, useLocation, Redirect, Route, useNavigate } from "react-router-dom";
import { getInvoiceItems } from './util.js';
import { Button } from '@fluentui/react-northstar';
import { PlayIcon } from '@fluentui/react-icons-northstar';

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

  const onChange = (event, item) => {
    if (item) {
      setSelectedKeys(
        item.selected ? [...selectedKeys, item.key] : selectedKeys.filter(key => key !== item.key),
      );
    }
  };

  const submitClicked = () => {
    console.log("========> Form submitted:" + selectedKeys );
    navigate('/payment', {
      state: {
      }
    });    
  };

  return (
    <Stack horizontal tokens={stackTokens}>
      <Dropdown
        placeholder="Select options"
        // label="Multi-select controlled example"
        selectedKeys={selectedKeys}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onChange}
        multiSelect
        options={DropdownControlledMultiExampleOptions}
        styles={dropdownStyles}
      />
      <PrimaryButton text="Submit" onClick={submitClicked} /*allowDisabledFocus disabled={disabled} checked={checked}*/ />
    </Stack>
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

  const handleClick = () => {
    navigate('/confirmpay', {
      state: {
        invtotal: inv_total,
        invid: invid,
        vendor: vendor,
        pstat: pstat,
        invdt: invdt,
        btid: btid,
      }
    });
  };

  var [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      result = await getInvoiceItems();
      inv_total = 0;
      invid = (result[0].invoice_no);
      invdt = (result[0].invoice_dt);
      vendor = (result[0].vendor_name);
      pstat = (result[0].invoice_status);
      btid = (result[0].bank_transaction_id);

      for (var i = 0; i < result.length; i++)
        inv_total += (result[i].total_cost);

      console.log(invid);
      setData(result);
    }
    navigate("", { replace: true });
    fetchData();

  }, []);

  return (


    <>
      <div className="container">

        <h1>Invoice</h1>
        <br></br><br></br>
        <table id="inv-table" className="inv-table">
          <thead>
            <tr>
              <th>Items</th>
              <th>Rate</th>
              <th>Quantity</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {
              data.map((item) => (
                <tr key={item.item_description}>
                  <td> {item.item_description}</td>
                  <td>{item.price_per_unit}</td>
                  <td>{item.no_of_units}</td>
                  <td>{item.total_cost}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <div className="item">
          <p>Total Amount &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            &nbsp;<span style={{ fontColor: "blue" }}> {inv_total} <label id="txt_total"></label></span></p>
        </div>

        <div className="item">
          <p>Payment Status &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            &nbsp;<span style={{ fontColor: "blue" }}> <label id="txt_status">{pstat}</label></span></p>
        </div>
        <div>
          <p>Payment Confirmation ID : &nbsp;<span style={{ fontColor: "blue" }}>{btid}<label id="txt_btid"></label></span></p>
        </div>

        <div>

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
      <Route path="/confirmpay" element={<ConfirmPay />} />
    </Routes>
  );
}

export default PaymentDashboard;
