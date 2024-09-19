import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { Subject,debounceTime } from 'rxjs';
import { MatInputModule } from '@angular/material/input';

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

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    NgIf,
    MatInputModule
  ],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: PeriodicElement[] = [];
  isLoading: boolean = true;
  filterValue: string = '';
  filterSubject: Subject<string> = new Subject<string>();

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.dataSource = [...ELEMENT_DATA];
      this.isLoading = false;
    }, 1500);

    this.filterSubject.pipe(debounceTime(2000)).subscribe(() => {
      this.applyFilter();
    });
  }

  applyFilter() {
    const lowerCaseFilter = this.filterValue.toLowerCase();
    console.log(lowerCaseFilter)
    this.dataSource = ELEMENT_DATA.filter(element =>
      element.name.toLowerCase().includes(lowerCaseFilter) ||
      element.symbol.toLowerCase().includes(lowerCaseFilter) ||
      element.position.toString().includes(lowerCaseFilter) ||
      element.weight.toString().includes(lowerCaseFilter)
    );
  }

  onFilterChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.filterValue = input.value;
    this.filterSubject.next(this.filterValue);
  }

}