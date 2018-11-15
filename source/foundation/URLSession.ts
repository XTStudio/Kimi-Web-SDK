import { URLRequest } from "./URLRequest";
import { URL } from "./URL";
import { Data } from "./Data";
import { URLResponse } from "./URLResponse";

export class URLSession {

    static readonly shared: URLSession = new URLSession

    fetch(request: string | URL | URLRequest): Promise<Data> {
        return new Promise<Data>((resolver, rejector) => {
            this.dataTask(request, (data, response, error) => {
                if (error && data !== undefined) {
                    rejector(error)
                }
                else {
                    resolver(data)
                }
            }).resume()
        })
    }

    dataTask(req: string | URL | URLRequest, complete: (data?: Data, response?: URLResponse, error?: Error) => void): URLSessionTask {
        if (req instanceof URLRequest) {
            return new URLSessionTask(req, complete)
        }
        else if (req instanceof URL) {
            return new URLSessionTask(new URLRequest(req), complete)
        }
        else {
            const currentURL = URL.URLWithString(req)
            if (currentURL !== undefined) {
                return new URLSessionTask(new URLRequest(currentURL), complete)
            }
            else {
                throw Error("invalid url.")
            }
        }
    }

}

export enum URLSessionTaskState {
    running,
    suspended,
    cancelling,
    completed,
}

export class URLSessionTask {

    constructor(readonly request: URLRequest, readonly complete: (data?: Data, response?: URLResponse, error?: Error) => void) { }

    private _xmlRequest: XMLHttpRequest | undefined = undefined

    state: URLSessionTaskState = URLSessionTaskState.suspended

    countOfBytesExpectedToReceive: number = 0

    countOfBytesReceived: number = 0

    countOfBytesExpectedToSend: number = 0

    countOfBytesSent: number = 0

    resume() {
        const xmlRequest = new XMLHttpRequest()
        xmlRequest.timeout = this.request.timeout * 1000
        xmlRequest.responseType = "arraybuffer"
        xmlRequest.open(this.request.HTTPMethod || "GET", this.request.URL.absoluteString, true)
        if (this.request.allHTTPHeaderFields) {
            for (const key in this.request.allHTTPHeaderFields) {
                if (this.request.allHTTPHeaderFields.hasOwnProperty(key)) {
                    xmlRequest.setRequestHeader(key, this.request.allHTTPHeaderFields[key])
                }
            }
        }
        xmlRequest.addEventListener("progress", (ev: ProgressEvent) => {
            if (ev.lengthComputable) {
                this.countOfBytesReceived = ev.loaded
                this.countOfBytesExpectedToReceive = ev.total
            }
        })
        xmlRequest.addEventListener("loadend", () => {
            this.state = URLSessionTaskState.completed
            const data: Data | undefined = xmlRequest.response instanceof ArrayBuffer ? new Data(xmlRequest.response) : undefined
            const response = new URLResponse
            response.URL = this.request.URL
            response.expectedContentLength = parseInt(xmlRequest.getResponseHeader('Content-Type') || "0")
            if (isNaN(response.expectedContentLength)) {
                response.expectedContentLength = 0
            }
            response.MIMEType = (() => {
                const contentType = xmlRequest.getResponseHeader('Content-Type') || ""
                return contentType.indexOf(";") >= 0 ? (contentType.split(";")[0] as string).trim() : contentType.trim()
            })()
            response.textEncodingName = (() => {
                const contentType = xmlRequest.getResponseHeader('Content-Type') || ""
                return contentType.indexOf("charset=") >= 0 ? (contentType.split("charset=").pop() as string).trim() : "UTF-8"
            })()
            response.statusCode = xmlRequest.status
            response.allHeaderFields = (() => {
                let result: any = {}
                const plainText = xmlRequest.getAllResponseHeaders()
                plainText.split("\n").forEach((it) => {
                    const sIndex = it.indexOf(": ")
                    if (sIndex >= 0) {
                        const headerKey = it.substring(0, sIndex).replace(/\b[a-z]/g, function (f) { return f.toUpperCase(); }).trim()
                        const headerValue = it.substring(sIndex + 2).trim()
                        result[headerKey] = headerValue
                    }
                })
                return result
            })()
            this.complete(data, response, undefined)
        })
        xmlRequest.addEventListener("error", ((_: any, e: ErrorEvent) => {
            this.state = URLSessionTaskState.completed
            const data: Data | undefined = xmlRequest.response instanceof ArrayBuffer ? new Data(xmlRequest.response) : undefined
            const response = new URLResponse
            response.URL = this.request.URL
            response.statusCode = xmlRequest.status
            this.complete(data, response, e.error)
        }) as any)
        this.state = URLSessionTaskState.running
        if (this.request.HTTPBody instanceof Data) {
            xmlRequest.send(this.request.HTTPBody._arrayBuffer)
        }
        else {
            xmlRequest.send()
        }
        this._xmlRequest = xmlRequest
    }

    cancel() {
        this.state = URLSessionTaskState.cancelling
        if (this._xmlRequest) {
            this._xmlRequest.abort()
        }
    }

}