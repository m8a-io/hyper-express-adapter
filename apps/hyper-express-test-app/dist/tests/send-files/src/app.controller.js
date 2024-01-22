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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const app_service_1 = require("./app.service");
const non_file_1 = require("./non-file");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getFile() {
        return this.appService.getReadStream();
    }
    getBuffer() {
        return this.appService.getBuffer();
    }
    getNonFile() {
        return this.appService.getNonFile();
    }
    getRxJSFile() {
        return this.appService.getRxJSFile();
    }
    getFileWithHeaders() {
        return this.appService.getFileWithHeaders();
    }
    getNonExistantFile() {
        return this.appService.getFileThatDoesNotExist();
    }
    getSlowFile() {
        return this.appService.getSlowStream();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('file/stream'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], AppController.prototype, "getFile", null);
__decorate([
    (0, common_1.Get)('file/buffer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], AppController.prototype, "getBuffer", null);
__decorate([
    (0, common_1.Get)('non-file/pipe-method'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", non_file_1.NonFile)
], AppController.prototype, "getNonFile", null);
__decorate([
    (0, common_1.Get)('file/rxjs/stream'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], AppController.prototype, "getRxJSFile", null);
__decorate([
    (0, common_1.Get)('file/with/headers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], AppController.prototype, "getFileWithHeaders", null);
__decorate([
    (0, common_1.Get)('file/not/exist'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], AppController.prototype, "getNonExistantFile", null);
__decorate([
    (0, common_1.Get)('/file/slow'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", common_1.StreamableFile)
], AppController.prototype, "getSlowFile", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map