declare var require: any
const EventEmitterIMP = require("./EventEmitterImp")

declare interface MultipleEvents {
    [event: string]: any //Function | Function[]
}

declare class EventEmitterDefines {
    getListeners(event: string): Function[];
    getListeners(event: RegExp): { [event: string]: Function };
    addListener(event: string, listener: Function): this;
    addListener(event: RegExp, listener: Function): this;
    on(event: string, listener: Function): this;
    on(event: RegExp, listener: Function): this;
    flattenListeners(listeners: { listener: Function }[]): Function[];
    getListenersAsObject(event: string): { [event: string]: Function };
    getListenersAsObject(event: RegExp): { [event: string]: Function };
    addOnceListener(event: string, listener: Function): this;
    addOnceListener(event: RegExp, listener: Function): this;
    once(event: string, listener: Function): this;
    once(event: RegExp, listener: Function): this;
    defineEvent(event: string): this;
    defineEvents(events: string[]): this;
    removeListener(event: string, listener: Function): this;
    removeListener(event: RegExp, listener: Function): this;
    off(event: string, listener: Function): this;
    off(event: RegExp, listener: Function): this;
    addListeners(event: string, listeners: Function[]): this;
    addListeners(event: RegExp, listeners: Function[]): this;
    addListeners(event: MultipleEvents): this;
    removeListeners(event: string, listeners: Function[]): this;
    removeListeners(event: RegExp, listeners: Function[]): this;
    removeListeners(event: MultipleEvents): this;
    manipulateListeners(remove: boolean, event: string, listeners: Function[]): this;
    manipulateListeners(remove: boolean, event: RegExp, listeners: Function[]): this;
    manipulateListeners(remove: boolean, event: MultipleEvents): this;
    removeEvent(event?: string): this;
    removeEvent(event?: RegExp): this;
    removeAllListeners(event?: string): this;
    removeAllListeners(event?: RegExp): this;
    emitEvent(event: string, ...args: any[]): this;
    emitEvent(event: RegExp, ...args: any[]): this;
    trigger(event: string, ...args: any[]): this;
    trigger(event: RegExp, ...args: any[]): this;
    emit(event: string, ...args: any[]): this;
    emit(event: RegExp, ...args: any[]): this;
    val(event: string, ...args: any[]): any;
    setOnceReturnValue(value: any): this;
}

export const EventEmitter: typeof EventEmitterDefines = EventEmitterIMP.EventEmitter