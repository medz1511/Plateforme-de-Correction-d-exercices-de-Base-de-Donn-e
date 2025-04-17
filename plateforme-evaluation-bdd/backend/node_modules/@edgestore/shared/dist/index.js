'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var zod = require('zod');

function _define_property$1(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
/* eslint-disable @typescript-eslint/no-non-null-assertion */ const EDGE_STORE_ERROR_CODES = {
    BAD_REQUEST: 400,
    FILE_TOO_LARGE: 400,
    MIME_TYPE_NOT_ALLOWED: 400,
    UNAUTHORIZED: 401,
    UPLOAD_NOT_ALLOWED: 403,
    DELETE_NOT_ALLOWED: 403,
    CREATE_CONTEXT_ERROR: 500,
    SERVER_ERROR: 500
};
class EdgeStoreError extends Error {
    formattedMessage() {
        return `${this.message}${this.details ? `\n    Details: ${JSON.stringify(this.details)}` : ''}${this.cause ? `\n    Caused by: ${this.cause.message}` : ''}`;
    }
    formattedJson() {
        return {
            message: this.code === 'SERVER_ERROR' ? 'Internal server error' : this.message,
            code: this.code,
            details: this.details
        };
    }
    constructor(opts){
        super(opts.message);
        _define_property$1(this, "cause", void 0);
        _define_property$1(this, "code", void 0);
        _define_property$1(this, "level", void 0);
        _define_property$1(this, "details", void 0);
        this.name = 'EdgeStoreError';
        this.code = opts.code;
        this.cause = opts.cause;
        this.level = EDGE_STORE_ERROR_CODES[opts.code] >= 500 ? 'error' : 'warn';
        this.details = 'details' in opts ? opts.details : undefined;
    }
}

function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class EdgeStoreApiClientError extends Error {
    constructor(opts){
        super(opts.response.message);
        _define_property(this, "data", void 0);
        this.name = 'EdgeStoreApiClientError';
        this.data = opts.response;
    }
}

/**
 * Creates a Proxy that prints the path to the property when called.
 *
 * Example:
 *
 * ```ts
 * const pathParamProxy = createPathParamProxy();
 * console.log(pathParamProxy.ctx.user.id());
 * // Logs: "ctx.user.id"
 * console.log(pathParamProxy.input.type());
 * // Logs: "input.type"
 * ```
 */ function createPathParamProxy() {
    const getPath = (target, _prop)=>{
        const proxyFunction = ()=>target;
        return new Proxy(proxyFunction, {
            get: (_target, propChild)=>{
                return getPath(`${target}.${String(propChild)}`);
            }
        });
    };
    return new Proxy(()=>'', {
        get: (_target, prop)=>{
            return getPath(String(prop));
        }
    });
}

const createNewBuilder = (initDef, newDef)=>{
    const mergedDef = {
        ...initDef,
        ...newDef
    };
    return createBuilder({
        type: mergedDef.type
    }, mergedDef);
};
function createBuilder(opts, initDef) {
    const _def = {
        type: opts.type,
        input: zod.z.never(),
        path: [],
        metadata: ()=>({}),
        ...initDef
    };
    return {
        $config: {
            ctx: undefined
        },
        // @ts-expect-error - I think it would be too much work to make this type correct.
        _def,
        input (input) {
            return createNewBuilder(_def, {
                input
            });
        },
        path (pathResolver) {
            // TODO: Should throw a runtime error in the following cases:
            // 1. in case of multiple keys in one object
            // 2. in case of duplicate keys
            const pathParamProxy = createPathParamProxy();
            const params = pathResolver(pathParamProxy);
            return createNewBuilder(_def, {
                path: params
            });
        },
        metadata (metadata) {
            return createNewBuilder(_def, {
                metadata
            });
        },
        accessControl (accessControl) {
            return createNewBuilder(_def, {
                accessControl: accessControl
            });
        },
        beforeUpload (beforeUpload) {
            return createNewBuilder(_def, {
                beforeUpload
            });
        },
        beforeDelete (beforeDelete) {
            return createNewBuilder(_def, {
                beforeDelete
            });
        }
    };
}
class EdgeStoreBuilder {
    context() {
        return new EdgeStoreBuilder();
    }
    create() {
        return createEdgeStoreInner()();
    }
}
function createRouterFactory() {
    return function createRouterInner(buckets) {
        return {
            $config: {
                ctx: undefined
            },
            buckets
        };
    };
}
function initBucket(type, config) {
    return createBuilder({
        type
    }, {
        bucketConfig: config
    });
}
function createEdgeStoreInner() {
    return function initEdgeStoreInner() {
        return {
            /**
       * Builder object for creating an image bucket
       */ imageBucket (config) {
                return initBucket('IMAGE', config);
            },
            /**
       * Builder object for creating a file bucket
       */ fileBucket (config) {
                return initBucket('FILE', config);
            },
            /**
       * Create a router
       */ router: createRouterFactory()
        };
    };
}
/**
 * Initialize EdgeStore - be done exactly once per backend
 */ const initEdgeStore = new EdgeStoreBuilder(); // ↓↓↓ TYPE TESTS ↓↓↓
 // type Context = {
 //   userId: string;
 //   userRole: 'admin' | 'visitor';
 // };
 // const es = initEdgeStore.context<Context>().create();
 // const imagesBucket = es.imageBucket()
 //   .input(
 //     z.object({
 //       type: z.enum(['profile', 'post']),
 //       extension: z.string().optional(),
 //     }),
 //   )
 //   .path(({ ctx, input }) => [{ author: ctx.userId }, { type: input.type }])
 //   .metadata(({ ctx, input }) => ({
 //     extension: input.extension,
 //     role: ctx.userRole,
 //   }))
 //   .beforeUpload(() => {
 //     return true;
 //   });
 // const a = es.imageBucket()
 //   .input(z.object({ type: z.string(), someMeta: z.string().optional() }))
 //   .path(({ ctx, input }) => [{ author: ctx.userId }, { type: input.type }])
 //   .metadata(({ ctx, input }) => ({
 //     role: ctx.userRole,
 //     someMeta: input.someMeta,
 //   }))
 //   .accessControl({
 //     OR: [
 //       {
 //         userId: { path: 'author' }, // this will check if the userId is the same as the author in the path parameter
 //       },
 //       {
 //         userRole: 'admin', // this is the same as { userRole: { eq: "admin" } }
 //       },
 //     ],
 //   })
 //   .beforeUpload(({ ctx, input }) => {
 //     return true;
 //   })
 //   .beforeDelete(({ ctx, file }) => {
 //     return true;
 //   });
 // const b = es.imageBucket().path(({ ctx }) => [{ author: ctx.userId }]);
 // const router = es.router({
 //   original: imagesBucket,
 //   imageBucket: a,
 //   imageBucket2: b,
 // });
 // export { router };
 // type ListFilesResponse<TBucket extends AnyRouter['buckets'][string]> = {
 //   data: {
 //     // url: string;
 //     // size: number;
 //     // uploadedAt: Date;
 //     // metadata: InferMetadataObject<TBucket>;
 //     path: InferBucketPathKeys<TBucket> extends string ? {
 //       [key: string]: string;
 //     } :{
 //       [TKey in InferBucketPathKeys<TBucket>]: string;
 //     };
 //   }[];
 //   pagination: {
 //     currentPage: number;
 //     totalPages: number;
 //     totalCount: number;
 //   };
 // };
 // type TPathKeys = 'author' | 'type';
 // type TPathKeys2 = InferBucketPathKeys<AnyBuilder>;
 // type ObjectWithKeys<TKeys extends string> = {
 //   [TKey in TKeys]: string;
 // };
 // type Test1 = ObjectWithKeys<TPathKeys>;
 // type Test2 = ObjectWithKeys<TPathKeys2>;
 // type PathKeys = InferBucketPathKeys<typeof router.buckets.imageBucket>;
 // type MetadataKeys = InferMetadataObject<typeof router.buckets.imageBucket>;
 // type MyEdgeStoreRouter = typeof router;
 // type MyAccessControl = AccessControlSchema<Context, AnyDef>;

exports.EDGE_STORE_ERROR_CODES = EDGE_STORE_ERROR_CODES;
exports.EdgeStoreApiClientError = EdgeStoreApiClientError;
exports.EdgeStoreError = EdgeStoreError;
exports.initEdgeStore = initEdgeStore;
