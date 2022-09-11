import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TypingTextareaComponent } from './component/typing-textarea/typing-textarea.component';
import { AutofocusDirective } from './directive/auto-focus.directive';

@NgModule({
  declarations: [
    AppComponent,
    TypingTextareaComponent,
    AutofocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
