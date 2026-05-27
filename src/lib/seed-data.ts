import type { Customer, Cylinder, Transaction } from "@/lib/types";

export const seedCylinders: Cylinder[] = [
  {
    id: "cyl-001",
    cylinderId: "EQP-13-001",
    serialNumber: "TOT-1326-001",
    brand: "Total",
    size: "13kg",
    status: "Full",
    condition: "Good",
    location: "Store",
    buyingPrice: 6500,
    sellingPrice: 9800,
    dateAdded: "2026-05-01",
    lastUpdated: "2026-05-25",
    notes: "Fast moving family-size cylinder."
  },
  {
    id: "cyl-002",
    cylinderId: "EQP-06-014",
    serialNumber: "KG-0626-014",
    brand: "K-Gas",
    size: "6kg",
    status: "Delivered",
    condition: "Good",
    location: "Client Site",
    buyingPrice: 3300,
    sellingPrice: 5200,
    dateAdded: "2026-05-03",
    lastUpdated: "2026-05-26",
    notes: "Delivered to Westlands customer."
  },
  {
    id: "cyl-003",
    cylinderId: "EQP-50-003",
    serialNumber: "PG-5026-003",
    brand: "ProGas",
    size: "50kg",
    status: "Refill Needed",
    condition: "Needs Inspection",
    location: "Store",
    buyingPrice: 22000,
    sellingPrice: 31500,
    dateAdded: "2026-04-22",
    lastUpdated: "2026-05-24",
    notes: "Returned empty after restaurant delivery."
  },
  {
    id: "cyl-004",
    cylinderId: "EQP-03-020",
    serialNumber: "HASH-0326-020",
    brand: "Hashi",
    size: "3kg",
    status: "Sold",
    condition: "Good",
    location: "Office",
    buyingPrice: 1800,
    sellingPrice: 2800,
    dateAdded: "2026-05-06",
    lastUpdated: "2026-05-21",
    notes: "Counter sale."
  },
  {
    id: "cyl-005",
    cylinderId: "EQP-13-008",
    serialNumber: "AFR-1326-008",
    brand: "Afrigas",
    size: "13kg",
    status: "Returned",
    condition: "Damaged",
    location: "Vehicle",
    buyingPrice: 6100,
    sellingPrice: 9300,
    dateAdded: "2026-04-29",
    lastUpdated: "2026-05-27",
    notes: "Valve guard dented; needs assessment."
  }
];

export const seedCustomers: Customer[] = [
  {
    id: "cust-001",
    fullName: "Grace Wanjiku",
    phone: "+254712345678",
    email: "grace@example.com",
    location: "Kilimani",
    deliveryAddress: "Argwings Kodhek Road, Kilimani",
    notes: "Prefers M-Pesa payments."
  },
  {
    id: "cust-002",
    fullName: "Kamau Restaurant Supplies",
    phone: "+254733887766",
    email: "orders@kamaufoods.co.ke",
    location: "Westlands",
    deliveryAddress: "Mpaka Road, Westlands",
    notes: "Weekly 50kg refill account."
  },
  {
    id: "cust-003",
    fullName: "Amina Hassan",
    phone: "+254701112233",
    location: "South C",
    deliveryAddress: "Muhoho Avenue, South C",
    notes: "Call before dispatch."
  }
];

export const seedTransactions: Transaction[] = [
  {
    id: "txn-001",
    type: "Sale",
    cylinderId: "cyl-004",
    customerId: "cust-003",
    quantity: 1,
    amountPaid: 2800,
    paymentStatus: "Paid",
    paymentMethod: "M-Pesa",
    date: "2026-05-21",
    notes: "Sold 3kg Hashi cylinder."
  },
  {
    id: "txn-002",
    type: "Delivery",
    cylinderId: "cyl-002",
    customerId: "cust-001",
    quantity: 1,
    amountPaid: 5200,
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    deliveryLocation: "Kilimani",
    driverName: "Peter Mwangi",
    date: "2026-05-26",
    notes: "Delivered and signed by client."
  },
  {
    id: "txn-003",
    type: "Return",
    cylinderId: "cyl-005",
    customerId: "cust-002",
    quantity: 1,
    amountPaid: 0,
    paymentStatus: "Unpaid",
    paymentMethod: "Bank Transfer",
    deliveryLocation: "Westlands",
    driverName: "Brian Otieno",
    date: "2026-05-27",
    notes: "Returned damaged cylinder."
  }
];
