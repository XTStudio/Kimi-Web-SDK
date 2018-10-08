export class UIIndexPath {
    
    constructor(readonly row: number, readonly section: number) { }

    mapKey() {
        return `${this.row}-${this.section}`
    }

}