const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (app){
    let res;

   await fetch('https://gamblingappapi.herokuapp.com/admin/api/trds3f2333/getAppInUse/')
      .then(res => res.json()) 
      .then(json =>res=json);
     
      if(res){
          return res
      }else false; 

} 

