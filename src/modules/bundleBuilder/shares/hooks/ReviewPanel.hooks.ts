import { useMemo, useState } from 'react';
import {
  useBundleBuilderStore,
  computeReviewLineItems,
  computeTotals,
} from '../store/bundleBuilder.store';
import type { ReviewLineItem } from '../models/bundleBuilder.models';

function useReviewPanel() {
  const catalog = useBundleBuilderStore((state) => state.catalog);
  const quantities = useBundleBuilderStore((state) => state.quantities);
  const setQuantity = useBundleBuilderStore((state) => state.setQuantity);
  const saveForLater = useBundleBuilderStore((state) => state.saveForLater);
  const [toast, setToast] = useState<string | null>(null);

  const lineItems = useMemo(
    () => computeReviewLineItems(catalog, quantities),
    [catalog, quantities],
  );
  const totals = useMemo(() => computeTotals(catalog, lineItems), [catalog, lineItems]);

  const grouped = useMemo(() => {
    const map = new Map<string, ReviewLineItem[]>();
    for (const item of lineItems) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return map;
  }, [lineItems]);

  const handleCheckout = () => {
    setToast('Checkout is done successfully');
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleSaveForLater = () => {
    saveForLater();
    setToast('Saved successfully for later');
    window.setTimeout(() => setToast(null), 3000);
  };

  return {
    catalog,
    grouped,
    totals,
    toast,
    setQuantity,
    handleCheckout,
    handleSaveForLater,
  };
}

export { useReviewPanel };
