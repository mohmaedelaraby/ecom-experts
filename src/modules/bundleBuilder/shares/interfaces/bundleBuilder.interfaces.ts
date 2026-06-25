export interface Variant {
  id: string;
  label: string;
  swatch: string;
  image?: string;
}

export type InitialQuantities = Record<string, number>;

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  learnMoreUrl: string;
  badge: string | null;
  compareAtPrice: number | null;
  price: number;
  priceLabel?: string;
  billingPeriod?: string;
  variants: Variant[];
  defaultVariantId: string | null;
  initialQuantities: InitialQuantities;
  lockedQuantity?: boolean;
}

export interface Step {
  id: string;
  stepNumber: number;
  title: string;
  icon: string;
  category: string;
  products: Product[];
}

export interface ReviewShipping {
  label: string;
  price: number;
  priceLabel: string | null;
  compareAtPrice?: number;
}

export interface ReviewGuarantee {
  label: string;
  sublabel: string;
}

export interface ReviewFinancing {
  label: string;
}

export interface Review {
  title: string;
  description: string;
  shipping: ReviewShipping;
  guarantee: ReviewGuarantee;
  financing: ReviewFinancing;
  checkoutLabel: string;
  saveForLaterLabel: string;
}

export interface CatalogResponse {
  steps: Step[];
}

export const NO_VARIANT_KEY = 'default';

export type QuantityMap = Record<string, number>;

export type ActiveVariantMap = Record<string, string>;

export interface ReviewLineItem {
  productId: string;
  variantId: string;
  variantLabel: string | null;
  name: string;
  image: string;
  category: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  compareAtLineTotal: number | null;
  priceLabel: string | null;
  lockedQuantity: boolean;
}

export interface BundleTotals {
  preDiscountTotal: number;
  finalTotal: number;
  savings: number;
}

export interface PersistedBundleState {
  quantities: QuantityMap;
  activeVariants: ActiveVariantMap;
  openStepId: string | null;
}

export interface BundleBuilderState {
  catalog: CatalogResponse | null;
  isLoading: boolean;
  error: string | null;
  quantities: QuantityMap;
  activeVariants: ActiveVariantMap;
  openStepId: string | null;
  hasHydratedFromStorage: boolean;
}

export interface BundleBuilderActions {
  fetchCatalog: () => Promise<void>;
  setOpenStepId: (stepId: string | null) => void;
  setActiveVariantId: (productId: string, variantId: string) => void;
  getActiveVariantId: (productId: string) => string;
  setQuantity: (productId: string, variantId: string, quantity: number) => void;
  getQuantity: (productId: string, variantId: string) => number;
  getSelectedCountForStep: (stepId: string) => number;
  getReviewLineItems: () => ReviewLineItem[];
  getTotals: () => BundleTotals;
  saveForLater: () => void;
}

export type BundleBuilderStore = BundleBuilderState & BundleBuilderActions;
