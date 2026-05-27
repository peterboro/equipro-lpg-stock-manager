import type { Customer, Cylinder, Transaction } from "@/lib/types";

export function mapCylinder(row: Record<string, unknown>): Cylinder {
  return {
    id: String(row.id),
    cylinderId: String(row.cylinder_id),
    serialNumber: String(row.serial_number),
    brand: row.brand as Cylinder["brand"],
    size: row.size as Cylinder["size"],
    status: row.status as Cylinder["status"],
    condition: row.condition as Cylinder["condition"],
    location: row.location as Cylinder["location"],
    buyingPrice: Number(row.buying_price),
    sellingPrice: Number(row.selling_price),
    dateAdded: String(row.date_added),
    lastUpdated: String(row.updated_at),
    notes: row.notes ? String(row.notes) : undefined,
    mainImageUrl: row.main_image_url ? String(row.main_image_url) : undefined,
    damageImageUrl: row.damage_image_url ? String(row.damage_image_url) : undefined,
    deliveryProofUrl: row.delivery_proof_url ? String(row.delivery_proof_url) : undefined,
    receiptUrl: row.receipt_url ? String(row.receipt_url) : undefined
  };
}

export function mapCustomer(row: Record<string, unknown>): Customer {
  return {
    id: String(row.id),
    fullName: String(row.full_name),
    phone: String(row.phone),
    email: row.email ? String(row.email) : undefined,
    location: String(row.location),
    deliveryAddress: String(row.delivery_address),
    notes: row.notes ? String(row.notes) : undefined
  };
}

export function mapTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: String(row.id),
    type: row.type as Transaction["type"],
    cylinderId: String(row.cylinder_id),
    customerId: row.customer_id ? String(row.customer_id) : undefined,
    quantity: Number(row.quantity),
    amountPaid: Number(row.amount_paid),
    paymentStatus: row.payment_status as Transaction["paymentStatus"],
    paymentMethod: row.payment_method as Transaction["paymentMethod"],
    deliveryLocation: row.delivery_location ? String(row.delivery_location) : undefined,
    driverName: row.driver_name ? String(row.driver_name) : undefined,
    deliveryProofUrl: row.delivery_proof_url ? String(row.delivery_proof_url) : undefined,
    receiptUrl: row.receipt_url ? String(row.receipt_url) : undefined,
    date: String(row.transaction_date),
    notes: row.notes ? String(row.notes) : undefined
  };
}
