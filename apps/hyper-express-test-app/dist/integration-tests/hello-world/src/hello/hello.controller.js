"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const hello_service_1 = require("./hello.service");
const user_by_id_pipe_1 = require("./users/user-by-id.pipe");
let HelloController = class HelloController {
    constructor(helloService) {
        this.helloService = helloService;
    }
    greeting() {
        return this.helloService.greeting();
    }
    async asyncGreeting() {
        return this.helloService.greeting();
    }
    streamGreeting() {
        return (0, rxjs_1.of)(this.helloService.greeting());
    }
    localPipe(user) {
        return user;
    }
};
exports.HelloController = HelloController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Header)('Authorization', 'Bearer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], HelloController.prototype, "greeting", null);
__decorate([
    (0, common_1.Get)('async'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HelloController.prototype, "asyncGreeting", null);
__decorate([
    (0, common_1.Get)('stream'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], HelloController.prototype, "streamGreeting", null);
__decorate([
    (0, common_1.Get)('local-pipe/:id'),
    __param(0, (0, common_1.Param)('id', user_by_id_pipe_1.UserByIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], HelloController.prototype, "localPipe", null);
exports.HelloController = HelloController = __decorate([
    (0, common_1.Controller)('hello'),
    __metadata("design:paramtypes", [hello_service_1.HelloService])
], HelloController);
//# sourceMappingURL=hello.controller.js.map