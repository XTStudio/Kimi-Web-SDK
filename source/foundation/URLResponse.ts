import { URL } from "./URL";

export class URLResponse {
    URL: URL | undefined = undefined
    expectedContentLength: number = 0
    MIMEType: string | undefined = undefined
    textEncodingName: string | undefined = undefined
    statusCode: number = 0
    allHeaderFields: { [key: string]: any } = {}
}