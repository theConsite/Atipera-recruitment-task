import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

interface PeriodicTableState {
  elements: PeriodicElement[];
}

@Injectable({
  providedIn: 'root',
})
export class PeriodicTableService extends RxState<PeriodicTableState> {
  constructor() {
    super();
    this.set({ elements: ELEMENT_DATA });
  }

  getElements(): Observable<PeriodicElement[]> {
    return this.select('elements');
  }

  filterElements(query: string): Observable<PeriodicElement[]> {
    const lowerCaseQuery = query.toLowerCase();

    return this.getElements().pipe(
      map((elements) =>
        elements.filter((element) =>
          Object.values(element).some((value) =>
            value.toString().toLowerCase().includes(lowerCaseQuery)
          )
        )
      )
    );
  }

  updateElement(updatedElement: PeriodicElement): void {
    this.set((state) => {
      const index = state.elements.findIndex(el => el.position === updatedElement.position);
      if (index !== -1) {
        const newElements = [...state.elements];
        newElements[index] = updatedElement;
        return { elements: newElements };
      }
      return state;
    });
  }
}
