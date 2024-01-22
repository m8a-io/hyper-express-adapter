"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_hyper_express_1 = require("platform-hyper-express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_hyper_express_1.HyperExpressAdapter());
    await app.listen(3001);
}
bootstrap();
//# sourceMappingURL=main.js.map