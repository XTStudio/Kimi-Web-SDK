import { UIFont } from "../UIFont";
import { UIRect, UIRectZero } from "../UIRect";

let measureSpan: HTMLSpanElement = document.createElement("span")

export interface TextMeasureParams {

    font: UIFont;
    inRect: UIRect;
    numberOfLines?: number
    letterSpace?: number

}

export class TextMeasurer {

    static measureText(text: string, params: TextMeasureParams): UIRect {
        if (measureSpan.parentNode === null) {
            measureSpan.style.opacity = "0.0"
            measureSpan.style.position = "absolute"
            measureSpan.style.left = "-10000000px"
            measureSpan.style.top = "-10000000px"
            document.body.appendChild(measureSpan);
        }
        measureSpan.style.fontSize = params.font.pointSize.toString() + "px"
        measureSpan.style.fontFamily = typeof params.font.fontName === "string" ? params.font.fontName : null;
        measureSpan.style.fontWeight = typeof params.font.fontStyle === "string" ? params.font.fontStyle : null;
        measureSpan.style.fontStyle = typeof params.font.fontStyle === "string" ? params.font.fontStyle : null;
        measureSpan.style.letterSpacing = params.letterSpace ? params.letterSpace.toString() : null
        if (params.numberOfLines === 1 || params.numberOfLines === undefined) {
            measureSpan.style.overflow = "hidden"
            measureSpan.style.wordWrap = null;
            measureSpan.style.wordBreak = null;
            measureSpan.style.display = "inline-block";
            measureSpan.style.setProperty("-webkit-line-clamp", null)
            measureSpan.style.whiteSpace = "nowrap";
            measureSpan.innerText = text;
            return { x: 0.0, y: 0.0, width: Math.min(params.inRect.width, Math.ceil(measureSpan.offsetWidth + 1)), height: Math.ceil(measureSpan.offsetHeight) }
        }
        else {
            measureSpan.style.overflow = "hidden"
            measureSpan.style.wordWrap = null;
            measureSpan.style.wordBreak = null;
            measureSpan.style.display = "-webkit-box";
            measureSpan.style.webkitBoxOrient = "vertical"
            measureSpan.style.maxWidth = params.inRect.width.toString() + "px";
            measureSpan.innerText = text;
            {
                const lines = params.numberOfLines == 0 ? 99999 : params.numberOfLines
                let lineHeight = 16
                if (params.font) {
                    lineHeight = Math.max(params.font.pointSize * 1.5, params.font.pointSize + 12)
                }
                const clampLines = Math.min(Math.floor(params.inRect.height / lineHeight), lines)
                if (clampLines > 0) {
                    measureSpan.style.setProperty("-webkit-line-clamp", clampLines.toFixed(0))
                }
            }
            return { x: 0.0, y: 0.0, width: Math.min(params.inRect.width, Math.ceil(measureSpan.offsetWidth + 1)), height: Math.min(params.inRect.height, Math.ceil(measureSpan.offsetHeight)) }
        }
    }

}