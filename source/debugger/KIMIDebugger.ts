export class KIMIDebugger {

    private lastTag: string | undefined = undefined
    private closed: boolean = false

    constructor(readonly remoteAddress: string = window.location.hostname + ":8090") {
        this.addConsoleHandler()
    }

    addConsoleHandler() {
        const debugging = window.location.href.indexOf("#debug") > 0 || window.location.href.indexOf("?debug") > 0
        const remoteAddress = this.remoteAddress
        if (!debugging) { return }
        const methods = ["log", "info", "debug", "error", "warn"]
        const console = window.console as any
        methods.forEach((it) => {
            const originMethod = console[it]
            console[it] = function () {
                originMethod.apply(this, arguments)
                let args = []
                for (let index = 0; index < arguments.length; index++) {
                    try {
                        args.push(arguments[index])
                    } catch (error) { }
                }
                const xmlRequest = new XMLHttpRequest
                xmlRequest.open("POST", `http://${remoteAddress}/console`, false)
                xmlRequest.send(JSON.stringify({
                    type: it,
                    values: args
                }))
            }
        })
    }

    connect(callback: () => void, fallback: () => void) {
        const debugging = window.location.href.indexOf("#debug") > 0 || window.location.href.indexOf("?debug") > 0
        if (debugging === true) {
            const xmlRequest = new XMLHttpRequest
            xmlRequest.open("POST", `http://${this.remoteAddress}/source`, false)
            xmlRequest.addEventListener("loadend", () => {
                const script = xmlRequest.responseText
                try {
                    eval(script)
                    callback()
                } catch (error) {
                    console.error(error)
                }
                this.fetchUpdate(callback)
            })
            xmlRequest.addEventListener("error", () => {
                if (this.lastTag === undefined) {
                    return
                }
                fallback()
            })
            xmlRequest.send()
        }
        else {
            fallback()
        }
    }

    fetchUpdate(callback: () => void) {
        setTimeout(() => {
            const xmlRequest = new XMLHttpRequest
            xmlRequest.open("POST", `http://${this.remoteAddress}/version`, false)
            xmlRequest.addEventListener("loadend", () => {
                if (this.closed) {
                    return
                }
                const tag = xmlRequest.responseText
                if (tag === undefined || tag.length == 0) {
                    this.fetchUpdate(callback)
                    return
                }
                if (this.lastTag === undefined) {
                    this.lastTag = tag
                    this.fetchUpdate(callback)
                }
                else if (this.lastTag !== tag) {
                    this.lastTag = tag
                    this.connect(callback, () => { })
                }
                else {
                    this.fetchUpdate(callback)
                }
            })
            xmlRequest.addEventListener("error", () => {
                this.fetchUpdate(callback)
            })
            xmlRequest.send()
        }, 500)
    }

}