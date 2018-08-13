# ngx-table-view
Angular 6+ Table View with template rendering

# Usage

### 1. Import table view module in your `app.module.ts` or preferred module.

```ts
import { TableViewModule } from '@2aminternal/ngx-table-view';

@NgModule({
  imports: [
    TableViewModule
  ],
  providers: []
})
export class YourModule { }
```

### 2. Use the component in your application:

```html
<ngx-table-view [provider]="myProvider">
    <ngx-tbl-col name="My Column 1" key="myColumn1"></ngx-tbl-col>
    <ngx-tbl-col name="My Column 2" key="myColumn2"></ngx-tbl-col>
</ngx-table-view>
```

#### DataProvider

`ngx-table-view` works using a `DataProvider`, an object which holds all the data information about filters, sorting and pagination.
You need to pass it to the table view in order to show data in the table.

To instantiate data provider object simply do:

```ts
this.myProvider = new DataProvider(
    [
        {myColumn1: 'My Data', myColumn2: 'Another data'},
        {myColumn1: 'My Data2', myColumn2: 'Another data 2'}
    ]
);
```

Table view will read each row from the passed items in data provider and run them through column definitions. In the above example there is just
one column "myColumn" which will render the item.myColumn for each item.

**Sort**

To pass sort information pass use:
```ts
this.myProvider = new DataProvider(
    [
        {myColumn1: 'My Data', myColumn2: 'Another data'},
        {myColumn1: 'My Data2', myColumn2: 'Another data 2'}
    ],
    {
        items: ['myColumn'];
        multisort: false;
        sorted_by: {}
    }
);
```

Or set it:

```ts
this.myProvider.sort = {
    items: ['myColumn'];
    multisort: false;
    sorted_by: {
        'myColumn': 'ascending'
    }
};
```
Parameters:

* **items** - column keys which are sortable.
* **multisort** - whether or not multisort is allowed.
* **sorted_by** - Definitions of which column its is already sorted by.

Sorting can be modified programmatically by using methods in `DataProvider`.

Not setting this parameter will turn off sorting.

**Pagination**

To pass pagination information pass use:
```ts
this.myProvider = new DataProvider(
    [
        {myColumn1: 'My Data', myColumn2: 'Another data'},
        {myColumn1: 'My Data2', myColumn2: 'Another data 2'}
    ],
    {
        items: ['myColumn'],
        multisort: false,
        sorted_by: {}
    },
    {
        total_count: 2,
        page: 1,
        page_size: 10
    }
);
```

Or set it:

```ts
this.myProvider.pagination = {
    total_count: 2,
    page: 1,
    page_size: 10
};
```
Parameters:

* **total_count** - Total number of items available.
* **page** - Current page displayed.
* **page_size** - Number of items per page.

Pagination can be modified programmatically by using methods in `DataProvider`.

Not setting this parameter will turn off the pagination.

**Filters**

To set filters in data provider use:

```ts
this.myProvider.filter.set('filterParam1', 'someValue1');
this.myProvider.filter.set('filterParam2', 'someValue2');
```

To react to changes in filters you can use:

```ts
this.myProvider.filter.onChange.subscribe(() => {
    console.log('filter changed');
});
```

**Listening to changes**
To react to any of the changes (filters, sort, pagination) in data provider you can simply listen to them.

```ts
this.myProvider.onChange.subscribe((change: Change) => {
    console.log('Change happened', change.type, change.value);
});
```

This event will happen on every change in the data provider and you can use the type to know what change happened.

# Templating

ngx-table-view support column templates where you can define them in the component:

```html
<ngx-table-view [provider]="myProvider">
    <ng-template ngxTblCol name="My Column 1" key="myColumn1" let-cell>
        This is a custom template. Value: {{ cell.value }}
    </ng-template>
    <ngx-tbl-col name="My Column 2" key="myColumn2" let-cell>

    </ngx-tbl-col>
</ngx-table-view>
```

If you need to pass data from your parent component into the cell, you can use:

```html
<ngx-table-view [provider]="myProvider">
    <ng-template ngxTblCol name="My Column 1" key="myColumn1" [pass]="{myData: 'myValue'}" let-cell>
        This is a custom template. Passed data: {{ cell.passed.myData }}
    </ng-template>
</ngx-table-view>
```


