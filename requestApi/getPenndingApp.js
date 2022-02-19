const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (app){
    let res;

   await fetch('https://guruapigamb.site/admin/api/trds3f2333/PendingApp/')
      .then(res => res.json()) 
      .then(json =>res=json)
      .catch(ek=>{res=[]})
      
      if(res){
          return res
      }else false; 

} 

 