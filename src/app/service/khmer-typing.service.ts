import { Injectable } from '@angular/core';
import { from, pairwise } from 'rxjs';
import combinableVowel from '../utility/combinable-vowel';

@Injectable({
  providedIn: 'root'
})
export class KhmerTypingService {
  alphabetArray: any = [];
  unwantedStringList = [8203, 10]
  meetCominableVowel=false;
  announceResultMessage: string = 'អបអរសាទរ, អ្នកបានវាយបញ្ចប់ដោយជោគជ័យ🎉'
  constructor() { }
  //Todo : Fix when meet ាំ keyboard not accept the correct value.
  khmerAlphabetSplitter(khmerWord: string) {
    const splittedContent = from(khmerWord);
    splittedContent.pipe(
      pairwise(),
   )
   .subscribe(([previousValue, currentValue]) => { 
       if(this.checkUnwantedString(previousValue)){
        return;
       }   
       if(this.checkCombinableVowel(previousValue,currentValue)){
        this.meetCominableVowel=true
        this.alphabetArray.push({ khmer:combinableVowel[previousValue], unicode: this.getCharCodeAt(combinableVowel[previousValue]), correct: false, inCorrectCount: 0, current: false,type:'combinableVowel' })
      }else{         
        if(this.meetCominableVowel){ //seemly skip one object​ to push into array if meet combinable vowel.
          this.meetCominableVowel=false
          return
        }
        this.alphabetArray.push({ khmer: this.getCharAt(previousValue), unicode: this.getCharCodeAt(previousValue), correct: false, inCorrectCount: 0, current: false,type:'single' })
       }       
   });
    this.alphabetArray[0].current = true; //set first alphabet as the first current key to type.      
    console.log(this.alphabetArray);
              
    return this.alphabetArray;
  }
  specialAlphabetConverter(alphabet: string) {
    switch (alphabet) {
      case ' ': {
        return 'ដកឃ្លា'
      }
      case '្': {
        return 'ដាកជើង'
      }
      default: {
        return alphabet
      }
    }
  }
  playTime(input: any, index: number) {    
    if (this.checkIfContentToTypeRemain()) {
      return
    }
    this.setCurrentAlphabetAsCurrentTyping()
    if (input === this.alphabetArray[index]?.khmer) {
      this.alphabetArray[index].correct = true;
      this.alphabetArray[index].current = true;
    } else {
      try { //fix error of undefined when restart typing.
        this.alphabetArray[index].current = true;
        this.alphabetArray[index].inCorrectCount = this.alphabetArray[index].inCorrectCount + 1;
      } catch (error) {
        console.error(error)
      }
    }
  }
  checkCombinableVowel(previousValue:any,currentValue:string){
    if(previousValue==='ោ' && currentValue==='ះ' || previousValue==='ា' && currentValue==='ំ'){
      return true
    }else{
      return false;
    }
  }
  getCharCodeAt(value: string) {
    return value.charAt(0).charCodeAt(0)
  }
  getCharAt(value: string) {
    return value.charAt(0)
  }
  checkUnwantedString(value: string) { //remove Zero-width space and /n new line format   
    const skip = this.unwantedStringList
    const charCode = this.getCharCodeAt(value)
    if ((skip[0] === charCode || skip[1] === charCode)) {
      return true
    } else {
      return false
    }
  }
  announceResult() {
    return this.announceResultMessage;
  }
  resetContent() {
    this.alphabetArray = []
  }
  setGameToEnd() {
    return 'អត់ទាន់ធ្វើទេ 😋';
  }
  setCurrentAlphabetAsCurrentTyping() {
    if (this.alphabetArray.length !== 0 && !this.alphabetArray[0].current) {
      this.alphabetArray[0].current = true;
    }
  }
  checkIfContentToTypeRemain() {
    return this.alphabetArray.length === 0;
  }
}
