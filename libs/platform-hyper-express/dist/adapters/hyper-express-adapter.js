"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperExpressAdapter = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
const common_1 = require("@nestjs/common");
const interfaces_1 = require("@nestjs/common/interfaces");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const http_adapter_1 = require("@nestjs/core/adapters/http-adapter");
const router_method_factory_1 = require("@nestjs/core/helpers/router-method-factory");
const content_type_1 = require("content-type");
const hyper_express_1 = require("hyper-express");
class HyperExpressAdapter extends http_adapter_1.AbstractHttpAdapter {
    constructor(opts) {
        super();
        this.opts = opts;
        this.routerMethodFactory = new router_method_factory_1.RouterMethodFactory();
        this.logger = new common_1.Logger(HyperExpressAdapter.name);
        this.httpServer = this.instance = new hyper_express_1.Server(this.opts);
    }
    once() { }
    removeListener() { }
    address() {
        return `0.0.0.0:${this.port}`;
    }
    reply(response, body, statusCode) {
        if (statusCode) {
            // console.log('response', response);
            response.status(statusCode);
        }
        if ((0, shared_utils_1.isNil)(body)) {
            return response.end();
        }
        if (body instanceof common_1.StreamableFile) {
            const streamHeaders = body.getHeaders();
            if (response.getHeader('Content-Type') === undefined &&
                streamHeaders.type !== undefined) {
                response.setHeader('Content-Type', streamHeaders.type);
            }
            if (response.getHeader('Content-Disposition') === undefined &&
                streamHeaders.disposition !== undefined) {
                response.setHeader('Content-Disposition', streamHeaders.disposition);
            }
            if (response.getHeader('Content-Length') === undefined &&
                streamHeaders.length !== undefined) {
                response.setHeader('Content-Length', streamHeaders.length.toString());
            }
            return body.getStream().pipe(response);
        }
        return (0, shared_utils_1.isObject)(body) ? response.json(body) : response.end(String(body));
    }
    status(response, statusCode) {
        return response.status(statusCode);
    }
    end(response, message) {
        response.end(message);
    }
    render(response, view, options) {
        throw Error('Not implemented');
    }
    redirect(response, statusCode, url) {
        response.status(statusCode);
        response.redirect(url);
    }
    setErrorHandler(handler, prefix) {
        this.getInstance().set_error_handler(handler.bind(this.getInstance()));
    }
    setNotFoundHandler(handler, prefix) {
        this.getInstance().set_not_found_handler(handler.bind(this.getInstance()));
    }
    isHeadersSent(response) {
        return response.headersSent;
    }
    setHeader(response, name, value) {
        return response.setHeader(name, value);
    }
    listen(port, hostname, callback) {
        this.port = port;
        const host = typeof hostname === 'string' ? hostname : undefined;
        const fn = callback || hostname;
        this.instance.listen(Number(port), host).then(() => {
            fn && fn(port);
        });
    }
    getHttpServer() {
        return this;
    }
    close() {
        if (!this.instance) {
            return undefined;
        }
        return Promise.resolve(this.instance.close());
    }
    set(...args) {
        throw Error('Not implemented');
    }
    enable(...args) {
        throw Error('Not implemented');
    }
    disable(...args) {
        throw Error('Not implemented');
    }
    engine(...args) {
        throw Error('Not implemented');
    }
    useStaticAssets(path) {
        // const LiveDirectory = loadPackage(
        //     'LiveDirectory',
        //     'HyperExpressAdapter',
        //     () => require('live-directory'),
        // );
    }
    setBaseViewsDir(path) {
        throw Error('Not implemented');
    }
    setViewEngine(engine) {
        throw Error('Not implemented');
    }
    getRequestHostname(request) {
        return request.hostname;
    }
    getRequestMethod(request) {
        return request.method;
    }
    getRequestUrl(request) {
        return request.originalUrl;
    }
    async enableCors(options) { }
    createMiddlewareFactory(requestMethod) {
        return this.routerMethodFactory
            .get(this.instance, requestMethod)
            .bind(this.instance);
    }
    initHttpServer(_options) { }
    registerParserMiddleware() {
        this.instance.use(async (req, _res, _next) => {
            const contentType = req.header('Content-Type');
            if (!contentType)
                return;
            const type = (0, content_type_1.parse)(contentType);
            if (type.type === 'application/json') {
                req.body = await req.json({});
                return;
            }
            if (type.type === 'text/plain') {
                req.body = await req.text();
                return;
            }
            if (type.type === 'application/x-www-form-urlencoded') {
                req.body = await req.urlencoded();
                return;
            }
            if (type.type === 'application/octet-stream') {
                req.body = await req.buffer();
                return;
            }
        });
    }
    setLocal(key, value) {
        this.instance.locals[key] = value;
        return this;
    }
    getType() {
        //for compatibillity
        // console.log('hyper-express');
        return 'hyper-express';
    }
    applyVersionFilter(handler, version, versioningOptions) {
        const callNextHandler = (req, res, next) => {
            if (!next) {
                throw new common_1.InternalServerErrorException('HTTP adapter does not support filtering on version');
            }
            return next();
        };
        if (version === interfaces_1.VERSION_NEUTRAL ||
            // URL Versioning is done via the path, so the filter continues forward
            versioningOptions.type === common_1.VersioningType.URI) {
            const handlerForNoVersioning = (req, res, next) => handler(req, res, next);
            return handlerForNoVersioning;
        }
        // Custom Extractor Versioning Handler
        if (versioningOptions.type === common_1.VersioningType.CUSTOM) {
            const handlerForCustomVersioning = (req, res, next) => {
                const extractedVersion = versioningOptions.extractor(req);
                if (Array.isArray(version)) {
                    if (Array.isArray(extractedVersion) &&
                        version.filter((v) => extractedVersion.includes(v)).length) {
                        return handler(req, res, next);
                    }
                    if ((0, shared_utils_1.isString)(extractedVersion) &&
                        version.includes(extractedVersion)) {
                        return handler(req, res, next);
                    }
                }
                else if ((0, shared_utils_1.isString)(version)) {
                    // Known bug here - if there are multiple versions supported across separate
                    // handlers/controllers, we can't select the highest matching handler.
                    // Since this code is evaluated per-handler, then we can't see if the highest
                    // specified version exists in a different handler.
                    if (Array.isArray(extractedVersion) &&
                        extractedVersion.includes(version)) {
                        return handler(req, res, next);
                    }
                    if ((0, shared_utils_1.isString)(extractedVersion) && version === extractedVersion) {
                        return handler(req, res, next);
                    }
                }
                return callNextHandler(req, res, next);
            };
            return handlerForCustomVersioning;
        }
        // Media Type (Accept Header) Versioning Handler
        if (versioningOptions.type === common_1.VersioningType.MEDIA_TYPE) {
            const handlerForMediaTypeVersioning = (req, res, next) => {
                const MEDIA_TYPE_HEADER = 'Accept';
                const acceptHeaderValue = req.headers?.[MEDIA_TYPE_HEADER] ||
                    req.headers?.[MEDIA_TYPE_HEADER.toLowerCase()];
                const acceptHeaderVersionParameter = acceptHeaderValue
                    ? acceptHeaderValue.split(';')[1]
                    : undefined;
                // No version was supplied
                if ((0, shared_utils_1.isUndefined)(acceptHeaderVersionParameter)) {
                    if (Array.isArray(version)) {
                        if (version.includes(interfaces_1.VERSION_NEUTRAL)) {
                            return handler(req, res, next);
                        }
                    }
                }
                else {
                    const headerVersion = acceptHeaderVersionParameter.split(versioningOptions.key)[1];
                    if (Array.isArray(version)) {
                        if (version.includes(headerVersion)) {
                            return handler(req, res, next);
                        }
                    }
                    else if ((0, shared_utils_1.isString)(version)) {
                        if (version === headerVersion) {
                            return handler(req, res, next);
                        }
                    }
                }
                return callNextHandler(req, res, next);
            };
            return handlerForMediaTypeVersioning;
        }
        // Header Versioning Handler
        if (versioningOptions.type === common_1.VersioningType.HEADER) {
            const handlerForHeaderVersioning = (req, res, next) => {
                const customHeaderVersionParameter = req.headers?.[versioningOptions.header] ||
                    req.headers?.[versioningOptions.header.toLowerCase()];
                // No version was supplied
                if ((0, shared_utils_1.isUndefined)(customHeaderVersionParameter)) {
                    if (Array.isArray(version)) {
                        if (version.includes(interfaces_1.VERSION_NEUTRAL)) {
                            return handler(req, res, next);
                        }
                    }
                }
                else {
                    if (Array.isArray(version)) {
                        if (version.includes(customHeaderVersionParameter)) {
                            return handler(req, res, next);
                        }
                    }
                    else if ((0, shared_utils_1.isString)(version)) {
                        if (version === customHeaderVersionParameter) {
                            return handler(req, res, next);
                        }
                    }
                }
                return callNextHandler(req, res, next);
            };
            return handlerForHeaderVersioning;
        }
    }
    get(path, handler) {
        const route = typeof path === 'string' ? path : '';
        const fn = handler || path;
        this.instance.get(route, fn);
    }
    post(path, handler) {
        const route = typeof path === 'string' ? path : '';
        const fn = handler || path;
        this.instance.post(route, fn);
    }
    patch(path, handler) {
        const route = typeof path === 'string' ? path : '';
        const fn = handler || path;
        this.instance.patch(route, fn);
    }
    put(path, handler) {
        const route = typeof path === 'string' ? path : '';
        const fn = handler || path;
        this.instance.put(route, fn);
    }
    delete(path, handler) {
        const route = typeof path === 'string' ? path : '';
        const fn = handler || path;
        this.instance.delete(route, fn);
    }
    options(path, handler) {
        const route = typeof path === 'string' ? path : '';
        const fn = handler || path;
        this.instance.options(route, fn);
    }
}
exports.HyperExpressAdapter = HyperExpressAdapter;
