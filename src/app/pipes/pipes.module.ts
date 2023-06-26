import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from './search-filter.pipe';
import { ArraySortPipe } from './sort-date.pipe';
import { FilesizePipe } from './filesize.pipe';

@NgModule({
  declarations: [
    SearchFilterPipe, ArraySortPipe, FilesizePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [SearchFilterPipe, ArraySortPipe, FilesizePipe]
})
export class PipesModule { }
