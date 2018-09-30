export const currentAnimationTimeMillis = () => {
    if (typeof window.performance === "object") {
        return window.performance.now()
    }
    else {
        return Date.now()
    }
}