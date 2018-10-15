declare var require: any
const windowURL = window.URL

export class URL {

    constructor(readonly URLString: string) { }

    static URLWithString(string: string, baseURL?: URL): URL | undefined {
        if (baseURL !== undefined) {
            if (windowURL !== undefined) {
                return new URL(new windowURL(string, baseURL.absoluteString).href)
            }
        }
        return new URL(string)
    }

    static fileURLWithPath(path: string): URL | undefined {
        throw Error()
    }

    public get absoluteString(): string {
        return this.URLString
    }

}