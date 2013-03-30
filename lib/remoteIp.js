var os = require('os');

module.exports = function () {
    var interfaces = os.networkInterfaces(),
        ipv4 = [],
        ipv6 = [];

    Object.keys(interfaces).forEach(function (interfaceName) {
        interfaces[interfaceName].forEach(function (interfaceInfo) {
            if (!interfaceInfo.internal) {
                if (interfaceInfo.family === 'IPv4') {
                    ipv4.push(interfaceInfo.address);
                } else {
                    ipv6.push(interfaceInfo.address);
                }
            }
        });
    });

    return ipv4.concat(ipv6);
};
