declare var Route: any;
declare var Router: any;
/**
 * Expose `createApplication()`.
 */
export default createApplication;
/**
 * Create an express application.
 *
 * @return {Function}
 * @api public
 */
declare function createApplication(config: any): any;
/**
 * Expose the prototypes.
 */
export declare const application: any;
export declare const request: any;
export declare const response: any;
/**
 * Expose constructors.
 */
export { Route, Router };
/**
 * Expose middleware
 */
export declare const json: any;
export declare const query: any;
export declare const serveStatic: any;
export declare const urlencoded: any;
