import { EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

export class Filter {
    onChange: EventEmitter<void> = new EventEmitter();
    protected filterParams = {};
    protected triggerChange: () => void = null;

    constructor(debounceChangeInterval: number = 1000) {
        let timeoutId = null;
        this.triggerChange = () => {
            clearTimeout(timeoutId);
            setTimeout(() => this.onChange.emit(), debounceChangeInterval);
        };
    }

    get value(): HttpParams {
        return new HttpParams({
            fromObject: this.filterParams,
        });
    }

    get paramsObject() {
        return Object.assign({}, this.filterParams);
    }

    set(name: string, value: any): void {
        this.filterParams[name] = value;
        this.triggerChange();
    }

    remove(name: string) {
        if (name in this.filterParams) {
            delete this.filterParams[name];
            this.triggerChange();
        }
    }
}
