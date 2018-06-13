import { Injectable } from '@angular/core';

@Injectable()
export class FuncionesComunesProvider {

  constructor() {  }

  arrayObjectIndexOf(myArray: object[], searchTerm:any, property:string): number{
    for (let index = 0; index < myArray.length; index++) {
      if(myArray[index][property] === searchTerm){
        return index;
      }
    }
    return -1;
  }
}
