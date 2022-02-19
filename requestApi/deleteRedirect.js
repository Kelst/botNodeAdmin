const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (date){
    let flag=false;
    console.log(date);

   await fetch('https://guruapigamb.site/admin/api/trds3f2333/deleteRedirect/', {
        method: 'PUT',
        body: JSON.stringify(date),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => flag=true).catch(er=>console.log(er))
      return flag
} 
