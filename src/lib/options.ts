import type {
  CylinderBrand,
  CylinderCondition,
  CylinderLocation,
  CylinderSize,
  CylinderStatus,
  PaymentMethod,
  PaymentStatus,
  TransactionType,
  UserRole
} from "@/lib/types";

export const roles: UserRole[] = ["Admin", "Staff", "Driver"];
export const brands: CylinderBrand[] = ["Total", "K-Gas", "ProGas", "Hashi", "Afrigas", "Other"];
export const sizes: CylinderSize[] = ["3kg", "6kg", "13kg", "50kg"];
export const statuses: CylinderStatus[] = [
  "Full",
  "Empty",
  "In Store",
  "Sold",
  "Delivered",
  "Returned",
  "Refill Needed"
];
export const conditions: CylinderCondition[] = ["Good", "Damaged", "Leaking", "Needs Inspection"];
export const locations: CylinderLocation[] = ["Store", "Office", "Vehicle", "Client Site"];
export const transactionTypes: TransactionType[] = ["Sale", "Delivery", "Return", "Refill", "Stock Adjustment"];
export const paymentStatuses: PaymentStatus[] = ["Paid", "Partial", "Unpaid"];
export const paymentMethods: PaymentMethod[] = ["Cash", "M-Pesa", "Bank Transfer"];
