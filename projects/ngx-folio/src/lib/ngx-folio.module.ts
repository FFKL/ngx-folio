import { NgModule } from '@angular/core';
import {
  ButtonEllipsisDirective,
  ButtonNextDirective,
  ButtonPageDirective,
  ButtonPrevDirective,
  NgxFolioComponent,
} from './ngx-folio.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NgxFolioComponent,
    ButtonEllipsisDirective,
    ButtonNextDirective,
    ButtonPrevDirective,
    ButtonPageDirective,
  ],
  imports: [CommonModule],
  exports: [NgxFolioComponent, ButtonEllipsisDirective, ButtonNextDirective, ButtonPrevDirective, ButtonPageDirective],
})
export class NgxFolioModule {}
