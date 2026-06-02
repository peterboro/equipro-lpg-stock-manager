export type UserRole = "Admin" | "Staff" | "Driver";
export type CylinderBrand = "Total" | "K-Gas" | "ProGas" | "Hashi" | "Afrigas" | "Other";
export type CylinderSize = "3kg" | "6kg" | "13kg" | "50kg";
export type CylinderStatus =
  | "Full"
  | "Empty"
  | "In Store"
  | "Sold"
  | "Delivered"
  | "Returned"
  | "Refill Needed";
export type CylinderCondition = "Good" | "Damaged" | "Leaking" | "Needs Inspection";
export type CylinderLocation = "Store" | "Office" | "Vehicle" | "Client Site";
export type TransactionType = "Sale" | "Delivery" | "Return" | "Refill" | "Stock Adjustment";
export type PaymentStatus = "Paid" | "Partial" | "Unpaid";
export type PaymentMethod = "Cash" | "M-Pesa" | "Bank Transfer";

export type Cylinder = {
  id: string;
  cylinderId: string;
  serialNumber: string;
  brand: CylinderBrand;
  size: CylinderSize;
  status: CylinderStatus;
  condition: CylinderCondition;
  location: CylinderLocation;
  buyingPrice: number;
  sellingPrice: number;
  dateAdded: string;
  lastUpdated: string;
  notes?: string;
  mainImageUrl?: string;
  damageImageUrl?: string;
  deliveryProofUrl?: string;
  receiptUrl?: string;
};

export type Customer = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  location: string;
  deliveryAddress: string;
  notes?: string;
};

export type Transaction = {
  id: string;
  type: TransactionType;
  cylinderId: string;
  customerId?: string;
  quantity: number;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryLocation?: string;
  driverName?: string;
  deliveryProofUrl?: string;
  receiptUrl?: string;
  date: string;
  notes?: string;
};

export type StockTakingItem = {
  id: string;
  sourceBrand: string;
  brand: CylinderBrand;
  size: CylinderSize;
  status: "Full" | "Empty";
  quantity: number;
  condition: CylinderCondition;
  notes?: string;
};

export type StockTakingSession = {
  id: string;
  takenOn: string;
  frequency: "Daily" | "Weekly";
  source?: string;
  notes?: string;
  items: StockTakingItem[];
};

export type DashboardStats = {
  total: number;
  full: number;
  empty: number;
  sold: number;
  delivered: number;
  returned: number;
  damaged: number;
};
