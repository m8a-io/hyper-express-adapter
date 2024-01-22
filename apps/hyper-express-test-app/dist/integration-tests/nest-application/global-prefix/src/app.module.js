"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.MIDDLEWARE_PARAM_VALUE = exports.MIDDLEWARE_VALUE = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
exports.MIDDLEWARE_VALUE = 'middleware';
exports.MIDDLEWARE_PARAM_VALUE = 'middleware_param';
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply((req, res, next) => res.end(exports.MIDDLEWARE_VALUE))
            .forRoutes({ path: exports.MIDDLEWARE_VALUE, method: common_1.RequestMethod.GET })
            .apply((req, res, next) => res.status(201).end(exports.MIDDLEWARE_VALUE))
            .forRoutes({ path: exports.MIDDLEWARE_VALUE, method: common_1.RequestMethod.POST })
            .apply((req, res, next) => res.end(exports.MIDDLEWARE_PARAM_VALUE))
            .forRoutes({ path: exports.MIDDLEWARE_VALUE + '/*', method: common_1.RequestMethod.GET })
            .apply((req, res, next) => res.status(201).end(exports.MIDDLEWARE_PARAM_VALUE))
            .forRoutes({ path: exports.MIDDLEWARE_VALUE + '/*', method: common_1.RequestMethod.POST })
            .apply((req, res, next) => {
            req.extras = { data: 'Data attached in middleware' };
            next();
        })
            .forRoutes({ path: '*', method: common_1.RequestMethod.GET })
            .apply((req, res, next) => {
            req.middlewareParams = req.params;
            next();
        })
            .forRoutes({ path: '*', method: common_1.RequestMethod.GET });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map