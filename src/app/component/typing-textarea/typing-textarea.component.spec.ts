import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingTextareaComponent } from './typing-textarea.component';

describe('TypingTextareaComponent', () => {
  let component: TypingTextareaComponent;
  let fixture: ComponentFixture<TypingTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypingTextareaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypingTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
