import { Observable } from 'rxjs';
import { HostArrayService } from './host-array.service';
export declare class HostArrayController {
    private readonly hostService;
    constructor(hostService: HostArrayService);
    greeting(tenant: string): string;
    asyncGreeting(tenant: string): Promise<string>;
    streamGreeting(tenant: string): Observable<string>;
    localPipe(user: any, tenant: string): any;
}
