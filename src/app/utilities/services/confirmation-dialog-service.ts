import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {
  ConfirmationDialog,
  ConfirmDialogData,
} from '../components/confirmation-dialog/confirmation-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(private dialog: MatDialog) {}

  open(data: ConfirmDialogData): Observable<boolean | undefined> {
    return this.dialog
      .open(ConfirmationDialog, {
       
        width: '95vw',
        maxWidth: '450px',
        
        panelClass: 'custom-dialog',
        data,
      })
      .afterClosed();
  }
}
