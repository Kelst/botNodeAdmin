const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
module.exports = async function (date) {
    let flag;
    console.log(date);
    await fetch("https://gamblingappapi.herokuapp.com/admin/user/api/trds3f2333/findUser/", {
        method: 'POST',
        body: JSON.stringify(date),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
        .then(json => flag = json)
        .catch(e => console.log(e)).catch(er => console.log(er))
    return flag

} 
