"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const stream_1 = require("stream");
const non_file_1 = require("./non-file");
let AppService = class AppService {
    constructor() {
        this.MAX_BITES = Math.pow(2, 31) - 1;
    }
    getReadStream() {
        return new common_1.StreamableFile((0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), 'Readme.md')));
    }
    getBuffer() {
        return new common_1.StreamableFile((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), 'Readme.md')));
    }
    getNonFile() {
        return new non_file_1.NonFile('Hello world');
    }
    getRxJSFile() {
        return (0, rxjs_1.of)(this.getReadStream());
    }
    getFileWithHeaders() {
        const file = (0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), 'Readme.md'));
        return new common_1.StreamableFile((0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), 'Readme.md')), {
            type: 'text/markdown',
            disposition: 'attachment; filename="Readme.md"',
            length: file.byteLength,
        });
    }
    getFileThatDoesNotExist() {
        return new common_1.StreamableFile((0, fs_1.createReadStream)('does-not-exist.txt'));
    }
    getSlowStream() {
        const stream = new stream_1.Readable();
        stream.push(Buffer.from((0, crypto_1.randomBytes)(this.MAX_BITES)));
        stream._read = () => { };
        return new common_1.StreamableFile(stream);
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map