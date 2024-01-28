/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import {
  InternalServerErrorException,
  Logger,
  RequestMethod,
  StreamableFile,
  VersioningType,
} from '@nestjs/common';
import {
  VERSION_NEUTRAL,
  VersionValue,
  VersioningOptions,
} from '@nestjs/common/interfaces';
import { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import {
  isNil,
  isObject,
  isString,
  isUndefined,
} from '@nestjs/common/utils/shared.utils';
import { AbstractHttpAdapter } from '@nestjs/core/adapters/http-adapter';
import { RouterMethodFactory } from '@nestjs/core/helpers/router-method-factory';
import { parse } from 'content-type';
import {
  Request,
  Response,
  Server,
  ServerConstructorOptions,
} from 'hyper-express';
import * as cors from 'cors';

type VersionedRoute = <
  TRequest extends Record<string, any> = any,
  TResponse = any,
>(
  req: TRequest,
  res: TResponse,
  next: () => void,
) => any;

export class HyperExpressAdapter extends AbstractHttpAdapter<
  Server,
  Request,
  Response
> {
  private readonly routerMethodFactory = new RouterMethodFactory();
  private readonly logger = new Logger(HyperExpressAdapter.name);

  constructor(private opts?: ServerConstructorOptions) {
    super();

    this.httpServer = this.instance = new Server(this.opts);
  }

  port: number;
  once() {}
  removeListener() {}

  address() {
    return `0.0.0.0:${this.port}`;
  }

  public reply(response: Response, body: any, statusCode?: number) {
    if (statusCode) {
      // console.log('response', response);
      response.status(statusCode);
    }
    if (isNil(body)) {
      return response.end();
    }
    if (body instanceof StreamableFile) {
      const streamHeaders = body.getHeaders();
      if (
        response.getHeader('Content-Type') === undefined &&
        streamHeaders.type !== undefined
      ) {
        response.setHeader('Content-Type', streamHeaders.type);
      }
      if (
        response.getHeader('Content-Disposition') === undefined &&
        streamHeaders.disposition !== undefined
      ) {
        response.setHeader('Content-Disposition', streamHeaders.disposition);
      }
      if (
        response.getHeader('Content-Length') === undefined &&
        streamHeaders.length !== undefined
      ) {
        response.setHeader('Content-Length', streamHeaders.length.toString());
      }
      return body.getStream().pipe(response);
    }
    return isObject(body) ? response.json(body) : response.end(String(body));
  }

  public status(response: Response, statusCode: number) {
    return response.status(statusCode);
  }

  end(response: Response, message?: string) {
    response.end(message);
  }

  public render(response: Response, view: string, options: any) {
    throw Error('Not implemented');
  }

  public redirect(response: Response, statusCode: number, url: string) {
    response.status(statusCode);
    response.redirect(url);
  }

  public setErrorHandler(handler: Function, prefix?: string) {
    this.getInstance<Server>().set_error_handler(
      handler.bind(this.getInstance<Server>()),
    );
  }

  public setNotFoundHandler(handler: Function, prefix?: string) {
    this.getInstance<Server>().set_not_found_handler(
      handler.bind(this.getInstance<Server>()),
    );
  }

  isHeadersSent(response: Response): boolean {
    return response.headersSent;
  }

  public setHeader(response: Response, name: string, value: string) {
    return response.setHeader(name, value);
  }

  public listen(port: string | number, callback?: () => void);
  public listen(port: string | number, hostname: string, callback?: () => void);
  public listen(port: any, hostname?: any, callback?: any) {
    this.port = port;
    const host = typeof hostname === 'string' ? hostname : undefined;
    const fn = callback || hostname;
    this.instance.listen(Number(port), host).then(() => {
      fn && fn(port);
    });
  }

  getHttpServer(): any {
    return this;
  }

  public close() {
    if (!this.instance) {
      return undefined;
    }
    return Promise.resolve(this.instance.close());
  }

  public set(...args: any[]) {
    throw Error('Not implemented');
  }

  public enable(...args: any[]) {
    throw Error('Not implemented');
  }

  public disable(...args: any[]) {
    throw Error('Not implemented');
  }

  public engine(...args: any[]) {
    throw Error('Not implemented');
  }

  public useStaticAssets(
    path: string,
    // options: Options & { prefix?: string },
  ) {
    // const LiveDirectory = loadPackage(
    //     'LiveDirectory',
    //     'HyperExpressAdapter',
    //     () => require('live-directory'),
    // );
  }

  public setBaseViewsDir(path: string | string[]) {
    throw Error('Not implemented');
  }

  public setViewEngine(engine: string) {
    throw Error('Not implemented');
  }

  public getRequestHostname(request: Request): string {
    return request.hostname;
  }

  public getRequestMethod(request: Request): string {
    return request.method;
  }

  public getRequestUrl(request: Request): string {
    return request.originalUrl;
  }

  public enableCors(options: CorsOptions | CorsOptionsDelegate<any>) {
    return this.use(cors(options));
  }

  public createMiddlewareFactory(
    requestMethod: RequestMethod,
  ): (path: string, callback: Function) => any {
    return this.routerMethodFactory
      .get(this.instance, requestMethod)
      .bind(this.instance);
  }

  public initHttpServer(_options: NestApplicationOptions) {}

  public registerParserMiddleware() {
    this.instance.use(async (req, _res, _next) => {
      const contentType = req.header('Content-Type');
      if (!contentType) return;
      const type = parse(contentType);
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

  public setLocal(key: string, value: any) {
    this.instance.locals[key] = value;
    return this;
  }

  public getType(): string {
    //for compatibillity
    // console.log('hyper-express');
    return 'hyper-express';
  }

  public applyVersionFilter(
    handler: Function,
    version: VersionValue,
    versioningOptions: VersioningOptions,
  ): VersionedRoute {
    const callNextHandler: VersionedRoute = (req, res, next) => {
      if (!next) {
        throw new InternalServerErrorException(
          'HTTP adapter does not support filtering on version',
        );
      }
      return next();
    };

    if (
      version === VERSION_NEUTRAL ||
      // URL Versioning is done via the path, so the filter continues forward
      versioningOptions.type === VersioningType.URI
    ) {
      const handlerForNoVersioning: VersionedRoute = (req, res, next) =>
        handler(req, res, next);

      return handlerForNoVersioning;
    }

    // Custom Extractor Versioning Handler
    if (versioningOptions.type === VersioningType.CUSTOM) {
      const handlerForCustomVersioning: VersionedRoute = (req, res, next) => {
        const extractedVersion = versioningOptions.extractor(req);

        if (Array.isArray(version)) {
          if (
            Array.isArray(extractedVersion) &&
            version.filter((v) => extractedVersion.includes(v as string)).length
          ) {
            return handler(req, res, next);
          }

          if (
            isString(extractedVersion) &&
            version.includes(extractedVersion)
          ) {
            return handler(req, res, next);
          }
        } else if (isString(version)) {
          // Known bug here - if there are multiple versions supported across separate
          // handlers/controllers, we can't select the highest matching handler.
          // Since this code is evaluated per-handler, then we can't see if the highest
          // specified version exists in a different handler.
          if (
            Array.isArray(extractedVersion) &&
            extractedVersion.includes(version)
          ) {
            return handler(req, res, next);
          }

          if (isString(extractedVersion) && version === extractedVersion) {
            return handler(req, res, next);
          }
        }

        return callNextHandler(req, res, next);
      };

      return handlerForCustomVersioning;
    }

    // Media Type (Accept Header) Versioning Handler
    if (versioningOptions.type === VersioningType.MEDIA_TYPE) {
      const handlerForMediaTypeVersioning: VersionedRoute = (
        req,
        res,
        next,
      ) => {
        const MEDIA_TYPE_HEADER = 'Accept';
        const acceptHeaderValue: string | undefined =
          req.headers?.[MEDIA_TYPE_HEADER] ||
          req.headers?.[MEDIA_TYPE_HEADER.toLowerCase()];

        const acceptHeaderVersionParameter = acceptHeaderValue
          ? acceptHeaderValue.split(';')[1]
          : undefined;

        // No version was supplied
        if (isUndefined(acceptHeaderVersionParameter)) {
          if (Array.isArray(version)) {
            if (version.includes(VERSION_NEUTRAL)) {
              return handler(req, res, next);
            }
          }
        } else {
          const headerVersion = acceptHeaderVersionParameter.split(
            versioningOptions.key,
          )[1];

          if (Array.isArray(version)) {
            if (version.includes(headerVersion)) {
              return handler(req, res, next);
            }
          } else if (isString(version)) {
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
    if (versioningOptions.type === VersioningType.HEADER) {
      const handlerForHeaderVersioning: VersionedRoute = (req, res, next) => {
        const customHeaderVersionParameter: string | undefined =
          req.headers?.[versioningOptions.header] ||
          req.headers?.[versioningOptions.header.toLowerCase()];

        // No version was supplied
        if (isUndefined(customHeaderVersionParameter)) {
          if (Array.isArray(version)) {
            if (version.includes(VERSION_NEUTRAL)) {
              return handler(req, res, next);
            }
          }
        } else {
          if (Array.isArray(version)) {
            if (version.includes(customHeaderVersionParameter)) {
              return handler(req, res, next);
            }
          } else if (isString(version)) {
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

  get(handler: any);
  get(path: any, handler: any);
  get(path: string, handler?: any): any {
    const route = typeof path === 'string' ? path : '';
    const fn = handler || path;
    this.instance.get(route, fn);
  }

  post(handler: any);
  post(path: any, handler: any);
  post(path: unknown, handler?: any): any {
    const route = typeof path === 'string' ? path : '';
    const fn = handler || path;
    this.instance.post(route, fn);
  }

  patch(handler: any);
  patch(path: any, handler: any);
  patch(path: unknown, handler?: any): any {
    const route = typeof path === 'string' ? path : '';
    const fn = handler || path;
    this.instance.patch(route, fn);
  }

  put(handler: any);
  put(path: any, handler: any);
  put(path: unknown, handler?: any): any {
    const route = typeof path === 'string' ? path : '';
    const fn = handler || path;
    this.instance.put(route, fn);
  }

  delete(handler: any);
  delete(path: any, handler: any);
  delete(path: unknown, handler?: any): any {
    const route = typeof path === 'string' ? path : '';
    const fn = handler || path;
    this.instance.delete(route, fn);
  }

  options(handler: any);
  options(path: any, handler: any);
  options(path: unknown, handler?: any): any {
    const route = typeof path === 'string' ? path : '';
    const fn = handler || path;
    this.instance.options(route, fn);
  }
}