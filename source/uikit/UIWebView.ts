import { UINativeTouchView } from "./UIView";
import { URL as FoundationURL } from "../foundation/URL";
import { URLRequest } from "../foundation/URLRequest";

export class UIWebView extends UINativeTouchView {

    iframeElement = document.createElement("iframe")

    constructor() {
        super()
        this.iframeElement.style.border = "none"
        this.iframeElement.style.position = "absolute"
        this.iframeElement.style.width = "100%"
        this.iframeElement.style.height = "100%"
        this.iframeElement.style.overflow = "scroll"
        this.domElement.appendChild(this.iframeElement)
        this.iframeElement.addEventListener("loadstart", () => {
            this.loading = true
        })
        this.iframeElement.addEventListener("load", () => {
            if (this.iframeElement.contentWindow) {
                this.title = this.iframeElement.contentWindow.document.title
            }
            this.loading = false
        })
    }

    title: string | undefined = undefined

    URL: FoundationURL | undefined = undefined

    loading: boolean = false

    loadRequest(request: URLRequest): void {
        this.URL = request.URL
        this.iframeElement.src = request.URL.absoluteString
    }

    loadHTMLString(HTMLString: string, baseURL: FoundationURL): void {
        this.URL = baseURL
        this.iframeElement.src = URL.createObjectURL(new Blob([HTMLString]))
    }

    goBack(): void {
        if (this.iframeElement.contentWindow) {
            this.iframeElement.contentWindow.history.back()
        }
    }

    goForward(): void {
        if (this.iframeElement.contentWindow) {
            this.iframeElement.contentWindow.history.forward()
        }
    }

    reload(): void {
        if (this.iframeElement.contentWindow) {
            this.iframeElement.contentWindow.location.reload(true)
        }
    }

    stopLoading(): void {
        if (this.iframeElement.contentWindow) {
            this.iframeElement.contentWindow.stop()
        }
    }

    evaluateJavaScript(script: string, completed: (result?: any, error?: Error) => void): void {
        try {
            completed((this.iframeElement.contentWindow as any).eval(script), undefined)
        } catch (error) {
            completed(undefined, error)
        }
    }

}