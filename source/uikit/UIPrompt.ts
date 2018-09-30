export class UIPrompt {

    constructor(public message: string) { }

    confirmTitle: string = ""

    cancelTitle: string = ""

    placeholder: string = ""

    defaultValue: string | undefined = undefined

    show(completed: (text: string) => void, cancelled?: () => void): void {
        const value = window.prompt(this.message, this.defaultValue)
        if (typeof value === "string") {
            if (completed) {
                completed(value)
            }
        }
        else {
            if (cancelled) {
                cancelled()
            }
        }
    }

}