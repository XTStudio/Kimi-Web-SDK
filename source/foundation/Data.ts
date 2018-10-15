export class Data {

    _arrayBuffer: ArrayBuffer = new ArrayBuffer(0)

    constructor(value?: ArrayBuffer | {
        utf8String?: string,
        base64EncodedData?: Data,
        base64EncodedString?: string,
    }) {
        if (value instanceof ArrayBuffer) {
            this._arrayBuffer = value.slice(0)
        }
        else if (value !== undefined) {
            if (typeof value.utf8String === "string") {
                if (typeof TextEncoder === "function") {
                    return new Data(new TextEncoder().encode(value.utf8String).buffer as ArrayBuffer)
                }
                else {
                    var trimValue = unescape(encodeURIComponent(value.utf8String))
                    var arrayBuffer = new ArrayBuffer(trimValue.length);
                    var bufferView = new Uint8Array(arrayBuffer);
                    for (var i = 0, count = trimValue.length; i < count; i++) {
                        bufferView[i] = trimValue.charCodeAt(i);
                    }
                    this._arrayBuffer = arrayBuffer
                }
            }
            else if (value.base64EncodedData instanceof Data) {
                var binaryString = window.atob(String.fromCharCode.apply(null, new Uint8Array(value.base64EncodedData._arrayBuffer)));
                var len = binaryString.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                this._arrayBuffer = bytes.buffer as ArrayBuffer
            }
            else if (typeof value.base64EncodedString === "string") {
                var binaryString = window.atob(value.base64EncodedString);
                var len = binaryString.length;
                var bytes = new Uint8Array(len);
                for (var i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                this._arrayBuffer = bytes.buffer as ArrayBuffer
            }
        }
    }

    arrayBuffer(): ArrayBuffer {
        return this._arrayBuffer
    }

    utf8String(): string | undefined {
        if (typeof TextDecoder === "function") {
            return new TextDecoder().decode(this._arrayBuffer)
        }
        return decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(this._arrayBuffer))))
    }

    base64EncodedData(): Data {
        return new Data({ utf8String: this.base64EncodedString() })
    }

    base64EncodedString(): string {
        return window.btoa(String.fromCharCode.apply(null, new Uint8Array(this._arrayBuffer)));
    }

    mutable(): MutableData {
        return new MutableData(this._arrayBuffer)
    }

}

export class MutableData extends Data {

    appendData(data: Data): void {
        this._arrayBuffer = new Uint8Array([
            ...new Uint8Array(this._arrayBuffer),
            ...new Uint8Array(data._arrayBuffer),
        ]).buffer as ArrayBuffer
    }

    appendArrayBuffer(arrayBuffer: ArrayBuffer): void {
        this._arrayBuffer = new Uint8Array([
            ...new Uint8Array(this._arrayBuffer),
            ...new Uint8Array(arrayBuffer),
        ]).buffer as ArrayBuffer
    }

    setData(data: Data): void {
        this._arrayBuffer = data._arrayBuffer.slice(0)
    }

    immutable(): Data {
        return new Data(this._arrayBuffer)
    }

}