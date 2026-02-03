export interface FlightSearchPayload {
  flightNumbers?: string[];
  flightDate?: string;
  departureStation?: string;
  product?: string;
  productCode?: string;
}

export interface CargoFlightHeaderResponse {
  status: string;
  code: number;
  message: string;
  data: FlightDetails;
}

export interface FlightDetails {
  datedFlightLeg: DatedFlightLeg;
  aircraftRegistrationCode: string;
  airfliteAircraftSubtype: string;
  fmAircraftSubType: string;
  standNumber: string;
  flightLeg: FlightLeg[];
  saleableConfiguration: SaleableConfiguration;
  flightStatus: FlightStatus;
  currentFlightFitment: Fitment;
  ngrmFitment: Fitment;
  passengerSummary: PassengerSummary[];
  product: ProductDetails;
  iataServiceType: string;
}

export interface DatedFlightLeg {
  operatorCarrierCode: string;
  operationalFlightNumber: string;
  operationalFlightNumberSuffix: string;
  originStation: string;
  destinationStation: string;
  scheduledDepartureDateLocal: string;
  dateTimes: DateTimeInfo[];
}

export interface DateTimeInfo {
  dateTimeLocal: string;
  dateTimeGMT: string;
  dateTimeStatus: string;
  dateTimeType: string;
}

export interface FlightLeg {
  flightLegOrigin: string;
  flightLegDestination: string;
  dateTimes: DateTimeInfo[];
  cancelledLeg: boolean;
}

export interface SaleableConfiguration {
  cabinFigures: CabinFigure[];
}

export interface CabinFigure {
  cabinCode: string;
  count: number;
}

export interface FlightStatus {
  generalStatusCode: string;
  loadControlStatusCode: string;
  loadReleaseStatus: string;
  scheduleStatus: string;
}

export interface Fitment {
  palletCount: number;
  containerCount: number;
}

export interface PassengerSummary {
  origin?: string;
  destination?: string;
  cabinStatusCount?: CabinStatus[];
}

export interface CabinStatus {
  cabinCode: string;
  bookedCount: number;
  acceptedCount: number;
}

export interface ProductDetails {
  ownerName: string;
  ownerId: string;
  plannedLoadReleaseTime: string;
  plannedBuildCloseTime: string;
  plannedManifestTime: string;
  productCode: string;
}

export interface FlightHeaderViewModel {
  origin: string;
  destination: string;
  flight: string;
  date: string;
  fitment: string;
  reg: string;
  stand: string;
  subType: string;
  std: string;
  sta: string;
  generalStatus: string;
  loadControlStatus: string;
  optima: string;
  buildClose: string;
  cargoRelease: string;
  manifest: string;
  owner: string;
  notes: string;
}

export interface CargoFlightHeaderRequest {
  carrier: string;
  flightNo: string;
  origin: string;
  productCode: string;
  depDateTime: string;

  destination?: string;
  flightNoSfx?: string;
  iataServiceType?: string;
}
