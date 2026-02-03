import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CTRL_ACTION_MAP,
  PRODUCT_ACTION_MAP,
  PRODUCT_ACTION_MAP_VARIANT,
} from '../../../../core/config/action-keypad';
import { SearchFlightDialog } from '../cargo-keypad-footer/select-flight/search-flight-dialog/search-flight-dialog';
import { FlightDocuments } from '../cargo-extended-keypad-footer/flight-documents/flight-documents';
import { SendMessage } from '../cargo-extended-keypad-footer/send-message/send-message';
import { PaxSummary } from '../cargo-extended-keypad-footer/pax-summary/pax-summary';
import { CreateOwnership } from '../cargo-extended-keypad-footer/create-ownership/create-ownership';
import { AirWaybills } from '../cargo-extended-keypad-footer/air-waybills/air-waybills';
import { Contacts } from '../cargo-extended-keypad-footer/contacts/contacts';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  @Input() displayName!: string;
  @Input() product!: string;

  @Output() actionTriggered = new EventEmitter<{
    product: string;
    action: string;
    payload?: any;
  }>();

  router = inject(Router);
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);

  private destroyRef = inject(DestroyRef);

  actions: { key: string; label: string }[] = [];
  isCtrlActive = false;
  private isDialogOpening = false;

  private readonly ACTIONS_PRODUCT_ALWAYS_SKIP = new Set<string>(['F1', 'F9']);

  ngOnInit() {
    this.productService.product$
      .pipe(
        filter((p): p is string => !!p && p.trim().length > 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((p) => {
        this.product = p;
        this.updateActions();
      });

    this.productService.flightData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateActions();
    });

    this.dialog.afterAllClosed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.isCtrlActive = false;
      this.isDialogOpening = false;
      if (this.product && this.product.trim().length > 0) {
        this.updateActions();
      }
    });
  }

  ngOnChanges() {
    if (this.product && this.product.trim().length > 0) {
      this.updateActions();
    }
  }

  private getCurrentProduct(): string {
    return this.productService.getCurrentProduct() ?? this.product;
  }

  private requiresFlightSelection(actionKey: string, isCtrlMode: boolean): boolean {
    if (isCtrlMode) {
      if (actionKey === 'F2') return false;
      return true;
    } else {
      if (this.ACTIONS_PRODUCT_ALWAYS_SKIP.has(actionKey)) return false;
      if (actionKey === 'F2') return true;
      return true;
    }
  }

  private getRegVariant(): 'Truck' | 'Freighters' | null {
    const header = this.productService.getFlightData();
   // const regRaw = header?.AircraftRegistrationCode;
   const regRaw ='IATA';
    if (regRaw && regRaw.trim().length > 0) {
      const reg = regRaw.toLowerCase();
      if (reg.includes('truck')) return 'Truck';
      if (reg.includes('freighter') || reg.includes('freight')) return 'Freighters';
      return null;
    }

   // const service = (header?.IATAServiceType ?? '').toUpperCase();
   const service = 'F';
    if (service === 'F') return 'Freighters';
    if (service === 'V') return 'Truck';
    return null;
  }

  mapProductKey(product: string): string {
    const normalized = product.trim().toLowerCase();
    switch (normalized) {
      case 'usa-and-canada':
        return 'UsaCanada';
      case 'courier':
        return 'Courier';
      case 'prioritise':
        return 'Prioritise';
      case 'mail':
        return 'Mail';
      case 'uld-logistics':
        return 'UldLogistics';
      default:
        return 'General';
    }
  }

  updateActions() {
    if (this.isCtrlActive) {
      this.actions = CTRL_ACTION_MAP;
      return;
    }
    if (!this.product || this.product.trim() === '') {
      this.actions = [];
      return;
    }

    const baseKey = this.mapProductKey(this.product);
    const variant = this.getRegVariant();
    const supportsVariant = baseKey === 'UsaCanada' || baseKey === 'General';

    if (supportsVariant && variant) {
      const variantKey = `${baseKey}_${variant}`;
      this.actions = PRODUCT_ACTION_MAP_VARIANT[variantKey] ?? PRODUCT_ACTION_MAP[baseKey] ?? [];
    } else {
      this.actions = PRODUCT_ACTION_MAP[baseKey] ?? [];
    }
  }

  handleAction(actionKey: string) {
    if (this.dialog.openDialogs.length > 0 || this.isDialogOpening) return;

    const product = this.getCurrentProduct();
    const state = this.productService.getFlightSelectionState();

    if (actionKey === 'F11') {
      this.router.navigate(['/']);
      return;
    }

    if (this.isCtrlActive) {
      const selectionRequired = this.requiresFlightSelection(actionKey, true);
      if (!selectionRequired) {
        this.openCtrlDialog(actionKey, product);
      } else {
        if (state === 'completed') {
          this.openCtrlDialog(actionKey, product);
        } else {
          this.openSelectFlightDialogThenCtrl(actionKey, product);
        }
      }
      return;
    }

    if (actionKey === 'F1' || actionKey === 'F9') {
      this.actionTriggered.emit({ product, action: actionKey });
      return;
    }

    if (actionKey === 'F2') {
      this.openSelectFlightDialogThen((payload) => {
        if (payload) {
          this.productService.set(payload);
          this.productService.setFlightSelectionState('completed');

          this.actionTriggered.emit({ product, action: actionKey, payload });
        }
      }, product);
      return;
    }

    const selectionRequired = this.requiresFlightSelection(actionKey, false);
    if (selectionRequired && state !== 'completed') {
      this.openSelectFlightDialogThen((payload) => {
        this.productService.set(payload);
        this.productService.setFlightSelectionState('completed');
        this.actionTriggered.emit({ product, action: actionKey, payload });
      }, product);
    } else {
      this.actionTriggered.emit({ product, action: actionKey });
    }
  }

  private openSelectFlightDialogThen(onSelected: (payload: any) => void, product: string) {
    if (this.dialog.openDialogs.length > 0 || this.isDialogOpening) return;
    this.isDialogOpening = true;

    const previousState = this.productService.getFlightSelectionState();
    this.productService.setFlightSelectionState('open');

    const dialogRef = this.dialog.open(SearchFlightDialog, {
      panelClass: 'classic-dialog-panel', // 👈 add this
      width: '600px',
      height: 'auto',

      data: { product },
      disableClose: false,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((payload) => {
      this.isDialogOpening = false;

      if (payload) {
        onSelected(payload);
      } else {
        if (previousState !== 'completed') {
          this.productService.setFlightSelectionState('none');
        } else {
          this.productService.setFlightSelectionState('completed');
        }
      }
    });
  }

  private openSelectFlightDialogThenCtrl(actionKey: string, product: string) {
    if (this.dialog.openDialogs.length > 0 || this.isDialogOpening) return;
    this.isDialogOpening = true;

    const previousState = this.productService.getFlightSelectionState();
    this.productService.setFlightSelectionState('open');

    const dialogRef = this.dialog.open(SearchFlightDialog, {
      width: '600px',
      data: { product },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((payload) => {
      this.isDialogOpening = false;

      if (payload) {
        this.productService.setFlightSelectionState('completed');

        if (previousState !== 'completed') {
          this.actionTriggered.emit({ product, action: 'CTRL_INIT', payload });
        }

        this.openCtrlDialog(actionKey, product);
      } else {
        if (previousState !== 'completed') {
          this.productService.setFlightSelectionState('none');
        } else {
          this.productService.setFlightSelectionState('completed');
        }
      }
    });
  }
  private openCtrlDialog(actionKey: string, product: string) {
    this.isCtrlActive = true;
    this.updateActions();

    let component: any;
    switch (actionKey) {
      case 'F1':
        component = FlightDocuments;
        break;
      case 'F2':
        component = SendMessage;
        break;
      case 'F3':
        component = PaxSummary;
        break;
      case 'F4':
        component = AirWaybills;
        break;
      case 'F5':
        component = Contacts;
        break;
      case 'F7':
        component = CreateOwnership;
        break;
      case 'F8':
        component = Contacts;
        break;
      case 'F11':
        component = Contacts;
        break;
      default:
        return;
    }

    this.dialog.open(component, {
      width: '600px',
      disableClose: true,
      data: { product },
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!event.key) return;
    if (event.key === 'Control') {
      this.isCtrlActive = true;
      this.updateActions();
    } else if (event.key.startsWith('F')) {
      event.preventDefault();
      this.handleAction(event.key);
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Control') {
      if (this.dialog.openDialogs.length > 0) return;
      this.isCtrlActive = false;
      this.updateActions();
    }
  }
}
