
// var express = require('express');
import express from "express";
var app = express();

app.get("/", function(req,res){
    res.send("This is a test response");
})

app.listen(5555, function(){
    console.log("listening on Port 5555");
})