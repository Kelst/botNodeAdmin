    const gplay = require('google-play-scraper');
const { penndingApp } = require('../helper/modeApp');

module.exports= async function  (pendingAp,googleApp){
    let res;
 await   pendingAp.forEach(async element => {
 await   gplay.app({appId: `${element.bundle}`})
    .then(()=>{
        if(googleApp.filter(i=>i._id==element._id).length===0){
            googleApp.push(element)
        }
    }, console.log).catch(er=>console.log(er))
    });


} 
