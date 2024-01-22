"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperExpressAdapter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const http_adapter_1 = require("@nestjs/core/adapters/http-adapter");
const router_method_factory_1 = require("@nestjs/core/helpers/router-method-factory");
const body_parser_1 = require("body-parser");
const bodyparser = tslib_1.__importStar(require("body-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const hyperExpress = tslib_1.__importStar(require("hyper-express"));
const live_directory_1 = tslib_1.__importDefault(require("live-directory"));
const http = tslib_1.__importStar(require("http"));
const https = tslib_1.__importStar(require("https"));
const stream_1 = require("stream");
const get_body_parser_options_util_1 = require("./utils/get-body-parser-options.util");
/**
 * @publicApi
 */
class HyperExpressAdapter extends http_adapter_1.AbstractHttpAdapter {
    constructor(instance) {
        super();
        this.routerMethodFactory = new router_method_factory_1.RouterMethodFactory();
        this.logger = new common_1.Logger(HyperExpressAdapter.name);
        this.openConnections = new Set();
        if (!instance) {
            this.hyperExpress = new hyperExpress.Server();
            this.setInstance(this.hyperExpress);
        }
        this.logger.log('Nest application being created...');
    }
    reply(response, body, statusCode) {
        this.logger.log(`Replying with ${statusCode} status code`);
        if (statusCode) {
            this.logger.log('response', response);
            response.status(statusCode);
        }
        if ((0, shared_utils_1.isNil)(body)) {
            return response.send();
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
                response.setHeader('Content-Length', streamHeaders.length);
            }
            return (0, stream_1.pipeline)(body.getStream().once('error', (err) => {
                body.errorHandler(err, response);
            }), response, (err) => {
                if (err) {
                    body.errorLogger(err);
                }
            });
        }
        const responseContentType = response.getHeader('Content-Type');
        if (typeof responseContentType === 'string' &&
            !responseContentType.startsWith('application/json') &&
            body?.statusCode >= common_1.HttpStatus.BAD_REQUEST) {
            this.logger.warn("Content-Type doesn't match Reply body, you might need a custom ExceptionFilter for non-JSON responses");
            response.setHeader('Content-Type', 'application/json');
        }
        return (0, shared_utils_1.isObject)(body) ? response.json(body) : response.send(String(body));
    }
    status(response, statusCode) {
        return response.status(statusCode);
    }
    end(response, message) {
        return response.end(message);
    }
    render(response, view, options) {
        return response.render(view, options);
    }
    redirect(response, statusCode, url) {
        return response.redirect(statusCode, url);
    }
    setErrorHandler(handler, prefix) {
        return this.use(handler);
    }
    setNotFoundHandler(handler, prefix) {
        return this.use(handler);
    }
    isHeadersSent(response) {
        return response.headersSent;
    }
    setHeader(response, name, value) {
        return response.set(name, value);
    }
    listen(port, ...args) {
        return this.httpServer.listen(port, ...args);
    }
    close() {
        this.closeOpenConnections();
        if (!this.httpServer) {
            return undefined;
        }
        return new Promise(resolve => this.httpServer.close(resolve));
    }
    set(...args) {
        return this.instance.set(...args);
    }
    enable(...args) {
        return this.instance.enable(...args);
    }
    disable(...args) {
        return this.instance.disable(...args);
    }
    engine(...args) {
        return this.instance.engine(...args);
    }
    useStaticAssets(path, options) {
        const Assets = new live_directory_1.default(path, {
            // Optional: Configure filters to ignore or include certain files, names, extensions etc etc.
            filter: {
                keep: {
                    // Something like below can be used to only serve images, css, js, json files aka. most common web assets ONLY
                    extensions: ['.css', '.js', '.json', '.png', '.jpg', '.jpeg']
                },
                ignore: (path) => {
                    // You can define a function to perform any kind of matching on the path of each file being considered by LiveDirectory
                    // For example, the below is a simple dot-file ignore match which will prevent any files starting with a dot from being loaded into live-directory
                    if (options.dotfiles === 'ignore') {
                        return path.startsWith('.');
                    }
                },
            },
            // Optional: You can customize how LiveDirectory caches content under the hood
            cache: {
                // The parameters below can be tuned to control the total size of the cache and the type of files which will be cached based on file size
                // For example, the below configuration (default) should cache most <1 MB assets but will not cache any larger assets that may use a lot of memory
                // In the scenario that LiveDirectory encounters an uncached file, It will s
                max_file_count: 250, // Files will only be cached up to 250 MB of memory usage
                max_file_size: 1024 * 1024, // All files under 1 MB will be cached
            },
        });
        if (options && options.prefix) {
            return this.use(options.prefix, Assets.get(path));
        }
        return this.use(Assets.get(path));
    }
    setBaseViewsDir(path) {
        return this.set('views', path);
    }
    setViewEngine(engine) {
        return this.set('view engine', engine);
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
    enableCors(options) {
        return this.use((0, cors_1.default)(options));
    }
    createMiddlewareFactory(requestMethod) {
        return this.routerMethodFactory
            .get(this.instance, requestMethod)
            .bind(this.instance);
    }
    initHttpServer(options) {
        const isHttpsEnabled = options && options.httpsOptions;
        if (isHttpsEnabled) {
            this.httpServer = https.createServer(options.httpsOptions, this.getInstance());
        }
        else {
            this.logger.log('Got http server instance from hyper-express');
            this.httpServer = http.createServer(this.getInstance());
        }
        if (options?.forceCloseConnections) {
            this.trackOpenConnections();
        }
    }
    registerParserMiddleware(prefix, rawBody) {
        const bodyParserJsonOptions = (0, get_body_parser_options_util_1.getBodyParserOptions)(rawBody);
        const bodyParserUrlencodedOptions = (0, get_body_parser_options_util_1.getBodyParserOptions)(rawBody, {
            extended: true,
        });
        const parserMiddleware = {
            jsonParser: (0, body_parser_1.json)(bodyParserJsonOptions),
            urlencodedParser: (0, body_parser_1.urlencoded)(bodyParserUrlencodedOptions),
        };
        Object.keys(parserMiddleware)
            .filter(parser => !this.isMiddlewareApplied(parser))
            .forEach(parserKey => this.use(parserMiddleware[parserKey]));
    }
    useBodyParser(type, rawBody, options) {
        const parserOptions = (0, get_body_parser_options_util_1.getBodyParserOptions)(rawBody, options);
        const parser = bodyparser[type](parserOptions);
        this.use(parser);
        return this;
    }
    setLocal(key, value) {
        this.instance.locals[key] = value;
        return this;
    }
    getType() {
        return 'hyper-express';
    }
    applyVersionFilter(handler, version, versioningOptions) {
        const callNextHandler = (req, res, next) => {
            if (!next) {
                throw new common_1.InternalServerErrorException('HTTP adapter does not support filtering on version');
            }
            return next();
        };
        if (version === common_1.VERSION_NEUTRAL ||
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
                        version.filter(v => extractedVersion.includes(v)).length) {
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
                        if (version.includes(common_1.VERSION_NEUTRAL)) {
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
                        if (version.includes(common_1.VERSION_NEUTRAL)) {
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
    trackOpenConnections() {
        this.httpServer.on('connection', (socket) => {
            this.openConnections.add(socket);
            socket.on('close', () => this.openConnections.delete(socket));
        });
    }
    closeOpenConnections() {
        for (const socket of this.openConnections) {
            socket.destroy();
            this.openConnections.delete(socket);
        }
    }
    isMiddlewareApplied(name) {
        const app = this.getInstance();
        return (!!app._router &&
            !!app._router.stack &&
            (0, shared_utils_1.isFunction)(app._router.stack.filter) &&
            app._router.stack.some((layer) => layer && layer.handle && layer.handle.name === name));
    }
}
exports.HyperExpressAdapter = HyperExpressAdapter;
