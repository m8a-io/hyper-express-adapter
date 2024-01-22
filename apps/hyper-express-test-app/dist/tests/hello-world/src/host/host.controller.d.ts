import { Observable } from 'rxjs';
import { HostService } from './host.service';
export declare class HostController {
    private readonly hostService;
    constructor(hostService: HostService);
    greeting(tenant: string): string;
    asyncGreeting(tenant: string): Promise<string>;
    streamGreeting(tenant: string): Observable<string>;
    localPipe(user: any, tenant: string): any;
}
