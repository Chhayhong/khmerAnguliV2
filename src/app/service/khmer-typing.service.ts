import { Injectable } from '@angular/core';
import Graphemer from 'graphemer';
import { Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KhmerTypingService {
  alphabetArray:any=[];
  splitter = new Graphemer();
  announceResultMessage:string = 'Congratulation, you have finished typing🎉'
  constructor() { }
  khmerAlphabetSplitter(khmerWord:string){
    const graphemes = this.splitter.splitGraphemes(khmerWord);
    graphemes.forEach(alphabet => {     
      if(alphabet.charAt(0).charCodeAt(0)!==8203){ //remove english space.
        if(alphabet.length>1){
          let firstLetter = {khmer:alphabet.charAt(0),unicode:alphabet.charAt(0).charCodeAt(0),correct:false,inCorrectCount:0,current:false}
          let secondLetter ={khmer:alphabet.charAt(1),unicode:alphabet.charAt(1).charCodeAt(0),correct:false,inCorrectCount:0,current:false}
          this.alphabetArray.push(firstLetter,secondLetter)
        }else{          
          this.alphabetArray.push({khmer:alphabet.charAt(0),unicode:alphabet.charAt(0).charCodeAt(0),correct:false,inCorrectCount:0,current:false})
        }
      }
      });
      this.alphabetArray[0].current=true; //set first alphabet as the first current key to type.
      return this.alphabetArray as Observable<[]>;
  }
  playTime(input:any,index:number){
    if(this.checkIfContentToTypeRemain()){
      return
    }
    this.setCurrentAlphabetAsCurrentTyping()
    if(input===this.alphabetArray[index]?.khmer){
      this.alphabetArray[index].correct=true;
      this.alphabetArray[index].current=true;
    }else{
        try { //fix error of undefined when restart typing.
          this.alphabetArray[index].current=true;
        this.alphabetArray[index].inCorrectCount=this.alphabetArray[index].inCorrectCount +1;
        } catch (error) {
          console.error(error)
        }
    }
  }
  announceResult(){
    return this.announceResultMessage;
  }
  resetContent(){
    this.alphabetArray=[]
  }
  setGameToEnd(){
    return null;
  }
  setCurrentAlphabetAsCurrentTyping(){
    if(this.alphabetArray.length!==0 && !this.alphabetArray[0].current){
      this.alphabetArray[0].current=true;
    }
  }
  checkIfContentToTypeRemain(){
    return this.alphabetArray.length===0;
  }
}
