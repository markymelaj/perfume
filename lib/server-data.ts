import type { ConsignmentItem, Sale, SaleItem, Reconciliation, ReconciliationItem } from '@/lib/types';
import { sumNumbers } from '@/lib/utils';

export function buildRemainingMap({
  consignmentItems,
  salesItems,
  reconciliationItems
}: {
  consignmentItems: ConsignmentItem[];
  salesItems: SaleItem[];
  reconciliationItems: ReconciliationItem[];
}) {
  const soldMap = new Map<string, number>();
  const returnedMap = new Map<string, number>();

  for (const item of salesItems) {
    soldMap.set(item.consignment_item_id, (soldMap.get(item.consignment_item_id) ?? 0) + item.quantity);
  }

  for (const item of reconciliationItems) {
    returnedMap.set(
      item.consignment_item_id,
      (returnedMap.get(item.consignment_item_id) ?? 0) + item.quantity_returned
    );
  }

  return new Map(
    consignmentItems.map((item) => [
      item.id,
      item.quantity_assigned - (soldMap.get(item.id) ?? 0) - (returnedMap.get(item.id) ?? 0)
    ])
  );
}

export function buildCashSummary({
  sales,
  salesItems,
  reconciliations
}: {
  sales: Sale[];
  salesItems: SaleItem[];
  reconciliations: Reconciliation[];
}) {
  const saleTotals = new Map<string, number>();
  for (const item of salesItems) {
    saleTotals.set(item.sale_id, (saleTotals.get(item.sale_id) ?? 0) + item.quantity * item.unit_sale_price);
  }

  const totalSold = sumNumbers(sales.map((sale) => saleTotals.get(sale.id) ?? 0));
  const totalRendido = sumNumbers(
    reconciliations.map((item) => Number(item.cash_received) + Number(item.transfer_received))
  );

  return {
    totalSold,
    totalRendido,
    pendiente: totalSold - totalRendido
  };
}
