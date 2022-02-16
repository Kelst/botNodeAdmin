const gplay = require('google-play-scraper');
const { penndingApp } = require('../helper/modeApp');
const hideApp=require("./hideApp")
module.exports= async function  (pendingAp,googleApp){
    let res;
 await   pendingAp.forEach(async element => {
 await   gplay.app({appId: `${element.bundle}`})
    .then(async()=>{
       await hideApp({app_id:element._id})
       
    }, console.log).catch(er=>console.log(er))
    });


} 
 