const dns = require("dns")
const url = require("url")
const fetch = require('node-fetch')

async function validate_url(myUrl) {
    try {
        const response = await fetch(myURL, {
            method: 'HEAD'
        });

        if (response.ok) {
            return myURL
        }
    } catch (e) {
        console.log("ERror")
        return false
    }
}
async function dns_validator(myUrl) {
    try {
        dns.lookup(myUrl, (err, address, family) => {
            console.log(address, family)
            return ({
                address: address,
                family: family
            })
        })
    } catch (err) {
        console.log("dns error")
        console.log(err)
    }

}

module.exports = {
    validate_url,
    dns_validator
}