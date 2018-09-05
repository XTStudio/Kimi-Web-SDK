export class DispatchQueue {

    static readonly main = new DispatchQueue

    static readonly global = new DispatchQueue

    constructor(identifier?: string) { }

    async(asyncBlock: () => void): void {
        setTimeout(asyncBlock, 0)
    }

    asyncAfter(delayInSeconds: number, asyncBlock: () => void): void {
        setTimeout(asyncBlock, delayInSeconds * 1000)
    }

    isolate(isolateBlock: () => void, ...args: any[]): void {
        setTimeout(() => {
            isolateBlock.apply(undefined, args)
        }, 0)
    }

}