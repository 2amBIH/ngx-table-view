import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TableViewComponent} from 'table-view.component';
import {ColumnDefinitionDirective} from 'column.def.directive';
import {PaginationComponent} from 'pagination.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        TableViewComponent,
        ColumnDefinitionDirective,
        PaginationComponent,
    ],
    exports: [
        TableViewComponent,
        ColumnDefinitionDirective,
        PaginationComponent,
    ],
})
export class TableViewModule {
}