If you send data from outside the column into your parent component, you can use:

```html
<ngx-table-view [provider]="myProvider">
    <ng-template ngxTblCol name="My Column 1" key="myColumn1" (trigger)="handleMyData($event)" let-cell>
        This is a custom template. Passed data: {{ cell.trigger('pass', 'data', 'into', 'parent') }}
    </ng-template>
</ngx-table-view>
```

Then in your component:

```ts
handleMyData(data) {
    console.log('passed argument 1', data[0]);
    console.log('passed argument 2', data[1]);
    console.log('passed argument 3', data[2]);
}
```

Available data in cell:

* **name** - column name
* **key** - column key used to get the data. Can be in dot notation. If it's in dot notation (eg. `object.innerprop.innerprop.value`) then the object will be traversed along this path to get the value.
* **passed** - passed data from [passed] param.
* **trigger** - trigger function which will send the data into (trigger) event.
* **provider** - Whole `DataProvider` object
* **row** - Current row
* **value** - Current value

If you want to use outside template as a reference in the column you can do so:

```html
<ngx-table-view [provider]="myProvider">
    <ngx-tbl-col valueTpl="myTemplate" name="My Column 1" key="myColumn1"></ngx-tbl-col>
    <ngx-tbl-col valueTpl="myTemplate" name="My Column 2" key="myColumn2"></ngx-tbl-col>
</ngx-table-view>
<ng-template #myTemplate let-cell>
    This is a my custom template. Passed data: {{ cell.value }}
</ng-template>
```

If you want to render data in table header you can also use the template:

```html
<ngx-table-view [provider]="myProvider">
    <ngx-tbl-col valueTpl="myTemplate" filterTpl="myFilter" (trigger)="handleData($event)" name="My Column 1" key="myColumn1"></ngx-tbl-col>
    <ngx-tbl-col valueTpl="myTemplate" filterTpl="myFilter" (trigger)="handleData($event)" name="My Column 2" key="myColumn2"></ngx-tbl-col>
</ngx-table-view>
<ng-template #myTemplate let-cell>
    This is a my custom template. Passed data: {{ cell.value }}
</ng-template>
<ng-template #myFilter let-cell>
    My Custom filter
    <input name="text" [attr.placeholder]="cell.name" (input)="cell.trigger('filter', $event.value)" />
</ng-template>
```

Then in your component you can use:

```ts
handleData(data) {
   if (data[0] === 'filter') {
       console.log('handle filter. Value:', data[1]);
       return;
   }

   // Handle other code.
}
```

### Definitions

#### ngx-table-view

Input props:

```ts
provider: DataProvider<any>; // Data Provider
emptyText: string = 'No results found.'; // Text when there is no data in data provider.
loadingMode: boolean = false; // Whether or not table is in loading mode.
loadingText: string = 'Loading...'; // Text to be shown when table is in loading mode.
sortUpClass: string = 'sort-up-arrow'; // Sort up class for the column sort.
sortDownClass: string = 'sort-down-arrow'; // Sort down class for the column sort.
```

#### ngx-tbl-col or directive: ngxTblCol

Input props:

```ts
name: string; // Column name which will be displayed in the table top.
key: string; // Key which will be used to get data. Can be in dot format (eg. object.param.param2.param3)
sortKey: string; // String which defines which key in SortInfo.sorted_by is used for this column.
pass: any; // Data passed into the template.
valueRenderer: RendererFn; // Value renderer function which will be called when rendering the cell value.
filterTpl: TemplateRef<any>; // Filter template - template which will be rendered in the header of the table.
valueTpl: TemplateRef<any>; // Value template - template which will be rendered for every cell.
headerClass: any; // Table header class which will be used when rendering header for this column.
cellClass: any; // Cell class which will be used when rendering every cell.
```

Output props:
```ts
trigger: EventEmitter<any> = new EventEmitter<any>(); // Trigger handler for the column
```

# Building

To build the dist folder use `bash build.sh`.

Building is done using angular ng-packagr.
