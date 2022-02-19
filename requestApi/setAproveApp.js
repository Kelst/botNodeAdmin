const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
module.exports = async function (body) {
  let flag = false;

<<<<<<< HEAD
   await fetch('https://guruapigamb.site/admin/api/trds3f2333/approveApp/', {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => flag=true)
      .catch(er=>console.log(er))
      return flag
=======
  await fetch('https://gamblingappapi.herokuapp.com/admin/api/trds3f2333/approveApp/', {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json())
    .then(json => flag = true)
    .catch(er => console.log(er))
  return flag
>>>>>>> c988111b32346123d7183bebbe1ffe3a88ec6e5d

}
