import { type EdgeStoreJsonResponse } from './EdgeStoreError';
export declare class EdgeStoreApiClientError extends Error {
    readonly data: EdgeStoreJsonResponse;
    constructor(opts: {
        response: EdgeStoreJsonResponse;
    });
}
export * from './EdgeStoreError';
//# sourceMappingURL=index.d.ts.map