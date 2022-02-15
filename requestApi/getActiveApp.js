const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (){
    let res=[];

   await fetch('https://gamblingappapi.herokuapp.com/admin/api/trds3f2333/getActiveApp/')
      .then(res => res.json()) 
      .then(json =>res=json);
     
   return res;
} 

 