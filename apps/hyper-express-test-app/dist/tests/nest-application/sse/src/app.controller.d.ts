import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class AppController {
    sse(): Observable<MessageEvent>;
}
