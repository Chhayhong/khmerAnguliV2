import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-visual-keyboard',
  templateUrl: './visual-keyboard.component.html',
  styleUrls: ['./visual-keyboard.component.css']
})
export class VisualKeyboardComponent implements OnInit {
  @Input() currentKeys:any=[]
  constructor(
  ) { }

  ngOnInit() {
    const visualKey = document.getElementById(this.currentKeys) as HTMLFormElement;
    visualKey.setAttributeNS(null, "fill", '#5bb1f7');
  }

}
