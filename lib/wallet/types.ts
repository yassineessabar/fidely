export type PassType = "discount" | "reward" | "stamp" | "cashback";

export type BarcodeFormat = "QR" | "PDF417";

export interface PassField {
  key: string;
  label: string;
  value: string | number;
}

export interface PassTemplate {
  type: PassType;
  merchantName: string;
  merchantId: string;
  logoText: string;
  description: string;
  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;
  headerFields: PassField[];
  primaryFields: PassField[];
  secondaryFields: PassField[];
  auxiliaryFields: PassField[];
  backFields: PassField[];
  barcodeFormat: BarcodeFormat;
  barcodeValue: string;
  stripImagePath: string;
  logoUrl?: string;
  heroImageUrl?: string;
  accentColor?: string;
  serialNumber?: string;
  authToken?: string;
  stampsCollected?: number;
  totalStamps?: number;
}

export interface GeneratePassOptions {
  template: PassTemplate;
  serialNumber?: string;
}
