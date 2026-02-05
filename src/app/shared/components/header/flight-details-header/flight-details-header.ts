import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../services/product-service';
import { FlightDetails, FlightHeaderViewModel } from '../../../models/cargo-flight-header-model';
import { MatDialog } from '@angular/material/dialog';
import { FlightLegDetailsDialog, FlightLegRow } from '../../../../utilities/components/flight-leg-details-dialog/flight-leg-details-dialog';

type LegVM = {
  origin?: string;
  destination?: string;
  std?: string;
  sta?: string;
  etd?: string;
};

type HeaderVM = FlightHeaderViewModel & {
  isMultiLeg: boolean;
  hasMore: boolean;
  legs: LegVM[];

  generalStatusDisplay?: string;
};

type BuildCloseDisplay = {
  text: 'Y' | 'N' | '--';
  diffHours?: number | null;
};
type CargoReleaseDisplay = {
  text: string;

  status: 'cr-done' | 'cr-ok' | 'cr-due' | 'cr-overdue' | 'cr-na';

  cutoff?: Date | null;

  etdOrStd?: Date | null;

  usedEtd?: boolean;
};

@Component({
  selector: 'app-flight-details-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-details-header.html',
  styleUrls: ['./flight-details-header.css'],
})
export class FlightDetailsHeader {
  private readonly CR_BASIS: 'STD' | 'ETD' | 'ETD_PREF_STD_FALLBACK' = 'STD';
  buildCloseDisplay: BuildCloseDisplay = { text: '--', diffHours: null };
  cargoReleaseDisplay: CargoReleaseDisplay = {
    text: '--',
    status: 'cr-na',
    cutoff: null,
    etdOrStd: null,
    usedEtd: false,
  };

