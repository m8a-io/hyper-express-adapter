"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomPort = exports.port = void 0;
const net = require("net");
async function randomPort() {
    const server = net.createServer();
    return new Promise((resolve, reject) => {
        if (exports.port) {
            resolve(exports.port);
        }
        server.listen(0, () => {
            exports.port = server.address().port;
            server.close();
            resolve(exports.port);
        });
    });
}
exports.randomPort = randomPort;
//# sourceMappingURL=utils.js.map