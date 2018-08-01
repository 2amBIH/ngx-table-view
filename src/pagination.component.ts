import { Component, Input } from "@angular/core";

import { DataProvider } from "./data.provider";

@Component({
    selector: 'twoam-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {

    @Input()
    provider: DataProvider<any>;

    @Input()
    pageStride: number = 8;

    @Input()
    disabled: boolean = false;

    constructor() { }

    get pageItems() {
        const maxPage = this.provider.pageCount;
        const pageStrideSide = Math.floor(this.pageStride / 2);
        
        let min = Math.max(this.provider.currentPage - pageStrideSide, 0);
        let max = Math.min(this.provider.currentPage + pageStrideSide, maxPage);
        const pages = [];
      
        if (this.pageStride > max - min) {
            let leftPages = this.pageStride - max + min;
            const oldMin = min;
            min = Math.max(min - leftPages, 0);
            leftPages -= min - oldMin;
            max = Math.min(max + leftPages, maxPage);
        }

        for (let i = min; i < max; i++) {
            pages.push(i + 1);
        }

        return pages;
    }

    get currentPage() {
        return this.provider.currentPage;
    }

    goToLastPage() {
        if (this.disabled) {
            return;
        }
        this.provider.goToLastPage();
    }

    goToFirstPage() {
        if (this.disabled) {
            return;
        }
        this.provider.goToFirstPage();
    }

    changePage(page: number) {
        if (this.disabled) {
            return;
        }
        this.provider.changePage(page);
    }

    nextPage() {
        if (this.disabled) {
            return;
        }
        this.provider.nextPage();
    }

    previousPage() {
        if (this.disabled) {
            return;
        }
        this.provider.previousPage();
    }
}
