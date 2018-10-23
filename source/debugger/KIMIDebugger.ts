export class KIMIDebugger {

    private worker = new Worker(window.URL.createObjectURL(new Blob([`
    onmessage = function(e){
        if (e.data === "fetchUpdate") {
            fetchUpdate()
        }
        else if (e.data.indexOf("sendLog:") === 0) {
            sendLog(e.data)
        }
        else {
            eval(e.data)
        }
    }

    var lastTag = undefined

    function sendLog(body) {
        const xmlRequest = new XMLHttpRequest
        xmlRequest.open("POST", 'http://${this.remoteAddress}/console', false)
        xmlRequest.send(body.replace('sendLog:', ''))
    }

    function fetchUpdate() {
        setTimeout(function() {
            let xmlRequest = new XMLHttpRequest
            xmlRequest.open("POST", 'http://${this.remoteAddress}/version', false)
            xmlRequest.addEventListener("loadend", () => {
                if (this.closed) {
                    return
                }
                const tag = xmlRequest.responseText
                if (tag === undefined || tag.length == 0) {
                    fetchUpdate()
                    return
                }
                if (this.lastTag === undefined) {
                    this.lastTag = tag
                    fetchUpdate()
                }
                else if (this.lastTag !== tag) {
                    this.lastTag = tag
                    postMessage('connect')
                }
                else {
                    fetchUpdate()
                }
            })
            xmlRequest.addEventListener("error", () => {
                fetchUpdate()
            })
            xmlRequest.send()
        }, 500)
    }

    `])))

    private lastTag: string | undefined = undefined

    constructor(readonly remoteAddress: string = window.location.hostname + ":8090") {
        this.addConsoleHandler()
    }

    addConsoleHandler() {
        const debugging = window.location.href.indexOf("#debug") > 0 || window.location.href.indexOf("?debug") > 0
        if (!debugging) { return }
        const worker = this.worker
        const methods = ["log", "info", "debug", "error", "warn"]
        const console = window.console as any
        methods.forEach((it) => {
            const originMethod = console[it]
            console[it] = function () {
                originMethod.apply(this, arguments)
                let args = []
                for (let index = 0; index < arguments.length; index++) {
                    try {
                        if (arguments[index].constructor === undefined || arguments[index].constructor.toString().indexOf("[native code]") >= 0) {
                            args.push(arguments[index])
                        }
                        else {
                            args.push(String(arguments[index]))
                        }
                    } catch (error) { }
                }
                worker.postMessage("sendLog:" + JSON.stringify({
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
        this.worker.postMessage("fetchUpdate")
        this.worker.addEventListener("message", (e) => {
            if (e.data === "connect") {
                this.connect(callback, () => { })
            }
        })
    }

}