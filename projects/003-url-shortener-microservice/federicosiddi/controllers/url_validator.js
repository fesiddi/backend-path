const { lookup } = require('dns');
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function validate_url(myUrl) {
    try {
        const response = await fetch(myUrl, {
            method: 'HEAD',
        });
        console.log('response: ', response.status);
        if (response.ok || response.status == 405) {
            return myUrl;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}
function dns_validator(myUrl) {
    lookup(myUrl.hostname, (err, address, family) => {
        if (err) {
            return err;
        }
        console.log(address, family);
    });
    return myUrl;
}

module.exports = {
    validate_url,
    dns_validator,
};
