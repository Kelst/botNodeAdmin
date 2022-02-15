// /admin/api/trds3f2333/setRedirectUrl/

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (date){
    let flag=false;
console.log(date);
   await fetch('https://gamblingappapi.herokuapp.com/admin/api/trds3f2333/setRedirectGeo/', {
        method: 'PUT',
        body: JSON.stringify(date),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => flag=true);
      return flag

} 
