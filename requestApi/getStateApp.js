const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (app){
    let res;

   await fetch('https://guruapigamb.site/admin/api/trds3f2333/StateApp/')
      .then(res => res.json()) 
      .then(json =>res=json).catch(er=>console.log(er))
     
      if(res){
          return res
      }else false; 

} 

