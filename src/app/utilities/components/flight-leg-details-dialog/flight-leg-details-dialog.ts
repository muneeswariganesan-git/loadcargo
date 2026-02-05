import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

export type FlightLegRow = {
  origin: string;
  std: string;          // e.g., 2100, 2005+1
  etd: string;          // blank string if no ETD
  destination: string;
  sta: string;          // e.g., 1825+1
};

@Component({
  selector: 'app-flight-leg-details-dialog',
  imports: [CommonModule, MatDialogModule, MatTableModule, MatButtonModule],
  templateUrl: './flight-leg-details-dialog.html',
  styleUrl: './flight-leg-details-dialog.css',
})
export class FlightLegDetailsDialog {

 
displayedColumns = ['origin', 'std', 'etd', 'destination', 'sta'];

constructor(
  public dialogRef: MatDialogRef<FlightLegDetailsDialog>,
  @Inject(MAT_DIALOG_DATA) public rows: FlightLegRow[]
) {}

close(): void {
  this.dialogRef.close();
}


}
