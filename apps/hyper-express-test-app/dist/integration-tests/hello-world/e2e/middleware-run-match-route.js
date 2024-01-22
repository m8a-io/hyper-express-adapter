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
const common_1 = require("@nestjs/common");
const testing_1 = require("../../../packages/testing");
const request = require("supertest");
const chai_1 = require("chai");
let triggerCounter = 0;
let Middleware = class Middleware {
    use(req, res, next) {
        triggerCounter++;
        next();
    }
};
Middleware = __decorate([
    (0, common_1.Injectable)()
], Middleware);
let TestController = class TestController {
    testA() { }
    testB() { }
    testC() { }
    testD() { }
};
__decorate([
    (0, common_1.Get)('/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "testA", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "testB", null);
__decorate([
    (0, common_1.Get)('/static/route'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "testC", null);
__decorate([
    (0, common_1.Get)('/:id/:nested'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "testD", null);
TestController = __decorate([
    (0, common_1.Controller)()
], TestController);
let TestModule = class TestModule {
    configure(consumer) {
        consumer.apply(Middleware).forRoutes(TestController);
    }
};
TestModule = __decorate([
    (0, common_1.Module)({
        controllers: [TestController],
    })
], TestModule);
describe('Middleware (run on route match)', () => {
    let app;
    beforeEach(async () => {
        triggerCounter = 0;
        app = (await testing_1.Test.createTestingModule({
            imports: [TestModule],
        }).compile()).createNestApplication();
        await app.init();
    });
    it(`forRoutes(TestController) should execute middleware once when request url is equal match`, () => {
        return request(app.getHttpServer())
            .get('/test')
            .expect(200)
            .then(() => {
            (0, chai_1.expect)(triggerCounter).to.be.eq(1);
        });
    });
    it(`forRoutes(TestController) should execute middleware once when request url is not equal match`, () => {
        return request(app.getHttpServer())
            .get('/1')
            .expect(200)
            .then(() => {
            (0, chai_1.expect)(triggerCounter).to.be.eq(1);
        });
    });
    it(`forRoutes(TestController) should execute middleware once when request url is not of nested params`, () => {
        return request(app.getHttpServer())
            .get('/static/route')
            .expect(200)
            .then(() => {
            (0, chai_1.expect)(triggerCounter).to.be.eq(1);
        });
    });
    it(`forRoutes(TestController) should execute middleware once when request url is of nested params`, () => {
        return request(app.getHttpServer())
            .get('/1/abc')
            .expect(200)
            .then(() => {
            (0, chai_1.expect)(triggerCounter).to.be.eq(1);
        });
    });
    afterEach(async () => {
        await app.close();
    });
});
//# sourceMappingURL=middleware-run-match-route.js.map