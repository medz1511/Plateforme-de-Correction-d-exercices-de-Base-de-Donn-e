type RecursivePathProxy = {
    (): string;
    ctx: any;
    input: any;
};
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
 */
export declare function createPathParamProxy(): RecursivePathProxy;
export {};
//# sourceMappingURL=createPathParamProxy.d.ts.map