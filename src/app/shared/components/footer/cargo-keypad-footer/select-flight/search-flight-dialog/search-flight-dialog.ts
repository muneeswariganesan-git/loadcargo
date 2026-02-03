
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../../../../services/product-service';

@Component({
  selector: 'app-search-flight-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule, FormsModule, MatIconModule],
  templateUrl: './search-flight-dialog.html',
  styleUrls: ['./search-flight-dialog.css'],
})
export class SearchFlightDialog {
  @ViewChild('frm') frm?: NgForm;

  formData = {
    fn1: 'BA',
    fn2: '',
    day: '',
    month: '',
    year: '',
    station: 'LHR',
  };

 
  activeField: string = 'fn2';

  
  @ViewChild('autoFocusFn2', { static: false }) autoFocusFn2!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SearchFlightDialog>,
    private sharedService: ProductService
  ) {
    this.resetForm();
  }

  ngOnInit(): void {
    this.resetForm();
  }

 
ngAfterViewInit() {

  setTimeout(() => {
    this.focusFn2();
  }, 150);  
}

focusFn2() {
  if (this.autoFocusFn2?.nativeElement) {
    this.autoFocusFn2.nativeElement.focus();
    this.autoFocusFn2.nativeElement.select(); 
  }
}

  onSubmit(form: NgForm) {
   
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

  
    this.activeField = '';

    const payload = {
      flightNumbers: [this.formData.fn1, this.formData.fn2],
      flightDate: `${this.formData.day}-${this.formData.month}-${this.formData.year}`,
      departureStation: this.formData.station,
    };

    this.sharedService.set(payload);
    this.dialogRef.close(payload);
  }

  resetForm() {
    const today = new Date();
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    this.formData.day = today.getDate().toString().padStart(2, '0');
    this.formData.month = months[today.getMonth()];
    this.formData.year = today.getFullYear().toString();
    this.formData.station = 'LHR';
    this.formData.fn2 = '';
  }

  close() {
    this.dialogRef.close();
  }
}
