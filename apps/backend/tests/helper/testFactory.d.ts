interface props {
    path: string;
    data?: object;
    expectedStatus?: number;
    id?: number;
}
export declare class testFactory {
    token: string | null;
    cookie: string | null;
    port: number;
    logs?: boolean;
    constructor();
    setup(username?: string, password?: string): Promise<string | null>;
    logout(expectedStatus?: number): Promise<void>;
    post({ path, data, expectedStatus, id }: props): Promise<any>;
    patch({ path, data, expectedStatus, id }: props): Promise<any>;
    get({ path, expectedStatus, id }: props): Promise<any>;
    delete({ path, expectedStatus, id }: props): Promise<any>;
    setupSocket(): Promise<number>;
    closeSocket(): Promise<void>;
    logOutput(requestType: string, fullPath: string, input?: object | null | string, output?: object | null, success?: boolean): void;
}
export {};
//# sourceMappingURL=testFactory.d.ts.map