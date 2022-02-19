const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (userId){
    let res;

   await fetch(`https://guruapigamb.site/admin/user/api/trds3f2333/getUser/${userId}`)
      .then(res => res.json()) 
      .then(json =>res=json).catch(er=>console.log(er))
     
      if(res){
          return res
      }else false; 

} 

