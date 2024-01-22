import { Observable } from 'rxjs';
import { HelloService } from './hello.service';
export declare class HelloController {
    private readonly helloService;
    constructor(helloService: HelloService);
    greeting(): string;
    asyncGreeting(): Promise<string>;
    streamGreeting(): Observable<string>;
    localPipe(user: any): any;
}
