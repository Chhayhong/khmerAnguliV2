/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeftHandComponent } from './left-hand.component';

describe('LeftHandComponent', () => {
  let component: LeftHandComponent;
  let fixture: ComponentFixture<LeftHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
