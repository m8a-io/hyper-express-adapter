"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHttpRequest = exports.sendCanceledHttpRequest = exports.getHttpBaseOptions = void 0;
const http_1 = require("http");
const url_1 = require("url");
const getHttpBaseOptions = async (app) => {
    const url = await app.getUrl();
    return new url_1.URL(url);
};
exports.getHttpBaseOptions = getHttpBaseOptions;
const sendCanceledHttpRequest = async (url) => {
    return new Promise((resolve, reject) => {
        const req = (0, http_1.request)(url, res => {
            res.on('data', () => {
                req.destroy();
            });
            res.on('close', resolve);
        });
        req.end();
    });
};
exports.sendCanceledHttpRequest = sendCanceledHttpRequest;
const sendHttpRequest = async (url) => {
    return new Promise((resolve, reject) => {
        const req = (0, http_1.request)(url, res => {
            res.on('data', chunk => {
            });
            res.on('error', err => {
                reject(err);
            });
            res.on('end', () => {
                resolve(res);
            });
        });
        req.end();
    });
};
exports.sendHttpRequest = sendHttpRequest;
//# sourceMappingURL=utils.js.map