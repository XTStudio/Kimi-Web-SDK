import { Data } from "./Data";
import { Bundle } from "./Bundle";

const unavailabelError = Error("Kimi-Web-SDK not support FileManager API")

export class FileManager {

    static readonly defaultManager: FileManager = new FileManager
    static readonly documentDirectory: string = "tmp://document/"
    static readonly libraryDirectory: string = "tmp://library/"
    static readonly cacheDirectory: string = "tmp://cache/"
    static readonly temporaryDirectory: string = "tmp://tmp/"
    static readonly jsBundleDirectory: string = "xt://"
    
    private tmpFiles: { [key: string]: Data } = {}

    subpaths(atPath: string, deepSearch?: boolean): string[] {
        if (atPath.indexOf("xt://") === 0) {
            return Object.keys(Bundle.js.resources).filter(it => {
                return it.indexOf(atPath.replace("xt://", "")) === 0
            })
        }
        else if (atPath.indexOf("tmp://") === 0) {
            return Object.keys(this.tmpFiles).filter(it => {
                return it.indexOf(atPath) === 0
            })
        }
        return []
    }

    createDirectory(atPath: string, withIntermediateDirectories: boolean): Error | undefined {
        return undefined
    }

    createFile(atPath: string, data: Data): Error | undefined {
        if (atPath.indexOf("xt://") === 0) {
            return Error("readonly")
        }
        else if (atPath.indexOf("tmp://") === 0) {
            this.tmpFiles[atPath] = data
            return undefined
        }
        return unavailabelError
    }

    readFile(atPath: string): Data | undefined {
        if (atPath.indexOf("xt://") === 0) {
            return Bundle.js.resources[atPath.replace("xt://", "")]
        }
        else if (atPath.indexOf("tmp://") === 0) {
            return this.tmpFiles[atPath]
        }
        else if (atPath.indexOf("http://") === 0 || atPath.indexOf("https://") === 0) {
            const xmlRequest = new XMLHttpRequest()
            xmlRequest.open("GET", atPath, false)
            xmlRequest.send()
            if (xmlRequest.response !== undefined) {
                return new Data({ utf8String: xmlRequest.response })
            }
            return undefined
        }
        return undefined
    }

    removeItem(atPath: string): Error | undefined {
        if (atPath.indexOf("xt://") === 0) {
            delete Bundle.js.resources[atPath.replace("xt://", "")]
            return undefined
        }
        else if (atPath.indexOf("tmp://") === 0) {
            delete this.tmpFiles[atPath]
            return undefined
        }
        return unavailabelError
    }

    copyItem(atPath: string, toPath: string): Error | undefined {
        if (toPath.indexOf("xt://") === 0) {
            return Error("readonly")
        }
        else if (toPath.indexOf("tmp://") === 0) {
            const data = this.readFile(atPath)
            if (data) {
                this.createFile(toPath, data)
            }
            else {
                return Error("file not found.")
            }
        }
        return unavailabelError
    }

    moveItem(atPath: string, toPath: string): Error | undefined {
        if (toPath.indexOf("xt://") === 0) {
            return Error("readonly")
        }
        else if (toPath.indexOf("tmp://") === 0) {
            const data = this.readFile(atPath)
            if (data) {
                this.createFile(toPath, data)
                this.removeItem(atPath)
            }
            else {
                return Error("file not found.")
            }
        }
        return unavailabelError
    }

    fileExists(atPath: string): boolean {
        if (atPath.indexOf("xt://") === 0) {
            return Bundle.js.resources[atPath.replace("xt://", "")] instanceof Data
        }
        else if (atPath.indexOf("tmp://") === 0) {
            return this.tmpFiles[atPath] !== undefined
        }
        return false
    }

    dirExists(atPath: string): boolean {
        return true
    }

}