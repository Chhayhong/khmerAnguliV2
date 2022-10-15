import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, RendererStyleFlags2, } from '@angular/core';
import { FormControl } from '@angular/forms';
import { of, Subject, takeUntil } from 'rxjs';
import { KhmerTypingService } from 'src/app/service/khmer-typing.service';
import mapping from "../../utility/mapping";
import localContent from 'src/app/utility/local-content';
import combinableVowel from 'src/app/utility/combinable-vowel';
import nextCombinableVowel from 'src/app/utility/next-combinable-vowel';
import nextKeyHintCombinableVowel from 'src/app/utility/next-key-hint-combinablevowel';
@Component({
  selector: 'app-typing-textarea',
  templateUrl: './typing-textarea.component.html',
  styleUrls: ['./typing-textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypingTextareaComponent implements OnInit, OnDestroy {
  @Input() typingTextAreaData = localContent['debug'];
  destroy$: Subject<boolean> = new Subject<boolean>();
  // forceFocus: boolean = true;
  displayCurrentAlphabet: string = '';
  textAreaControl = new FormControl('');
  startIndex = 0;
  // keepChecking = interval(0);
  currentinput: any = ''
  announceResult: string = '';
  keyboard: any = ''
  comboKeyCounter = 0;
  firstInput = ''
  secondInput = ''
  constructor(
    private khmerTypingService: KhmerTypingService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.displayCurrentAlphabet = this.typingTextAreaData[0]
    this.keyboard = mapping[this.typingTextAreaData[0]]
  }
  typingContent: any = this.khmerTypingService.khmerAlphabetSplitter(this.typingTextAreaData);
  ngOnInit() {
    this.initPlayScreen()
  }
  //TODO: fix the typing ុំ does not accept.
  initPlayScreen() {
    const inputValue = of(this.textAreaControl)
    inputValue.subscribe((value) => {
      value.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((input) => {
          if (input != null) {
            if (this.checkCombinableVowel()) {
              this.comboKeyCounter++
              if (this.comboKeyCounter === 1) {
                this.firstInput = input
                if (!combinableVowel[this.firstInput]) {
                  this.resetComboKeys()
                  this.keyboard = mapping[this.typingContent[this.startIndex]?.khmer]
                }else{
                  this.keyboard = mapping[nextKeyHintCombinableVowel[this.firstInput]]
                }
              }
              if (this.comboKeyCounter === 2) {
                this.secondInput = input
                if (!nextCombinableVowel[this.secondInput]) {
                  this.resetComboKeys()
                }
                if (this.checkBothVowel()) {
                  // input = combinableVowel[this.firstInput]
                  input =this.scopeOutVowel(this.firstInput,this.secondInput)
                  console.log(input);
                  
                  this.resetComboKeys()
                }
                
              }
            }
            if (this.comboKeyCounter > 2) {
              this.comboKeyCounter = 0
            }
            this.currentinput = input
            if (input == this.typingContent[this.startIndex]?.khmer) {
              this.khmerTypingService.playTime(input, this.startIndex)
              this.markIncorrectAlphabet(this.startIndex, '#ffff')
              this.startIndex = this.startIndex + 1
              this.keyboard = mapping[this.typingContent[this.startIndex]?.khmer]
              this.displayCurrentAlphabet = this.khmerTypingService.specialAlphabetConverter(this.typingContent[this.startIndex]?.khmer)
              this.textAreaControl.reset()
            } else {
        
              this.markIncorrectAlphabet(this.startIndex, 'red')
              this.khmerTypingService.playTime(input, this.startIndex)
              this.textAreaControl.reset()
            }
            this.textAreaControl.reset()
            try {
              this.onEndGame()
            } catch (error) {
              console.warn('the error :  ', error);
            }
          }
        })
    });
  }
  checkBothVowel() {
    if (this.firstInput === 'ុ' && this.secondInput === 'ំ' || this.firstInput === 'ុ' && this.secondInput === 'ី' || this.firstInput === 'េ' && this.secondInput === 'ះ' || this.firstInput === '៊' && this.secondInput === 'ី' || this.firstInput === 'ា' && this.secondInput === 'ំ' || this.firstInput === 'ោ' && this.secondInput === 'ះ' || this.firstInput === 'ុ' && this.secondInput === 'ះ') {
      return true;
    } else {
      return false;
    }
  }
  checkCombinableVowel() {
    return this.typingContent[this.startIndex]?.type === 'combinableVowel' ? true : false;
  }
  resetComboKeys() {
    this.firstInput = ''
    this.secondInput = ''
    this.comboKeyCounter = 0
  }
  onEndGame() {
    if (this.startIndex === this.typingContent.length) {
      this.announceResult = this.khmerTypingService.announceResult().toString()
      this.textAreaControl.disable();
      this.startIndex = 0;
      this.resetComboKeys()
      this.khmerTypingService.resetContent()
    }
  }
  markIncorrectAlphabet(alphabetIndex: number, color: string) {
    const alphabet = this.el.nativeElement.querySelector('.alphabet' + alphabetIndex);
    this.renderer.setStyle(alphabet, 'text-decoration', 'underline', RendererStyleFlags2.Important + RendererStyleFlags2.DashCase);
    this.renderer.setStyle(alphabet, 'text-decoration-color', color, RendererStyleFlags2.Important + RendererStyleFlags2.DashCase);
  }
  scopeOutVowel(firstInput: string, secondInput: string) {
    if (firstInput === '៊' && secondInput === 'ី') {
      return `ុី`
    }
    if (firstInput === 'ុ' && secondInput === 'ី') {
      return `ុី`
    } else if (firstInput === 'ុ' && secondInput === 'ំ') {
      return `ុំ`
    } else {
      return nextKeyHintCombinableVowel[firstInput]
    }
  }
  restartTyping() {
    try {
      this.startIndex = 0
      this.textAreaControl.enable()
      this.khmerTypingService.resetContent()
      this.keyboard = mapping[this.typingTextAreaData[0]]
      this.announceResult = ''
      this.typingContent = this.khmerTypingService.khmerAlphabetSplitter(this.typingTextAreaData);
      this.displayCurrentAlphabet = this.typingTextAreaData[0]
      this.currentinput = ''
      this.resetComboKeys()
    } catch (e) {
      console.error("the error: ", e)
    }
  }

  ngOnDestroy(): void {
    try {
      this.destroy$.next(true);
      this.destroy$.unsubscribe();
      this.textAreaControl.disable()
      this.khmerTypingService.resetContent()
      this.destroy$.unsubscribe()
    } catch (e) {
      console.error("the error: ", e)
    }
  }

}
