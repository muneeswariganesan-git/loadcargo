import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MockService } from '../../../../utilities/mock/mock-service';
import { ProductService } from '../../../../shared/services/product-service';
import { FlightSearchPayload } from '../../../../shared/models/flight-payload';
import { DeadloadDialog } from '../../../../shared/components/footer/cargo-keypad-footer/deadload/deadload-dialog/deadload-dialog';
import { ViewOwnership } from '../../../../shared/components/footer/cargo-keypad-footer/view-ownership/view-ownership';
import { FlightList } from '../../../../shared/components/footer/cargo-keypad-footer/flight-list/flight-list';
import { getProductCode } from '../../../../shared/models/product-mapping';
import {
  buildCargoFlightHeaderRequest,
  buildHeaderPayload,
  buildPayload,
} from '../../../../shared/services/payload-factory';
import { FlightListService } from '../../../../shared/services/flight-list-service';
import { WelcomeHeader } from '../../../../shared/components/header/welcome-header/welcome-header';
import { FlightDetailsHeader } from '../../../../shared/components/header/flight-details-header/flight-details-header';
import { Footer } from '../../../../shared/components/footer/footer/footer';
import { CommonModule } from '@angular/common';
import { CargoFlightHeader } from '../../../../shared/services/cargo-flight-header';
import { FlightDetails } from '../../../../shared/models/cargo-flight-header-model';

@Component({
  selector: 'app-product-landing',
  imports: [WelcomeHeader, FlightDetailsHeader, Footer, CommonModule],
  templateUrl: './product-landing.html',
  styleUrl: './product-landing.css',
})
export class ProductLanding {
  product!: string;
  action: string = '';
  private readonly cargoFlightHeaderService = inject(CargoFlightHeader);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private mockService = inject(MockService);
  private searchPayloadService = inject(ProductService);
  router = inject(Router);
  private flightList = inject(FlightListService);
  headerType: 'welcome' | 'details' = 'welcome';
  flightHeader: any | null = null;
  capacityData: any[] = [];
  forecastData: any[] = [];
  comments: any[] = [];

