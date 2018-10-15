import { UINativeTouchView } from "./UIView";

export class UIWebView extends UINativeTouchView {

    iframeElement = document.createElement("iframe")

    constructor() {
        super()
        this.iframeElement.style.border = "none"
        this.domElement.appendChild(this.iframeElement)
    }

    readonly title: string | undefined

    readonly URL: URL | undefined

    readonly loading: boolean

    loadRequest(request: URLRequest): void {

    }

    loadHTMLString(HTMLString: string, baseURL: URL): void {

    }

    goBack(): void {

    }

    goForward(): void {

    }

    reload(): void {

    }

    stopLoading(): void {

    }
    
    evaluateJavaScript(script: string, completed: (result?: any, error?: Error) => void): void {

    }

}