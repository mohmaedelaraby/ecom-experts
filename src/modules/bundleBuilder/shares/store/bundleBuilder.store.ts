import { create } from 'zustand';
import {
  fetchCatalogAndDeriveInitialState,
  buildQuantityKey,
  BundleBuilderServiceError,
} from '../services/bundleBuilder.service';
import { NO_VARIANT_KEY } from '../models/bundleBuilder.models';
import { REVIEW_CONTENT } from '../utils/bundleBuilder.utils';
import type {
  BundleBuilderStore,
  BundleTotals,
  CatalogResponse,
  PersistedBundleState,
  Product,
  QuantityMap,
  ReviewLineItem,
} from '../models/bundleBuilder.models';

const STORAGE_KEY = import.meta.env.VITE_BUNDLE_BUILDER_STORAGE_KEY;

function loadPersistedState(): PersistedBundleState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedBundleState;
  } catch {
    return null;
  }
}

function persistState(state: PersistedBundleState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('Failed to persist bundle builder state to localStorage');
  }
}

function findProduct(
  catalog: BundleBuilderStore['catalog'],
  productId: string,
): { product: Product; stepId: string; category: string } | null {
  if (!catalog) return null;
  for (const step of catalog.steps) {
    const product = step.products.find((p) => p.id === productId);
    if (product) {
      return { product, stepId: step.id, category: step.category };
    }
  }
  return null;
}


function computeReviewLineItems(
  catalog: CatalogResponse | null,
  quantities: QuantityMap,
): ReviewLineItem[] {
  if (!catalog) return [];

  const items: ReviewLineItem[] = [];

  for (const step of catalog.steps) {
    for (const product of step.products) {
      const hasVariants = product.variants.length > 0;
      const variantIds = hasVariants
        ? product.variants.map((v) => v.id)
        : [NO_VARIANT_KEY];

      for (const variantId of variantIds) {
        const quantity = quantities[buildQuantityKey(product.id, variantId)] ?? 0;
        if (quantity <= 0) continue;

        const variant = hasVariants
          ? product.variants.find((v) => v.id === variantId) ?? null
          : null;

        items.push({
          productId: product.id,
          variantId,
          variantLabel: variant?.label ?? null,
          name: product.name,
          image: variant?.image ?? product.image,
          category: step.category,
          quantity,
          unitPrice: product.price,
          lineTotal: product.price * quantity,
          compareAtLineTotal:
            product.compareAtPrice != null ? product.compareAtPrice * quantity : null,
          priceLabel: product.priceLabel ?? null,
          lockedQuantity: product.lockedQuantity === true,
          maxQuantity: product.maxQuantity,
        });
      }
    }
  }

  return items;
}

function computeTotals(
  catalog: CatalogResponse | null,
  lineItems: ReviewLineItem[],
): BundleTotals {
  let preDiscountTotal = 0;
  let finalTotal = 0;

  for (const item of lineItems) {
    finalTotal += item.lineTotal;

    const found = findProduct(catalog, item.productId);
    const compareAtPrice = found?.product.compareAtPrice;
    const perUnitCompare = compareAtPrice ?? item.unitPrice;
    preDiscountTotal += perUnitCompare * item.quantity;
  }

  if (catalog) {
    finalTotal += REVIEW_CONTENT.shipping.price;
    preDiscountTotal += REVIEW_CONTENT.shipping.compareAtPrice ?? REVIEW_CONTENT.shipping.price;
  }

  const savings = Math.max(0, preDiscountTotal - finalTotal);

  return { preDiscountTotal, finalTotal, savings };
}

const useBundleBuilderStore = create<BundleBuilderStore>((set, get) => ({
  catalog: null,
  isLoading: false,
  error: null,
  quantities: {},
  activeVariants: {},
  openStepId: null,
  hasHydratedFromStorage: false,

  fetchCatalog: async () => {
    if (get().catalog || get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const { catalog, initialQuantities, initialActiveVariants } =
        await fetchCatalogAndDeriveInitialState();

      const persisted = loadPersistedState();
      const firstStepId = catalog.steps[0]?.id ?? null;

      if (persisted) {
        set({
          catalog,
          isLoading: false,
          quantities: { ...initialQuantities, ...persisted.quantities },
          activeVariants: { ...initialActiveVariants, ...persisted.activeVariants },
          openStepId: persisted.openStepId ?? firstStepId,
          hasHydratedFromStorage: true,
        });
      } else {
        set({
          catalog,
          isLoading: false,
          quantities: initialQuantities,
          activeVariants: initialActiveVariants,
          openStepId: firstStepId,
          hasHydratedFromStorage: false,
        });
      }
    } catch (error) {
      const message =
        error instanceof BundleBuilderServiceError
          ? error.message
          : 'Something went wrong loading your security system.';
      set({ isLoading: false, error: message });
    }
  },

  setOpenStepId: (stepId) => set({ openStepId: stepId }),

  setActiveVariantId: (productId, variantId) =>
    set((state) => ({
      activeVariants: { ...state.activeVariants, [productId]: variantId },
    })),

  getActiveVariantId: (productId) => {
    const { activeVariants } = get();
    return activeVariants[productId] ?? NO_VARIANT_KEY;
  },

  setQuantity: (productId, variantId, quantity) =>
    set((state) => ({
      quantities: {
        ...state.quantities,
        [buildQuantityKey(productId, variantId)]: Math.max(0, quantity),
      },
    })),

  getQuantity: (productId, variantId) => {
    const { quantities } = get();
    return quantities[buildQuantityKey(productId, variantId)] ?? 0;
  },

  getSelectedCountForStep: (stepId) => {
    const { catalog , quantities } = get();
    if (!catalog) return 0;
    const step = catalog.steps.find((s) => s.id === stepId);
    if (!step) return 0;

    let count = 0;
    for (const product of step.products) {
      const hasVariants = product.variants.length > 0;
      const variantIds = hasVariants
        ? product.variants.map((v) => v.id)
        : [NO_VARIANT_KEY];

      const productHasAnyQty = variantIds.some(
        (variantId) =>
          (quantities[buildQuantityKey(product.id, variantId)] ?? 0) > 0,
      );

      if (productHasAnyQty) count += 1;
    }
    return count;
  },

  getReviewLineItems: () => {
    const { catalog , quantities } = get();
    return computeReviewLineItems(catalog, quantities);
  },

  getTotals: () => {
    const { catalog , quantities } = get();
    const lineItems = computeReviewLineItems(catalog, quantities);
    return computeTotals(catalog, lineItems);
  },

  saveForLater: () => {
    const { quantities, activeVariants, openStepId } = get();
    persistState({
      quantities,
      activeVariants,
      openStepId,
    });
  },
}));

export { useBundleBuilderStore, STORAGE_KEY, computeReviewLineItems, computeTotals };
