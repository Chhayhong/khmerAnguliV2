import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-visual-keyboard',
  templateUrl: './visual-keyboard.component.html',
  styleUrls: ['./visual-keyboard.component.css']
})
export class VisualKeyboardComponent implements OnInit {
  @Input() currentKeys:any=[]
Keyboard: any;
  constructor(
  ) { }

  ngOnInit() {
    // document
    // .getElementById("keyboard")
    // .getElementById(key)
    // .setAttributeNS(null, "fill", color);
  }

}
