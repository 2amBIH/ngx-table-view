import { Filter } from './filter';
import { EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

export type SortDirection = 'ascending' | 'descending';

export type SortInfo = {
    items: Array<string>;
    multisort: boolean;
    sorted_by: { [key: string]: SortDirection };
}

export type PaginationInfo = {
    total_count: number;
    page: number;
    page_size: number;
}

export type Change = {
    type: 'pagination' | 'sort' | 'filter';
    value: any;
}

export class DataProvider<T> {
    items: Array<T> = [];

    sort: SortInfo|boolean = false;
    pagination: PaginationInfo|boolean = false;
    filter = new Filter();

    pageParam = 'page';
    sortParam = 'sort';

    onChange: EventEmitter<Change> = new EventEmitter();
    dataLoaded: EventEmitter<void> = new EventEmitter();

    constructor(items?: Array<T>, sort?: SortInfo, pagination?: PaginationInfo) {
        this.filter.onChange.subscribe(() => {
            this.onChange.emit({ type: 'filter', value: this.filter.value });
        });

        this.sort = sort || this.sort;
        this.pagination = pagination || this.pagination;

        if (items) {
            this.loadData(items, sort, pagination);
        }
    }

    get queryParams(): HttpParams {
        const filter: any = this.filter.paramsObject;

        if (this.hasPagination) {
            filter[this.pageParam] = this.currentPage.toFixed();
        }

        const sortInfo = this.sort as SortInfo;
        if (this.hasSort && Object.keys(sortInfo.sorted_by).length > 0) {
            const sortItems = [];
            for (const name in sortInfo.sorted_by) {
                if (sortInfo.sorted_by.hasOwnProperty(name)) {
                    if (sortInfo.sorted_by[name] === "ascending") {
                        sortItems.push(name);
                    } else if (sortInfo.sorted_by[name] === "descending") {
                        sortItems.push(`-${name}`);
                    }
                }
            }

            filter[this.sortParam] = sortItems.join(',');
        }

        return new HttpParams({
            fromObject: filter,
        });
    }

    get totalCount(): number {
        if (!this.hasPagination) {
            return this.items.length;
        }

        return (<PaginationInfo>this.pagination).total_count;
    }

    get pageCount(): number {
        if (!this.hasPagination) {
            return 1;
        }

        const pagination = this.pagination as PaginationInfo;
        return Math.ceil(pagination.total_count / pagination.page_size);
    }

    get currentPage(): number {
        return this.hasPagination ? (<PaginationInfo>this.pagination).page : 1;
    }

    loadData(items: Array<T>, sort?: SortInfo, pagination?: PaginationInfo): void {
        this.items = items;
        this.sort = sort || this.sort;
        this.pagination = pagination || this.pagination;
        this.dataLoaded.emit();
    }

    changePage(value: number): void {
        if (!this.hasPagination || value > this.pageCount) {
            return;
        }

        value = Math.max(1, Math.min(value, this.pageCount));

        if (this.currentPage == value) {
            return;
        }

        (<PaginationInfo>this.pagination).page = value;
        this.onChange.emit({ type: 'pagination', value });
    }

    nextPage(): void {
        this.changePage(this.currentPage + 1);
    }

    previousPage(): void {
        this.changePage(this.currentPage - 1);
    }

    goToFirstPage(): void {
        this.changePage(1);
    }

    goToLastPage(): void {
        this.changePage(this.pageCount);
    }

    get hasPagination(): boolean {
        return this.pagination !== false;
    }

    get hasSort(): boolean {
        return this.sort !== false;
    }

    get isEmpty(): boolean {
        return this.totalCount === 0;
    }

    sortBy(item: string, direction: SortDirection|null): void {
        if (!this.hasSort) {
            return;
        }

        const sort = this.sort as SortInfo;
        const value = sort.multisort ? sort.sorted_by : {};
        
        value[item] = direction;

        sort.sorted_by = value;
        this.onChange.emit({ type: 'sort', value });
    }

    getSortDirection(sortItem: string): SortDirection|null {
        if (!this.hasSort) {
            return null;
        }

        return <SortDirection>(<SortInfo>this.sort).sorted_by[sortItem] || null;
    }

    isSortableBy(sortItem: string): boolean {
        if (!this.hasSort) {
            return false;
        }

        return (<SortInfo>this.sort).items.indexOf(sortItem) !== -1;
    }
}
