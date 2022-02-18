const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
module.exports = async function () {
   let res = [];

   await fetch('https://gamblingappapi.herokuapp.com/admin/api/trds3f2333/getModerateApp/')
      .then(res => res.json())
      .then(json => res = json).catch(er => console.log(er))

   return res;
}

