import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Renderer2, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of, Subject, takeUntil } from 'rxjs';
import { KhmerTypingService } from 'src/app/service/khmer-typing.service';
import mapping from "../../utility/mapping";
import localContent from 'src/app/utility/local-content';
import combinableVowel from 'src/app/utility/combinable-vowel';
@Component({
  selector: 'app-typing-textarea',
  templateUrl: './typing-textarea.component.html',
  styleUrls: ['./typing-textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypingTextareaComponent implements OnInit, OnDestroy {
  @Input() typingTextAreaData =  localContent['debug'];
  destroy$: Subject<boolean> = new Subject<boolean>();
  // forceFocus: boolean = true;
  displayCurrentAlphabet: string = '';
  textAreaControl = new FormControl('');
  startIndex = 0; 
  // keepChecking = interval(0);
  currentinput:any=''
  announceResult:string='';
  keyboard:any=''
  comboKeyCounter=0;
   firstInput=''
   secondInput=''
  constructor(
    private khmerTypingService: KhmerTypingService,
    private renderer: Renderer2
  ) {
    this.displayCurrentAlphabet = this.typingTextAreaData[0]
    this.keyboard=mapping[this.typingTextAreaData[0]]
  }
  typingContent: any = this.khmerTypingService.khmerAlphabetSplitter(this.typingTextAreaData);
  ngOnInit() {
      this.initPlayScreen()
  }
 
  initPlayScreen() {
    const inputValue= of(this.textAreaControl).pipe()
    inputValue.subscribe((value)=>{
      value.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((input)=>{
   if (input != null) {    
        if(this.checkCombinableVowel()){
          this.comboKeyCounter++ 
          if(this.comboKeyCounter===1){
            this.firstInput=input
          }          
          if(this.comboKeyCounter===2){
            this.secondInput=input
            if(this.firstInput==='ា' && this.secondInput==='ំ' || this.firstInput==='ោ' && this.secondInput==='ះ'){
              input=combinableVowel[this.firstInput]
              this.firstInput=''
              this.secondInput=''
              this.comboKeyCounter=0
            }
            this.comboKeyCounter=0
          }
        }
        this.currentinput=input
        if (input == this.typingContent[this.startIndex]?.khmer) {
          this.khmerTypingService.playTime(input, this.startIndex)
          this.startIndex = this.startIndex + 1
          this.keyboard=mapping[this.typingContent[this.startIndex]?.khmer]
          this.displayCurrentAlphabet = this.khmerTypingService.specialAlphabetConverter(this.typingContent[this.startIndex]?.khmer)
          this.textAreaControl.reset()          
        }else{
          this.khmerTypingService.playTime(input, this.startIndex)          
          this.textAreaControl.reset()
        }
        this.textAreaControl.reset()
        try {
          this.onEndGame()
        } catch (error) {
          console.warn('Error :  ',error);
        }
      }
      })
    });
  }
  checkCombinableVowel(){
    return this.khmerTypingService.specialAlphabetConverter(this.typingContent[this.startIndex]?.type)==='combinableVowel'?true:false;
  }
  onEndGame(){
    if(this.startIndex===this.typingContent.length){
      this.announceResult=this.khmerTypingService.announceResult().toString()
      this.textAreaControl.disable();
      this.startIndex=0;
      this.khmerTypingService.resetContent()
      console.log('No more content to type so destroyed!!!');
    }
  }

  restartTyping(){
    try {
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

  ngOnDestroy(): void {
    // try catch to avoid loop of error in console.
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
