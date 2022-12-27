import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { TypingTextareaComponent } from './component/typing-textarea/typing-textarea.component';

const routes: Routes = [
  { path:  '', redirectTo: 'play', pathMatch: 'full'},
  { path:  'home', component:  HomeComponent},
  { path:  'play', component:  TypingTextareaComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
   declarations: [
  ]
})
export class AppRoutingModule { }
