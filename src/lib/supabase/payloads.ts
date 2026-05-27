import type { Customer, Cylinder, Transaction } from "@/lib/types";

function compact<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

export function cylinderPayload(cylinder: Partial<Cylinder>) {
  return compact({
    cylinder_id: cylinder.cylinderId,
    serial_number: cylinder.serialNumber,
    brand: cylinder.brand,
    size: cylinder.size,
    status: cylinder.status,
    condition: cylinder.condition,
    location: cylinder.location,
    buying_price: cylinder.buyingPrice,
    selling_price: cylinder.sellingPrice,
    date_added: cylinder.dateAdded,
    main_image_url: cylinder.mainImageUrl || null,
    damage_image_url: cylinder.damageImageUrl || null,
    delivery_proof_url: cylinder.deliveryProofUrl || null,
    receipt_url: cylinder.receiptUrl || null,
    notes: cylinder.notes === undefined ? undefined : cylinder.notes || null
  });
}

export function customerPayload(customer: Partial<Customer>) {
  return compact({
    full_name: customer.fullName,
    phone: customer.phone,
    email: customer.email || null,
    location: customer.location,
    delivery_address: customer.deliveryAddress,
    notes: customer.notes === undefined ? undefined : customer.notes || null
  });
}

export function transactionPayload(transaction: Partial<Transaction>) {
  return compact({
    type: transaction.type,
    cylinder_id: transaction.cylinderId,
    customer_id: transaction.customerId || null,
    quantity: transaction.quantity,
    amount_paid: transaction.amountPaid,
    payment_status: transaction.paymentStatus,
    payment_method: transaction.paymentMethod,
    delivery_location: transaction.deliveryLocation || null,
    driver_name: transaction.driverName || null,
    delivery_proof_url: transaction.deliveryProofUrl || null,
    receipt_url: transaction.receiptUrl || null,
    transaction_date: transaction.date,
    notes: transaction.notes === undefined ? undefined : transaction.notes || null
  });
}
