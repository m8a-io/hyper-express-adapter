import { StreamableFile } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NonFile } from './non-file';
export declare class AppService {
    private readonly MAX_BITES;
    getReadStream(): StreamableFile;
    getBuffer(): StreamableFile;
    getNonFile(): NonFile;
    getRxJSFile(): Observable<StreamableFile>;
    getFileWithHeaders(): StreamableFile;
    getFileThatDoesNotExist(): StreamableFile;
    getSlowStream(): StreamableFile;
}
