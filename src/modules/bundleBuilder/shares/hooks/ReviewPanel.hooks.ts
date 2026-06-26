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
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

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
    window.alert('This is a placeholder checkout. No order was actually placed.');
  };

  const handleSaveForLater = () => {
    saveForLater();
    setSavedMessage('Your system has been saved!');
    window.setTimeout(() => setSavedMessage(null), 3000);
  };

  return {
    catalog,
    grouped,
    totals,
    savedMessage,
    setQuantity,
    handleCheckout,
    handleSaveForLater,
  };
}

export { useReviewPanel };
