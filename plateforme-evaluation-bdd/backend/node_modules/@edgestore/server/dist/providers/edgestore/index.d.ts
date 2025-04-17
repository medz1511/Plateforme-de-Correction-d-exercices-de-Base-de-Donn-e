import { type Provider } from '@edgestore/shared';
export type EdgeStoreProviderOptions = {
    /**
     * Access key for your EdgeStore project.
     * Can be found in the EdgeStore dashboard.
     *
     * This can be omitted if the `EDGE_STORE_ACCESS_KEY` environment variable is set.
     */
    accessKey?: string;
    /**
     * Secret key for your EdgeStore project.
     * Can be found in the EdgeStore dashboard.
     *
     * This can be omitted if the `EDGE_STORE_SECRET_KEY` environment variable is set.
     */
    secretKey?: string;
};
export declare function EdgeStoreProvider(options?: EdgeStoreProviderOptions): Provider;
//# sourceMappingURL=index.d.ts.map