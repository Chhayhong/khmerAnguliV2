import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Renderer2, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { interval, Subject, takeUntil } from 'rxjs';
import { KhmerTypingService } from 'src/app/service/khmer-typing.service';

@Component({
  selector: 'app-typing-textarea',
  templateUrl: './typing-textarea.component.html',
  styleUrls: ['./typing-textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypingTextareaComponent implements OnInit, OnDestroy {
  @Input() typingTextAreaData = 'រាជរដ្ឋាភិបាល​កម្ពុជា​';
  destroy$: Subject<boolean> = new Subject<boolean>();
  // forceFocus: boolean = true;
  displayCurrentAlphabet: string = '';
  textAreaControl = new FormControl('');
  startIndex = 0;
  keepChecking = interval(0);
  currentinput:string=''
  announceResult:string='';
  constructor(
    private khmerTypingService: KhmerTypingService,
    private renderer: Renderer2
  ) {
    this.displayCurrentAlphabet = this.typingTextAreaData[0]
  }
  typingContent: any = this.khmerTypingService.khmerAlphabetSplitter(this.typingTextAreaData);
  ngOnInit() {
    this.keepChecking.pipe(takeUntil(this.destroy$ || this.startIndex===this.typingContent.length)).subscribe(() => {
      this.initPlayScreen()
      if(this.startIndex===this.typingContent.length){
        this.announceResult=this.khmerTypingService.announceResult().toString()
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.textAreaControl.disable()
        this.khmerTypingService.announceResult();
        this.khmerTypingService.resetContent()
        console.log('No more content to type so destroyed!!!');
      }
    })
  }
  restartTyping(){
    try {
      this.keepChecking.subscribe()
      this.startIndex=0
      this.textAreaControl.enable()
      this.khmerTypingService.resetContent()
      this.announceResult=''
      this.typingContent=this.khmerTypingService.khmerAlphabetSplitter(this.typingTextAreaData);
      this.displayCurrentAlphabet = this.typingTextAreaData[0]
      this.currentinput=''
    } catch (e) {
      console.error("the error: ", e)
    }
  }
  initPlayScreen() {
    this.textAreaControl.statusChanges.subscribe((value) => {
      const input = this.textAreaControl.value
      if (value && input != null) {
        this.currentinput=input
        if (input == this.typingContent[this.startIndex]?.khmer) {
          this.khmerTypingService.playTime(input, this.startIndex)
          this.startIndex = this.startIndex + 1     
          this.displayCurrentAlphabet = this.typingContent[this.startIndex]?.khmer == ' ' ? 'space' : this.typingContent[this.startIndex]?.khmer    
          this.textAreaControl.reset()          
        }else{
          this.khmerTypingService.playTime(input, this.startIndex)
          this.textAreaControl.reset()
        }
        this.textAreaControl.reset()
      }
    })
  }
  ngOnDestroy(): void {
    // when destroy$ already unsubscribed
    try {
      this.destroy$.next(true);
      this.destroy$.unsubscribe();
      this.textAreaControl.disable()
      this.khmerTypingService.resetContent()
      console.log('Component Destroyed!!!')
    } catch (e) {
      console.error("the error: ", e)
    }
  }

}
