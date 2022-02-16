const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
module.exports= async function  (id){
    let flag=false;

   await fetch('https://gamblingappapi.herokuapp.com/admin/api/trds3f2333/showApp/', {
        method: 'PUT',
        body: JSON.stringify(id),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => flag=true).catch(er=>console.log(er))
      return flag

} 