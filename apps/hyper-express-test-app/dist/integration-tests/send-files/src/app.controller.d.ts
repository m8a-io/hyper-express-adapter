import { StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { NonFile } from './non-file';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getFile(): StreamableFile;
    getBuffer(): StreamableFile;
    getNonFile(): NonFile;
    getRxJSFile(): Observable<StreamableFile>;
    getFileWithHeaders(): StreamableFile;
    getNonExistantFile(): StreamableFile;
    getSlowFile(): StreamableFile;
}
