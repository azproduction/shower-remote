var os = require('os');

module.exports = function () {
    var interfaces = os.networkInterfaces();

    return Object.keys(interfaces).reduce(function (interfacesIps, interfaceName) {
        interfaces[interfaceName].forEach(function (interfaceInfo) {
            if (!interfaceInfo.internal) {
                interfacesIps.push(interfaceInfo.address);
            }
        });

        return interfacesIps;
    }, []);
};
