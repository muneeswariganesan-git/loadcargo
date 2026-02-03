import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../services/product-service';
import {
  FlightDetails,
  FlightHeaderViewModel
} from '../../../models/cargo-flight-header-model';

type LegVM = {
  origin?: string;
  destination?: string;
  std?: string;  // HHmm (+n)
  sta?: string;  // HHmm (+n)
  etd?: string;  // HHmm (+n) — blank unless an Estimated departure exists
};

type HeaderVM = FlightHeaderViewModel & {
  isMultiLeg: boolean;   // flightLeg.length > 1
  hasMore: boolean;      // same as isMultiLeg
  legs: LegVM[];         // [0] first leg, [1] second leg (if present)
};

@Component({
  selector: 'app-flight-details-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-details-header.html',
  styleUrls: ['./flight-details-header.css'],
})
export class FlightDetailsHeader {
  private readonly destroyRef = inject(DestroyRef);
  cargoFlightHeaderData!: HeaderVM;

  constructor(private headerState: ProductService) {}

  ngOnInit(): void {
    this.headerState.flightData$
      .pipe(
        filter((data): data is FlightDetails => data !== null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => {
        this.cargoFlightHeaderData = this.mapHeaderData(data);
        console.log(JSON.stringify(this.cargoFlightHeaderData), 'header-vm');
      });
  }

  onMore(): void {
    // Hook this to a dialog/bottom-sheet to show all legs.
    console.log('More legs clicked');
  }

  // ------------------ Mapping ------------------

  private mapHeaderData(header: FlightDetails): HeaderVM {
    if (!header?.datedFlightLeg) return {} as HeaderVM;

    const legs = header.flightLeg ?? [];
    const isMultiLeg = legs.length > 1;

    const firstLeg = legs[0] ?? null;
    const secondLeg = legs[1] ?? null;

    // Helper to pick times with the required priorities
    const pickTimes = (leg: any) => {
      const dt = Array.isArray(leg?.dateTimes) ? leg.dateTimes : [];

      const depScheduled = dt.find((d: any) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Scheduled');
      const depEstimated = dt.find((d: any) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Estimated');

      const arrScheduled = dt.find((d: any) => d.dateTimeType === 'Arrival' && d.dateTimeStatus === 'Scheduled');
      const arrEstimated = dt.find((d: any) => d.dateTimeType === 'Arrival' && d.dateTimeStatus === 'Estimated');

      // STD: prefer Scheduled, fallback Estimated
      const stdLocal = depScheduled?.dateTimeLocal ?? depEstimated?.dateTimeLocal;

      // ETD: ONLY show if Estimated exists (no fallback to Scheduled)
      const etdLocal = depEstimated?.dateTimeLocal ?? undefined;

      // STA: prefer Estimated, fallback Scheduled
      const staLocal = arrEstimated?.dateTimeLocal ?? arrScheduled?.dateTimeLocal;

      return { stdLocal, etdLocal, staLocal, hasEtd: !!depEstimated?.dateTimeLocal };
    };

    const { stdLocal: firstSTD, etdLocal: firstETD, staLocal: firstSTA, hasEtd: firstHasEtd } = pickTimes(firstLeg);
    const { stdLocal: secondSTD, etdLocal: secondETD, hasEtd: secondHasEtd } = pickTimes(secondLeg);

    // Journey base for +n on downstream legs
    const journeyBase = firstSTD ?? header.datedFlightLeg.scheduledDepartureDateLocal;

    const legsVM: LegVM[] = [];

    // First leg row
    if (firstLeg) {
      legsVM.push({
        origin: firstLeg?.flightLegOrigin ?? header.datedFlightLeg.originStation,
        destination: firstLeg?.flightLegDestination ?? header.datedFlightLeg.destinationStation,
        std: this.formatTimeWithShift(firstSTD, journeyBase),          // +n vs journey start
        sta: this.formatArrivalPlus(firstSTA, firstSTD),               // +n vs this leg's STD
        // ETD shown only if we actually have an Estimated departure
        etd: firstHasEtd ? this.formatTimeWithShift(firstETD, journeyBase) : '',
      });
    }

    // Second leg column (STD/ETD only)
    if (secondLeg) {
      legsVM.push({
        std: this.formatTimeWithShift(secondSTD, journeyBase),
        // Consistent rule: ETD only if Estimated exists
        etd: secondHasEtd ? this.formatTimeWithShift(secondETD, journeyBase) : '',
      });
    }

    const vm: HeaderVM = {
      origin: legsVM[0]?.origin ?? header.datedFlightLeg.originStation,
      destination: legsVM[0]?.destination ?? header.datedFlightLeg.destinationStation,

      flight: `${header.datedFlightLeg.operatorCarrierCode} ${header.datedFlightLeg.operationalFlightNumber}${header.datedFlightLeg.operationalFlightNumberSuffix ?? ''}`,
      date: this.formatDate(firstSTD ?? header.datedFlightLeg.scheduledDepartureDateLocal),

      fitment: `${header.currentFlightFitment?.palletCount ?? 0}P ${header.currentFlightFitment?.containerCount ?? 0}C`,

      reg: header.aircraftRegistrationCode,
      stand: header.standNumber,
      subType: header.airfliteAircraftSubtype ?? header.fmAircraftSubType,

      // Backward compatibility for single-leg bindings
      std: legsVM[0]?.std ?? '',
      sta: legsVM[0]?.sta ?? '',

      generalStatus: header.flightStatus?.generalStatusCode,
      loadControlStatus: header.flightStatus?.loadControlStatusCode,

      optima: header.ngrmFitment
        ? `${header.ngrmFitment.palletCount}P ${header.ngrmFitment.containerCount}C`
        : '',

      buildClose: this.formatTime(header.product?.plannedBuildCloseTime),
      cargoRelease: this.formatTime(header.product?.plannedLoadReleaseTime),
      manifest: this.formatTime(header.product?.plannedManifestTime),

      owner: header.product?.ownerName,
      notes: header.flightStatus?.scheduleStatus,

      isMultiLeg,
      hasMore: isMultiLeg,
      legs: legsVM,
    };

    return vm;
  }

  // ------------------ Formatting helpers ------------------

  private formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${day}${month}`;
  }

  private formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const hh = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    return `${hh}${mm}`;
  }

  /** HHmm (+n) where n = day shift from baseStr (journey start) to targetStr (local date only) */
  private formatTimeWithShift(targetStr?: string, baseStr?: string): string {
    if (!targetStr) return '';
    const t = new Date(targetStr);
    const base = baseStr ? new Date(baseStr) : t;
    const offset = this.dayDiffLocal(base, t);
    const hhmm = this.formatTime(targetStr);
    return `${hhmm}${offset > 0 ? `+${offset}` : ''}`;
  }

  /** HHmm (+n) for STA; n = day difference between this leg's STD and STA (local dates) */
  private formatArrivalPlus(arrivalStr?: string, legStdStr?: string): string {
    if (!arrivalStr) return '';
    const arr = new Date(arrivalStr);
    const dep = legStdStr ? new Date(legStdStr) : arr;
    const offset = this.dayDiffLocal(dep, arr);
    const hhmm = this.formatTime(arrivalStr);
    return `${hhmm}${offset > 0 ? `+${offset}` : ''}`;
  }

  private dayDiffLocal(a: Date, b: Date): number {
    const aD = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const bD = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((bD.getTime() - aD.getTime()) / 86400000);
  }
}
