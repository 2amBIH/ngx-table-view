import { TemplateRef, Input, Directive, Host, Output, EventEmitter, Optional } from '@angular/core';

import { DataProvider } from './data.provider';

export type RendererFn = (
    value: any, 
    row: any, 
    column: ColumnDefinitionDirective, 
    provider: DataProvider<any>,
) => string;

@Directive({
    selector: '[ngxTblCol],ngx-tbl-col',
})
export class ColumnDefinitionDirective {

    @Input()
    name: string;

    @Input()
    key: string;

    @Input()
    sortKey: string;

    @Input()
    pass: any;

    @Input()
    valueRenderer: RendererFn;

    @Output()
    trigger: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    filterTpl: TemplateRef<any>;

    @Input()
    valueTpl: TemplateRef<any>;

    @Input()
    headerClass: any;

    @Input()
    cellClass: any;

    constructor(@Optional() @Host() public tpl: TemplateRef<any>) {
    }

    get templateSpec(): TemplateRef<any> {
        return this.valueTpl || this.tpl;
    }

    get valueKey() {
        return this.key;
    }

    get sortKeyValue() {
        return this.sortKey || this.key;
    }

    getColumnValue(row) {
        if (!this.key) {
            return null;
        }

        if (this.key in row) {
            return row[this.key];
        }

        const walkerItems = this.key.split('.');
        let walker = row;
        for (const key of walkerItems) {
            if (key in walker) {
                walker = walker[key];
            } else {
                return null;
            }
        }

        return walker;
    }

    inContext(row: any, provider: DataProvider<any>) {
        return {
            $implicit: {
                name: this.name,
                key: this.key,
                passed: this.pass,
                trigger: (...args) => this.trigger.emit([...args]),
                provider,
                row,
                value: this.getColumnValue(row),
            },
        }
    }

    getHeaderClass(provider: DataProvider<any>) {
        let classParams = {};
        if (typeof this.headerClass !== "string") {
            classParams = this.headerClass || {};
        } else {
            classParams[this.headerClass] = true;
        }

        return {
            sortable: provider.isSortableBy(this.sortKeyValue),
            ...classParams,
        };
    }

    getCellClass() {
        return this.cellClass || {};
    }
}
