import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxFolioModule } from 'ngx-folio';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxFolioModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
