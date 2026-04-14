export type AppRole = 'owner' | 'seller';
export type PaymentMethod = 'cash' | 'transfer' | 'mixed';
export type ConsignmentStatus = 'open' | 'partially_reconciled' | 'closed' | 'cancelled';
export type ReconciliationType = 'partial' | 'total';

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  phone: string | null;
  role: AppRole;
  is_active: boolean;
  must_reenroll_security: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name: string | null;
  contact_phone: string | null;
  is_active: boolean;
}

export interface Product {
  id: string;
  supplier_id: string | null;
  sku: string | null;
  name: string;
  description: string | null;
  default_sale_price: number;
  is_active: boolean;
}

export interface Consignment {
  id: string;
  seller_id: string;
  supplier_id: string | null;
  status: ConsignmentStatus;
  opened_at: string;
  notes: string | null;
}

export interface ConsignmentItem {
  id: string;
  consignment_id: string;
  product_id: string;
  quantity_assigned: number;
  unit_sale_price: number;
}

export interface Sale {
  id: string;
  consignment_id: string;
  seller_id: string;
  payment_method: PaymentMethod;
  sold_at: string;
  notes: string | null;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  consignment_item_id: string;
  quantity: number;
  unit_sale_price: number;
}

export interface Reconciliation {
  id: string;
  consignment_id: string;
  seller_id: string;
  type: ReconciliationType;
  cash_received: number;
  transfer_received: number;
  notes: string | null;
  created_at: string;
}

export interface ReconciliationItem {
  id: string;
  reconciliation_id: string;
  consignment_item_id: string;
  quantity_returned: number;
}

export interface LocationPing {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  note: string | null;
  created_at: string;
}

export interface InternalMessage {
  id: string;
  owner_id: string;
  seller_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
}
