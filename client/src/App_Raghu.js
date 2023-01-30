import './App.css';
import React, { Component, useState, useEffect } from 'react';
import './usb.css';
import { render } from 'react-dom';
import { getInvoiceItems } from './util.js';
import { HashRouter as Router, Routes, useLocation, Redirect, Route, useNavigate } from "react-router-dom";
import { Button } from '@fluentui/react-northstar';
import { PlayIcon } from '@fluentui/react-icons-northstar';
import { LineChart, LineChartPoint, AreaChart } from '@fluentui/react-charting';
import "./style.css";
import { Dropdown } from "@fluentui/react-northstar";

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
  var [checked, setChecked] = useState([]);
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



function Dashboard() {
  const LineChartPoint = [
    { x: 0, y: 0 },
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 30 },
    { x: 4, y: 40 },
  ];

  return (
    <div>
      <h1>My Dashboard</h1>
      <LineChart
        data={LineChartPoint}
        xAxisTitle="X Value"
        yAxisTitle="Y Value"
      />
    </div>
  );
}

function HomeServices() {

  const [checked, setChecked] = useState([]);
  const checkList = ["Appliance", "Doors and locks", "Electrical and lighting", "Heating & Cooling", "Plumbing and bath", "General"];
  const navigate = useNavigate();
  const [updatedServiceList, setUpdatedServiceList] = useState([]);
  const items2 = [
    {
      key: '1',
      type: 'group',
      label: 'Group title',
      children: [
        {
          key: '1-1',
          label: '1st menu item',
        },
        {
          key: '1-2',
          label: '2nd menu item',
        },
      ],
    },
    {
      key: '2',
      label: 'sub menu',
      children: [
        {
          key: '2-1',
          label: '3rd menu item',
        },
        {
          key: '2-2',
          label: '4th menu item',
        },
      ],
    },
    {
      key: '3',
      label: 'disabled sub menu',
      disabled: true,
      children: [
        {
          key: '3-1',
          label: '5d menu item',
        },
        {
          key: '3-2',
          label: '6th menu item',
        },
      ],
    },
  ];

  const handleButtonClick = () => {
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
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  // Generate string of checked items
  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
      return total + ", " + item;
    })
    : "";

  // Return classes based on whether item is checked
  var isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";

  const onChangeHandler1 = (_, event) => {
    console.log("selected value from dropdown ", event.value);
    var serviceList;
    if (event.value == 'Appliance') {
      serviceList = ['Range', 'Microwave', 'Refregirator'];
    } else if (event.value == 'Doors and locks') {
      serviceList = ['Front Door', 'Garage Door', 'Refregirator'];
    } else if (event.value == 'Electrical and lighting') {
      serviceList = ['Range', 'Microwave', 'Refregirator'];
    } else if (event.value == 'Heating & Cooling') {
      serviceList = ['Range', 'Microwave', 'Refregirator'];
    } else if (event.value == 'Plumbing and bath') {
      serviceList = ['Range', 'Microwave', 'Refregirator'];
    } else if (event.value == 'General') {
      serviceList = ['General'];
    }
    setUpdatedServiceList(serviceList);
  };
  return (
    <div className="app">
      <div className="checkList">

        <div className="title">Select service category:</div>
        <div key="builder-root" data-builder-id="builder-root">
          <Dropdown data-builder-id="rxf9q8qb8fj"
            items={["Appliance", "Doors and locks", "Electrical and lighting", "Heating & Cooling", "Plumbing and bath", "General"]}
            placeholder="Home Service" onChange={onChangeHandler1} />
        </div>
        <div className="list-container">
          {updatedServiceList.map((item) => (
            <div>
              <input value={item} type="checkbox" onChange={handleCheck} />
              <span className={isChecked(item)}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="btn-block">
        <button onClick={handleButtonClick} type="button" id="btn-send" >Next</button>
      </div>
      <div>
        {`Items checked are: ${checkedItems}`}
      </div>
    </div>
  );
}

function App() {


  return (

    <Routes>
      <Route path="/" element={<HomeServices />} exact />
      <Route path="/" element={<InvoiceDetails />} exact />
      <Route path="/confirmpay" element={<ConfirmPay />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}


export default App;