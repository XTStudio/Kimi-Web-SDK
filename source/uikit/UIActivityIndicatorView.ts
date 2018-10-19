import { UIView } from "./UIView";
import { UIColor } from "./UIColor";

const smallElement = `<svg class="lds-spinner" width="36px" height="36px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background-image: none; background-position: initial initial; background-repeat: initial initial;"><g transform="rotate(0 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(30 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(60 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(90 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(120 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(150 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(180 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(210 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(240 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(270 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(300 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite" class=""></animate> </rect> </g><g transform="rotate(330 50 50)" class=""> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f" class=""> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="0s" repeatCount="indefinite" class=""></animate> </rect> </g></svg>`
const largeElement = `<svg class="lds-spinner" width="88px" height="88px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background-image: none; background-position: initial initial; background-repeat: initial initial;"><g transform="rotate(0 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(30 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(60 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(90 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(120 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(150 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(180 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(210 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(240 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(270 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(300 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate> </rect> </g><g transform="rotate(330 50 50)"> <rect x="47" y="24" rx="9.4" ry="4.8" width="6" height="12" fill="#28292f"> <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate> </rect> </g></svg>`

export class UIActivityIndicatorView extends UIView {

    contentElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    color: UIColor | undefined = undefined

    largeStyle: boolean = false

    constructor() {
        super()
        this.contentElement.style.position = "absolute"
        this.contentElement.style.width = "100%"
        this.contentElement.style.height = "100%"
        this.domElement.appendChild(this.contentElement)
    }

    animating: boolean = false

    startAnimating(): void {
        this.animating = true
        let elementString = this.largeStyle ? largeElement : smallElement
        if (this.color) {
            elementString = elementString.replace(/fill="#28292f"/g, 'fill=\"' + this.color.toStyle() + '\"');
        }
        this.contentElement.innerHTML = elementString
        this.layoutSubviews()
    }

    stopAnimating(): void {
        this.animating = false
        this.contentElement.childNodes.forEach(it => {
            this.contentElement.removeChild(it)
        })
    }

    layoutSubviews() {
        super.layoutSubviews()
        const size = this.largeStyle ? 88 : 36
        this.contentElement.style.transform = "matrix(1.0, 0.0, 0.0, 1.0, " + ((this.bounds.width - size) / 2.0) + ", " + ((this.bounds.height - size) / 2.0) + ")"
        this.contentElement.style.webkitTransform = this.contentElement.style.transform
    }

}
