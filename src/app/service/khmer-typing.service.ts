import { Injectable } from '@angular/core';
import { from, pairwise } from 'rxjs';
import combinableVowel from '../utility/combinable-vowel';

@Injectable({
  providedIn: 'root'
})
export class KhmerTypingService {
  alphabetArray: any = [];
  unwantedStringList = [8203, 10]
  meetCominableVowel = false;
  announceResultMessage: string = 'អបអរសាទរ, អ្នកបានវាយបញ្ចប់ដោយជោគជ័យ🎉'
  constructor() { }
  khmerAlphabetSplitter(khmerWord: string) {
    const splittedContent = from(this.takeOnlyOneSpace(khmerWord));
    splittedContent.pipe(
      pairwise(),
    )
      .subscribe(([previousValue, currentValue]) => {
        console.log('Combinable vowel : ',previousValue,currentValue,this.checkCombinableVowel(previousValue, currentValue));
        
        if (this.checkUnwantedString(previousValue)) {
          return;
        }
        if (this.checkCombinableVowel(previousValue, currentValue)) {
          this.meetCominableVowel = true
          this.alphabetArray.push({ khmer: this.scopeOutVowel(previousValue,currentValue), unicode: this.getCharCodeAt(this.scopeOutVowel(previousValue,currentValue)), correct: false, inCorrectCount: 0, current: false, type: 'combinableVowel' })

          // this.alphabetArray.push({ khmer: combinableVowel[previousValue], unicode: this.getCharCodeAt(combinableVowel[previousValue]), correct: false, inCorrectCount: 0, current: false, type: 'combinableVowel' })
        } else {
          if (this.meetCominableVowel) { //simply skip one object​ to push into array if meet combinable vowel.
            this.meetCominableVowel = false
            return
          }
          //TODO: Fix after restart typing, the first string is missing :(
          this.alphabetArray.push({ khmer: this.getCharAt(previousValue), unicode: this.getCharCodeAt(previousValue), correct: false, inCorrectCount: 0, current: false, type: 'single' })
        }
      });
    this.alphabetArray[0].current = true; //set first alphabet as the first current key to type.          
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
  scopeOutVowel(previousValue:string,currentValue:string){
    if(previousValue === 'ុ' && currentValue === 'ី'){
      return `ុី`
    }else{
      return combinableVowel[previousValue]
    }
  }
  checkCombinableVowel(previousValue: any, currentValue: string) {
    if (previousValue === 'ុ' && currentValue === 'ី' ||previousValue === 'េ' && currentValue === 'ះ' || previousValue === '៊' && currentValue === 'ី' || previousValue === 'ោ' && currentValue === 'ះ' || previousValue === 'ា' && currentValue === 'ំ' || previousValue === 'ុ' && currentValue === 'ះ') {
      return true
    } else {
      return false;
    }
  }
  getCharCodeAt(value: string) {
    if(!value){
      console.warn('Error : maybe it is another combinable vowel which is not handling.')
      return
    }
    return value.charCodeAt(0)
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
  takeOnlyOneSpace(value: string) { // just read the method name xD
    return value.trim().replace(/\s+/g, " ")
  }
  announceResult() {
    return this.announceResultMessage;
  }
  resetContent() {
    this.meetCominableVowel=false; //this should be fix the missing first string after restart typing.
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
