import { useMemo } from 'react';
import {
  useBundleBuilderStore,
  computeReviewLineItems,
  computeTotals,
} from '../store/bundleBuilder.store';

function useBundleBuilderCatalog() {
  return useBundleBuilderStore((state) => state.catalog);
}

function useBundleBuilderReviewLineItems() {
  const catalog = useBundleBuilderStore((state) => state.catalog);
  const quantities = useBundleBuilderStore((state) => state.quantities);
  return useMemo(() => computeReviewLineItems(catalog, quantities), [catalog, quantities]);
}

function useBundleBuilderTotals() {
  const catalog = useBundleBuilderStore((state) => state.catalog);
  const lineItems = useBundleBuilderReviewLineItems();
  return useMemo(() => computeTotals(catalog, lineItems), [catalog, lineItems]);
}

function useBundleBuilderOpenStep() {
  const openStepId = useBundleBuilderStore((state) => state.openStepId);
  const setOpenStepId = useBundleBuilderStore((state) => state.setOpenStepId);
  return { openStepId, setOpenStepId };
}

export {
  useBundleBuilderCatalog,
  useBundleBuilderTotals,
  useBundleBuilderReviewLineItems,
  useBundleBuilderOpenStep,
};
