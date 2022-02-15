const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (body){
    let flag=false;

   await fetch('https://gamblingappapi.herokuapp.com/admin/api/trds3f2333/cancelApproveApp/', {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => flag=true);
      return flag

} 
