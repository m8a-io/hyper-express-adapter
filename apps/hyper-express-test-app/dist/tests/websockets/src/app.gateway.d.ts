export declare class ApplicationGateway {
    onPush(data: any): {
        event: string;
        data: any;
    };
    getPathCalled(client: any, data: any): {
        event: string;
        data: any;
    };
    getPathCalledWithError(): import("rxjs").Observable<never>;
}
