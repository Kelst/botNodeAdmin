
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (date){
    let flag=false;

   await fetch('https://guruapigamb.site/admin/api/trds3f2333/setUrl/', {
        method: 'PUT',
        body: JSON.stringify(date),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => flag=true)
      .catch(er=>console.log(er)).catch(er=>console.log(er))
      return flag

} 
