import { type Simplify } from '../types';
export declare const EDGE_STORE_ERROR_CODES: {
    readonly BAD_REQUEST: 400;
    readonly FILE_TOO_LARGE: 400;
    readonly MIME_TYPE_NOT_ALLOWED: 400;
    readonly UNAUTHORIZED: 401;
    readonly UPLOAD_NOT_ALLOWED: 403;
    readonly DELETE_NOT_ALLOWED: 403;
    readonly CREATE_CONTEXT_ERROR: 500;
    readonly SERVER_ERROR: 500;
};
export type EdgeStoreErrorCodeKey = keyof typeof EDGE_STORE_ERROR_CODES;
export type EdgeStoreErrorDetails<TCode extends EdgeStoreErrorCodeKey> = TCode extends 'FILE_TOO_LARGE' ? {
    maxFileSize: number;
    fileSize: number;
} : TCode extends 'MIME_TYPE_NOT_ALLOWED' ? {
    allowedMimeTypes: string[];
    mimeType: string;
} : never;
export type EdgeStoreJsonResponse = Simplify<{
    message: string;
    code: 'FILE_TOO_LARGE';
    details: EdgeStoreErrorDetails<'FILE_TOO_LARGE'>;
} | {
    message: string;
    code: 'MIME_TYPE_NOT_ALLOWED';
    details: EdgeStoreErrorDetails<'MIME_TYPE_NOT_ALLOWED'>;
} | {
    message: string;
    code: Exclude<EdgeStoreErrorCodeKey, 'FILE_TOO_LARGE' | 'MIME_TYPE_NOT_ALLOWED'>;
}>;
export declare class EdgeStoreError<TCode extends EdgeStoreErrorCodeKey> extends Error {
    readonly cause?: Error;
    readonly code: TCode;
    readonly level: 'error' | 'warn';
    readonly details: EdgeStoreErrorDetails<TCode>;
    constructor(opts: {
        message: string;
        code: TCode;
        cause?: Error;
    } & (EdgeStoreErrorDetails<TCode> extends undefined ? object : {
        details: EdgeStoreErrorDetails<TCode>;
    }));
    formattedMessage(): string;
    formattedJson(): EdgeStoreJsonResponse;
}
//# sourceMappingURL=EdgeStoreError.d.ts.map