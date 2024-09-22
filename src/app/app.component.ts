import { Component, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, debounceTime } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { PeriodicElement, PeriodicTableService } from './periodic-table.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    MatInputModule,
    CommonModule
  ],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource<PeriodicElement>();
  filterValue: string = '';
  filterSubject: Subject<string> = new Subject<string>();

  constructor(public dialog: MatDialog, private periodicTableService: PeriodicTableService) {
    this.periodicTableService.getElements().subscribe(data => {
      this.dataSource.data = data ?? [];
    });
  }

  ngOnInit(): void {
    this.filterSubject.pipe(debounceTime(2000)).subscribe(() => {
      this.periodicTableService.filterElements(this.filterValue).subscribe(data => {
        this.dataSource.data = data ?? [];
      });
    });
  }

  onFilterChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.filterValue = input.value;
    this.filterSubject.next(this.filterValue);
  }

  openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '300px',
      data: { ...element } 
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.periodicTableService.updateElement(result);
      }
    });
  }


}