  private readonly destroyRef = inject(DestroyRef);
  cargoFlightHeaderData!: HeaderVM;
  private rawFlightData!: FlightDetails;
  constructor(private headerState: ProductService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.headerState.flightData$
      .pipe(
        filter((data): data is FlightDetails => data !== null),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.rawFlightData = data;
        this.cargoFlightHeaderData = this.mapHeaderData(data);

        this.cargoReleaseDisplay = this.computeCargoReleaseDisplay(data);

        this.buildCloseDisplay = this.computeBuildCloseDisplay(data);
        this.cargoFlightHeaderData.generalStatusDisplay = this.mapGeneralStatusDisplay(
          this.cargoFlightHeaderData.generalStatus
        );
      });
  }

  onMore(): void {
    const rows = this.buildLegRowsForDialog(this.rawFlightData);
       this.dialog.open(FlightLegDetailsDialog, {
         width: '540px',
         panelClass: 'flight-leg-details-panel', // hook for flat style
         autoFocus: true,
         restoreFocus: true,
         data: rows,
       });
    console.log('More legs clicked');
  }
  
 private buildLegRowsForDialog(header: FlightDetails): FlightLegRow[] {
  const legs = header.flightLeg ?? [];

  const pickTimes = (leg: any) => {
    const dt = Array.isArray(leg?.dateTimes) ? leg.dateTimes : [];
    const depScheduled = dt.find((d: any) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Scheduled');
    const depEstimated = dt.find((d: any) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Estimated');
    const arrEstimated = dt.find((d: any) => d.dateTimeType === 'Arrival' && d.dateTimeStatus === 'Estimated');
    const arrScheduled = dt.find((d: any) => d.dateTimeType === 'Arrival' && d.dateTimeStatus === 'Scheduled');

    const stdLocal = depScheduled?.dateTimeLocal ?? depEstimated?.dateTimeLocal; // prefer Scheduled
    const etdLocal = depEstimated?.dateTimeLocal ?? undefined;                  // ETD only if Estimated
    const staLocal = arrEstimated?.dateTimeLocal ?? arrScheduled?.dateTimeLocal;// STA prefer Estimated
    return { stdLocal, etdLocal, staLocal };
  };

  // Journey base for +n against the very first STD (or header’s scheduled STD)
  const firstTimes = pickTimes(legs[0]);
  const journeyBase =
    firstTimes.stdLocal ??
    header?.datedFlightLeg?.scheduledDepartureDateLocal ??
    legs[0]?.dateTimes?.[0]?.dateTimeLocal;

  const rows: FlightLegRow[] = [];

  for (const leg of legs) {
    const { stdLocal, etdLocal, staLocal } = pickTimes(leg);
    rows.push({
      origin: leg?.flightLegOrigin ?? header?.datedFlightLeg?.originStation ?? '',
      destination: leg?.flightLegDestination ?? header?.datedFlightLeg?.destinationStation ?? '',
      std: this.formatTimeWithShift(stdLocal, journeyBase),
      etd: etdLocal ? this.formatTimeWithShift(etdLocal, journeyBase) : '',
      sta: this.formatArrivalPlus(staLocal, stdLocal),
    });
  }

  return rows;
}

  private computeBuildCloseDisplay(header: FlightDetails): BuildCloseDisplay {
    // 1) Get STD (Scheduled Departure)
    const firstLeg = header.flightLeg?.[0];
    const dts: any[] = Array.isArray(firstLeg?.dateTimes) ? firstLeg.dateTimes : [];

    const depSTDStr =
      dts.find((d) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Scheduled')
        ?.dateTimeLocal ?? header?.datedFlightLeg?.scheduledDepartureDateLocal;

    // 2) Get Build Close
    const bcStr = header?.product?.plannedBuildCloseTime;

    if (!depSTDStr || !bcStr) {
      return { text: '--', diffHours: null };
    }

    const std = new Date(depSTDStr);
    const bc = new Date(bcStr);

    const diffMs = std.getTime() - bc.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours > 18) {
      return { text: 'Y', diffHours };
    } else {
      return { text: 'N', diffHours };
    }
  }
  // ------------------ Mapping (UNCHANGED except last two lines) ------------------

  private mapHeaderData(header: FlightDetails): HeaderVM {
    if (!header?.datedFlightLeg) return {} as HeaderVM;

    const legs = header.flightLeg ?? [];
    const isMultiLeg = legs.length > 1;

    const firstLeg = legs[0] ?? null;
    const secondLeg = legs[1] ?? null;

    // Helper to pick times with the required priorities
    const pickTimes = (leg: any) => {
      const dt = Array.isArray(leg?.dateTimes) ? leg.dateTimes : [];

      const depScheduled = dt.find(
        (d: any) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Scheduled'
      );
      const depEstimated = dt.find(
        (d: any) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Estimated'
      );

      const arrScheduled = dt.find(
        (d: any) => d.dateTimeType === 'Arrival' && d.dateTimeStatus === 'Scheduled'
      );
      const arrEstimated = dt.find(
        (d: any) => d.dateTimeType === 'Arrival' && d.dateTimeStatus === 'Estimated'
      );

      // STD: prefer Scheduled, fallback Estimated
      const stdLocal = depScheduled?.dateTimeLocal ?? depEstimated?.dateTimeLocal;

      // ETD: ONLY show if Estimated exists (no fallback to Scheduled)
      const etdLocal = depEstimated?.dateTimeLocal ?? undefined;

      // STA: prefer Estimated, fallback Scheduled
      const staLocal = arrEstimated?.dateTimeLocal ?? arrScheduled?.dateTimeLocal;

      return { stdLocal, etdLocal, staLocal, hasEtd: !!depEstimated?.dateTimeLocal };
    };

    const {
      stdLocal: firstSTD,
      etdLocal: firstETD,
      staLocal: firstSTA,
      hasEtd: firstHasEtd,
    } = pickTimes(firstLeg);
    const { stdLocal: secondSTD, etdLocal: secondETD, hasEtd: secondHasEtd } = pickTimes(secondLeg);

    // Journey base for +n on downstream legs
    const journeyBase = firstSTD ?? header.datedFlightLeg.scheduledDepartureDateLocal;

    const legsVM: LegVM[] = [];

    // First leg row
    if (firstLeg) {
      legsVM.push({
        origin: firstLeg?.flightLegOrigin ?? header.datedFlightLeg.originStation,
        destination: firstLeg?.flightLegDestination ?? header.datedFlightLeg.destinationStation,
        std: this.formatTimeWithShift(firstSTD, journeyBase),
        sta: this.formatArrivalPlus(firstSTA, firstSTD),

        etd: firstHasEtd ? this.formatTimeWithShift(firstETD, journeyBase) : '',
      });
    }

    if (secondLeg) {
      legsVM.push({
        std: this.formatTimeWithShift(secondSTD, journeyBase),
        etd: secondHasEtd ? this.formatTimeWithShift(secondETD, journeyBase) : '',
      });
    }

    const vm: HeaderVM = {
      origin: legsVM[0]?.origin ?? header.datedFlightLeg.originStation,
      destination: legsVM[0]?.destination ?? header.datedFlightLeg.destinationStation,

      flight: `${header.datedFlightLeg.operatorCarrierCode} ${
        header.datedFlightLeg.operationalFlightNumber
      }${header.datedFlightLeg.operationalFlightNumberSuffix ?? ''}`,
      date: this.formatDate(firstSTD ?? header.datedFlightLeg.scheduledDepartureDateLocal),

      fitment: `${header.currentFlightFitment?.palletCount ?? 0}P ${
        header.currentFlightFitment?.containerCount ?? 0
      }C`,

      reg: header.aircraftRegistrationCode,
      stand: header.standNumber,
      subType: header.airfliteAircraftSubtype ?? header.fmAircraftSubType,

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

  private mapGeneralStatusDisplay(code?: string): string {
    if (!code) return '--';
    const c = code.toUpperCase();

    const map: Record<string, string> = {
      GO: 'GO',
      GS: 'GS',
    };

    return map[c] ?? c; // passthrough if not mapped
  }

  private computeCargoReleaseDisplay(header: FlightDetails): CargoReleaseDisplay {
    // -------------------------------
    // 1) If Load Release Status is Final → Show “Y”
    // -------------------------------
    const loadStatus = header?.flightStatus?.loadReleaseStatus?.toString().toUpperCase();
    if (loadStatus === 'FINAL') {
      return {
        text: 'Y',
        status: 'cr-done',
        cutoff: null,
        etdOrStd: null,
        usedEtd: false,
      };
    }

    const firstLeg = header.flightLeg?.[0];
    const dt = Array.isArray(firstLeg?.dateTimes) ? firstLeg.dateTimes : [];

    const depSTD =
      dt.find((d) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Scheduled')
        ?.dateTimeLocal ?? header?.datedFlightLeg?.scheduledDepartureDateLocal;

    if (!depSTD) {
      return {
        text: '--',
        status: 'cr-na',
        cutoff: null,
        etdOrStd: null,
        usedEtd: false,
      };
    }

    const stdDate = new Date(depSTD);

    const crStr = header?.product?.plannedLoadReleaseTime;
    if (!crStr) {
      return {
        text: '--',
        status: 'cr-na',
        cutoff: null,
        etdOrStd: stdDate,
        usedEtd: false,
      };
    }

    const crDate = new Date(crStr);

    const cutoff = new Date(stdDate.getTime() - 150 * 60 * 1000); // 150 mins = 2.5 hours

    const hh = crDate.getHours().toString().padStart(2, '0');
    const mm = crDate.getMinutes().toString().padStart(2, '0');
    const crHHMM = `${hh}${mm}`;

    if (crDate > cutoff) {
      return {
        text: crHHMM,
        status: 'cr-overdue', // RED
        cutoff,
        etdOrStd: stdDate,
        usedEtd: false,
      };
    }

    return {
      text: crHHMM,
      status: 'cr-ok', // GREY
      cutoff,
      etdOrStd: stdDate,
      usedEtd: false,
    };
  }

  private pickBaseForCR(header: FlightDetails): { baseDate: Date; usedEtd: boolean } | null {
    const firstLeg = header.flightLeg?.[0];
    const dts: any[] = Array.isArray(firstLeg?.dateTimes) ? firstLeg!.dateTimes : [];

    const depETD = dts.find(
      (d) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Estimated'
    )?.dateTimeLocal;
    const depSTD =
      dts.find((d) => d.dateTimeType === 'Departure' && d.dateTimeStatus === 'Scheduled')
        ?.dateTimeLocal ?? header?.datedFlightLeg?.scheduledDepartureDateLocal;

    if (this.CR_BASIS === 'ETD') {
      if (!depETD) return null;
      return { baseDate: this.parseLocal(depETD), usedEtd: true };
    }
    if (this.CR_BASIS === 'ETD_PREF_STD_FALLBACK') {
      if (depETD) return { baseDate: this.parseLocal(depETD), usedEtd: true };
      if (depSTD) return { baseDate: this.parseLocal(depSTD), usedEtd: false };
      return null;
    }

    if (depSTD) return { baseDate: this.parseLocal(depSTD), usedEtd: false };
    if (depETD) return { baseDate: this.parseLocal(depETD), usedEtd: true };
    return null;
  }

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

  private formatTimeWithShift(targetStr?: string, baseStr?: string): string {
    if (!targetStr) return '';
    const t = new Date(targetStr);
    const base = baseStr ? new Date(baseStr) : t;
    const offset = this.dayDiffLocal(base, t);
    const hhmm = this.formatTime(targetStr);
    return `${hhmm}${offset > 0 ? `+${offset}` : ''}`;
  }

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

  private parseLocal(localISO: string): Date {
    return new Date(localISO);
  }

  private minusMinutes(d: Date, minutes: number): Date {
    return new Date(d.getTime() - minutes * 60 * 1000);
  }

  private hhmm(d: Date): string {
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${hh}${mm}`;
  }
}
