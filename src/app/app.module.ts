import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TypingTextareaComponent } from './component/typing-textarea/typing-textarea.component';
import { AutofocusDirective } from './directive/auto-focus.directive';
import { LeftHandComponent } from './utility/left-hand/left-hand.component';
import { RightHandComponent } from './utility/right-hand/right-hand.component';
import { VisualKeyboardComponent } from './utility/visual-keyboard/visual-keyboard.component';

@NgModule({
  declarations: [
    AppComponent,
    TypingTextareaComponent,
    AutofocusDirective,
    VisualKeyboardComponent,
    RightHandComponent,
    LeftHandComponent,
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
