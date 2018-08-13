import { Component, ContentChildren, QueryList, Input } from '@angular/core';

import { ColumnDefinitionDirective } from './column.def.directive';
import { DataProvider, SortDirection } from './data.provider';

@Component({
  selector: '2am-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent {

  @ContentChildren(ColumnDefinitionDirective)
  columnTemplates: QueryList<ColumnDefinitionDirective>;

  @Input()
  provider: DataProvider<any>;

  @Input()
  emptyText: string = 'No results found.';

  @Input()
  loadingMode: boolean = false;

  @Input()
  loadingText: string = 'Loading...';

  constructor() { }

  renderColumnHeader(column: ColumnDefinitionDirective) {
    return column.name;
  }

  renderValue(column: ColumnDefinitionDirective, row: any) {
    const value = column.getColumnValue(row);
    return column.valueRenderer ? column.valueRenderer(value, row, column, this.provider) : value;
  }

  getColumnSortClass(column: ColumnDefinitionDirective) {
    if (!this.provider.isSortableBy(column.sortKeyValue)) {
      return '';
    }

    return {
      "nb-arrow-dropdown": this.provider.getSortDirection(column.sortKeyValue) === "ascending",
      "nb-arrow-dropup": this.provider.getSortDirection(column.sortKeyValue) === "descending",
    };
  }

  sortBy(column: ColumnDefinitionDirective, direction?: SortDirection) {
    if (!this.provider.hasSort || !this.provider.isSortableBy(column.sortKeyValue)) {
      return;
    }

    if (!direction) {
      direction = this.provider.getSortDirection(column.sortKeyValue);
      if (direction === "ascending") {
          direction = "descending";
      } else if (direction === "descending") {
          direction = null;
      } else if (direction === null) {
          direction = "ascending";
      }
    }

    this.provider.sortBy(column.sortKeyValue, direction);
  }
}