  deadloadRows: any[] = [];
  deadloadTotalKg = 0;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.product = params.get('product')!;
      this.searchPayloadService.setProduct(this.product);
      console.log(this.product, 'current product selected');
    });
  }

  onAction(event: { product: string; action: string; payload?: FlightSearchPayload }) {
    this.product = event.product;
    this.action = event.action;

    if (event.action === 'F11') {
      this.router.navigate(['/']);
      return;
    }
    if (event.action === 'F1') {
      this.openViewOwnershipDialog();
      return;
    }
    if (event.action === 'F9') {
      this.openFlightListDialog();
      return;
    }

    if (event.action === 'CTRL_INIT' && event.payload) {
      const basePayload: any = { ...event.payload };
      basePayload.product = event.product;
      basePayload.productCode = getProductCode(event.product);

      this.searchPayloadService.set(basePayload);
      this.searchPayloadService.setFlightData(basePayload);
      this.searchPayloadService.setFlightSelectionState?.('completed');

      this.fetchFlightDetails(basePayload);
      return;
    }

    if (event.action === 'F5') {
      if (event.payload) {
        const basePayload: any = { ...event.payload };
        basePayload.product = event.product;
        basePayload.productCode = getProductCode(event.product);
        this.searchPayloadService.set(basePayload);
        this.fetchFlightDetails(basePayload);
      }
      this.openDeadloadDialog();
      return;
    }

    if (event.payload) {
      const basePayload: any = { ...event.payload };
      basePayload.product = event.product;
      basePayload.productCode = getProductCode(event.product);

      this.searchPayloadService.set(basePayload);
      this.searchPayloadService.setFlightData(basePayload);
      this.searchPayloadService.setFlightSelectionState?.('completed');

      this.fetchFlightDetails(basePayload);
      this.useCachedFlightDetails();
      return;
    }

    this.useCachedFlightDetails();
  }

  openDeadloadDialog() {
    const ref = this.dialog.open(DeadloadDialog, {
      width: '680px',
      disableClose: true,
      data: { product: this.product },
    });

    ref.afterClosed().subscribe((result?: { commodityCodes?: string[] }) => {
      if (!result) return;

      const flight = this.searchPayloadService.get(); // last selected flight payload
      const payload = this.buildDeadloadPayloadFromFlight(flight, result.commodityCodes);
      console.group(JSON.stringify(payload), 'deadload payload');
      this.fetchDeadloadSummary(payload);
    });
  }

  private fetchFlightDetails(basePayload: any) {
    const searchPayload = this.searchPayloadService.get();
    if (!searchPayload) return;

    const cargoFlightHeaderRequest = buildCargoFlightHeaderRequest(searchPayload);
    const viewInfoPayload: any = buildPayload('viewInfo', basePayload);

    console.log('Header Payload:', cargoFlightHeaderRequest);
    console.log('Summary Payload:', viewInfoPayload);

    this.cargoFlightHeaderService
      .getFlightHeader(cargoFlightHeaderRequest)
      .subscribe((headerRes: FlightDetails) => {
        const raw = headerRes ?? null;

        if (!raw) {
          console.warn('No header data found in mock response');
          return;
        }

        const normalized = { ...raw };

        const reg = (normalized.aircraftRegistrationCode ?? '').trim();
        const service = (normalized.iataServiceType ?? '').trim().toUpperCase();

        if (!reg) {
          if (service === 'F') {
            normalized.aircraftRegistrationCode = 'Freighters';
          } else if (service === 'V') {
            normalized.aircraftRegistrationCode = 'Truck';
          }
        }

        this.flightHeader = normalized;

        this.searchPayloadService.setFlightData(normalized);

        this.searchPayloadService.setHeader('details');
        this.headerType = 'details';

        console.log('Normalized Header (mock):', {
          AircraftRegistrationCode: normalized.aircraftRegistrationCode,
          IATAServiceType: normalized.iataServiceType,
        });
      });

    this.mockService.getFlightSummary(viewInfoPayload).subscribe((summaryRes) => {
      const details = summaryRes?.ViewFlightSummaryResponse?.CargoFlightSummaryDetails ?? {};

      this.capacityData = details?.CapacityBreakdown?.Commodities ?? [];
      this.forecastData = (details?.LoadItems ?? []).map(
        (item: { Deadload?: { CommodityCode?: string } }) => ({
          ...item,
          Com: item?.Deadload?.CommodityCode ?? '',
        })
      );
      this.comments = details?.Comments ?? [];

      this.searchPayloadService.setCapacityData(this.capacityData);
      this.searchPayloadService.setForecastData(this.forecastData);
      this.searchPayloadService.setComments(this.comments);
    });
  }

  private useCachedFlightDetails() {
    this.flightHeader = this.searchPayloadService.getFlightData();
    this.capacityData = this.searchPayloadService.getCapacityData() ?? [];
    this.forecastData = this.searchPayloadService.getForecastData() ?? [];
    this.comments = this.searchPayloadService.getComments() ?? [];
    this.headerType = this.searchPayloadService.getHeader() ?? this.headerType;

    this.deadloadRows = (this.searchPayloadService as any).getDeadloadRows?.() ?? this.deadloadRows;
    this.deadloadTotalKg =
      (this.searchPayloadService as any).getDeadloadTotalKg?.() ?? this.deadloadTotalKg;
  }

  private buildDeadloadPayloadFromFlight(flight: any, commodityCodes?: string[]) {
    const carrier = flight?.flightNumbers?.[0] ?? 'BA';
    const number = flight?.flightNumbers?.[1] ?? '3386';
    const origin = flight?.departureStation ?? 'LHR';
    const localISO =
      typeof flight?.flightDate === 'string' && flight.flightDate.includes('T')
        ? flight.flightDate
        : `${flight?.flightDate ?? '2025-12-13'}T00:00:00`;

    const req: any = {
      ViewFlightSummaryRequest: {
        DatedFlightLeg: {
          OperationalFlightNumber: String(number),
          OperatingCarrierCode: carrier,
          OriginStation: origin,
          ScheduledDepartureDateLocal: localISO,
        },
        FMLoadIndicator: true,
      },
    };

    if (commodityCodes?.length) {
      req.ViewFlightSummaryRequest.CommodityCode = commodityCodes;
    }
    return req;
  }

  private bindDeadloadResponse(summaryRes: any) {
    const details = summaryRes?.ViewFlightSummaryResponse?.CargoFlightSummaryDetails ?? {};

    this.useCachedFlightDetails();

    this.deadloadRows = this.toDeadloadRows(details);
    this.deadloadTotalKg = this.sumCargoNetKg(details);

    (this.searchPayloadService as any).setDeadloadRows?.(this.deadloadRows);
    (this.searchPayloadService as any).setDeadloadTotalKg?.(this.deadloadTotalKg);
  }

  private toDeadloadRows(details: any): any[] {
    const items = Array.isArray(details?.LoadItems) ? details.LoadItems : [];

    return items.map((it: any) => {
      const isULD = (it.LoadType ?? '').toUpperCase() === 'ULD';
      const dl = it.Deadload ?? {};
      const unitType = it.UnitType ?? '';
      const sn = it.SerialNumber ?? '';
      const owner = it.OwnerCode ?? '';

      const uldOrBlk = isULD ? `${unitType}${sn}${owner}` : 'BLK';

      const net = Number(dl.NetWeight ?? 0);
      const gross = isULD ? Number(it.GrossWeight ?? net) : net;
      const tare = isULD ? Number(it.TareWeight ?? 0) : 0;

      return {
        ind: it.AnomalyIndicator ? 'warning' : '',
        uldOrBlk,
        dest: it.OffpointStation ?? '',
        gross,
        tare,
        net,
        est: (dl.EstimatedIndicator ?? '').toUpperCase(),
        com: dl.CommodityCode ?? '',
        pos: 0,
        dgsl: Number(dl.DGSLCount ?? 0),
        priority: Number(it.Priority ?? 0),
        fm: !!it.SentToFMIndicator,
        loadPlanInfo: null,
      };
    });
  }

  private sumCargoNetKg(details: any): number {
    const items = Array.isArray(details?.LoadItems) ? details.LoadItems : [];
    return items
      .filter((it: any) => (it?.Deadload?.CommodityCode ?? '') === 'C')
      .reduce((sum: number, it: any) => sum + Number(it?.Deadload?.NetWeight ?? 0), 0);
  }

  private fetchDeadloadSummary(viewInfoPayload: any) {
    this.mockService.getDeadloadSummary(viewInfoPayload).subscribe((summaryRes) => {
      this.bindDeadloadResponse(summaryRes);
    });
  }

  getFlightList() {}
  openViewOwnershipDialog() {
    this.dialog.open(ViewOwnership, {
      width: '600px',
      disableClose: true,
      data: { product: this.product },
    });
  }

  openFlightListDialog(): void {
    const ref = this.dialog.open(FlightList, {
      width: '1618px',

      maxWidth: 'none',

      disableClose: true,
      autoFocus: false,
      data: { product: this.product },
    });

    ref.afterClosed().subscribe((payload?: FlightSearchPayload) => {
      if (payload) {
        console.log(JSON.stringify(payload), 'payload');

        this.searchPayloadService.set(payload);

        this.searchPayloadService.setFlightSelectionState('completed');

        this.onAction({ product: this.product, action: 'F3', payload });
      }
    });
  }

  getDisplayProductName(product: string): string {
    if (product === 'usa-and-canada') return 'USA & Canada';
    return product.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
