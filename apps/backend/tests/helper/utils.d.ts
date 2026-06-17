export declare const endpoint = "/api/v1";
export declare let accessToken: string;
interface props {
    username: string;
    password: string;
}
export declare function loginAndToken({ username, password }: props): Promise<string>;
export {};
//# sourceMappingURL=utils.d.ts.map