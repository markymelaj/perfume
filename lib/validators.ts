import { z } from 'zod';

export const inviteUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2),
  phone: z.string().optional().nullable(),
  password: z.string().min(8, 'La contraseña temporal debe tener al menos 8 caracteres.')
});

export const supplierSchema = z.object({
  name: z.string().min(2),
  contact_name: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
});

export const productSchema = z.object({
  supplier_id: z.string().uuid().optional().nullable(),
  sku: z.string().optional().nullable(),
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  default_sale_price: z.coerce.number().min(0)
});

export const consignmentSchema = z.object({
  seller_id: z.string().uuid(),
  supplier_id: z.string().uuid().optional().nullable(),
  product_id: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
  unit_sale_price: z.coerce.number().min(0),
  notes: z.string().optional().nullable()
});

export const saleSchema = z.object({
  consignment_item_id: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
  payment_method: z.enum(['cash', 'transfer', 'mixed']),
  notes: z.string().optional().nullable()
});

export const reconciliationSchema = z.object({
  consignment_id: z.string().uuid(),
  type: z.enum(['partial', 'total']),
  cash_received: z.coerce.number().min(0),
  transfer_received: z.coerce.number().min(0),
  notes: z.string().optional().nullable(),
  returns: z.array(
    z.object({
      consignment_item_id: z.string().uuid(),
      quantity_returned: z.coerce.number().int().min(0)
    })
  ).optional().default([])
});

export const locationSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  note: z.string().optional().nullable()
});

export const messageSchema = z.object({
  seller_id: z.string().uuid().optional(),
  body: z.string().trim().min(1)
});

export const resetAccessSchema = z.object({
  userId: z.string().uuid(),
  password: z.string().min(8, 'La nueva contraseña temporal debe tener al menos 8 caracteres.')
});

export const toggleUserStatusSchema = z.object({
  userId: z.string().uuid(),
  isActive: z.boolean()
});
