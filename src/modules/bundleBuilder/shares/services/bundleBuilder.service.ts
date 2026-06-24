import { getCatalog } from '../api/bundleBuilder.api';
import { NO_VARIANT_KEY } from '../interfaces/bundleBuilder.interfaces';
import type {
  ActiveVariantMap,
  CatalogResponse,
  QuantityMap,
} from '../interfaces/bundleBuilder.interfaces';

export class BundleBuilderServiceError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'BundleBuilderServiceError';
    this.cause = cause;
  }
}

export interface FetchCatalogResult {
  catalog: CatalogResponse;
  initialQuantities: QuantityMap;
  initialActiveVariants: ActiveVariantMap;
}

function buildQuantityKey(productId: string, variantId: string): string {
  return `${productId}::${variantId}`;
}

async function fetchCatalogAndDeriveInitialState(): Promise<FetchCatalogResult> {
  try {
    const catalog = await getCatalog();

    const initialQuantities: QuantityMap = {};
    const initialActiveVariants: ActiveVariantMap = {};

    for (const step of catalog.steps) {
      for (const product of step.products) {
        const hasVariants = product.variants.length > 0;

        if (hasVariants) {
          initialActiveVariants[product.id] =
            product.defaultVariantId ?? product.variants[0].id;

          for (const variant of product.variants) {
            const key = buildQuantityKey(product.id, variant.id);
            initialQuantities[key] = product.initialQuantities[variant.id] ?? 0;
          }
        } else {
          const key = buildQuantityKey(product.id, NO_VARIANT_KEY);
          initialQuantities[key] =
            product.initialQuantities[NO_VARIANT_KEY] ?? 0;
        }
      }
    }

    return { catalog, initialQuantities, initialActiveVariants };
  } catch (error) {
    throw new BundleBuilderServiceError(
      'Failed to load the bundle builder catalog.',
      error,
    );
  }
}

export { fetchCatalogAndDeriveInitialState, buildQuantityKey };
