export class UserDefaults {

    static readonly standard = new UserDefaults

    constructor(readonly suiteName: string | undefined = undefined) { }

    valueForKey(forKey: string): any | undefined {
        const value = localStorage.getItem(this.buildKey(forKey))
        if (value !== undefined && typeof value === "string") {
            try {
                return JSON.parse(value).value
            } catch (error) { }
        }
        return undefined
    }

    setValue(value: any, forKey: string): void {
        if (value === undefined) {
            localStorage.removeItem(this.buildKey(forKey))
        }
        else {
            localStorage.setItem(this.buildKey(forKey), JSON.stringify({ value: value }))
        }
    }

    reset(): void {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (typeof key === "string" && key.indexOf(`com.xt.${(this.suiteName || "standard")}.`) === 0) {
                localStorage.removeItem(key)
            }
        }
    }

    private buildKey(aKey: string): string {
        return `com.xt.${(this.suiteName || "standard")}.${aKey}`
    }

}