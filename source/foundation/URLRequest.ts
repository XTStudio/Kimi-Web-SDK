import { URL } from "./URL";
import { Data } from "./Data";

export enum URLRequestCachePolicy {
    useProtocol,
    ignoringLocalCache,
    returnCacheElseLoad,
    returnCacheDontLoad,
}

export class URLRequest {

    constructor(aURL: URL | string, readonly cachePolicy: URLRequestCachePolicy = URLRequestCachePolicy.useProtocol, readonly timeout: number = 15) {
        this.URL = aURL instanceof URL ? aURL : (() => {
            const url = URL.URLWithString(aURL)
            if (url === undefined) {
                throw Error("invalid URLString.")
            }
            return url
        })()
    }

    readonly HTTPMethod: string | undefined = undefined

    readonly URL: URL

    readonly allHTTPHeaderFields: { [key: string]: any } | undefined = undefined

    valueForHTTPHeaderField(field: string): any | undefined {
        return undefined
    }

    readonly HTTPBody: Data | undefined

    mutable(): MutableURLRequest {
        return Object.assign(new MutableURLRequest(this.URL, this.cachePolicy, this.timeout), this)
    }

}

export class MutableURLRequest extends URLRequest {

    HTTPMethod: string | undefined = "GET"

    allHTTPHeaderFields: { [key: string]: any } | undefined = {}

    setValueForHTTPHeaderField(value: string, field: string): void {
        if (this.allHTTPHeaderFields === undefined) {
            this.allHTTPHeaderFields = {}
        }
        this.allHTTPHeaderFields[field] = value
    }

    HTTPBody: Data | undefined = undefined

    immutable(): URLRequest {
        return Object.assign(new URLRequest(this.URL, this.cachePolicy, this.timeout), this)
    }

}