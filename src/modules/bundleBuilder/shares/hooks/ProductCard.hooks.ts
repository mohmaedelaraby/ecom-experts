import { useCallback, useMemo } from 'react';
import { useBundleBuilderStore } from '../store/bundleBuilder.store';
import { formatCurrency } from '../utils/bundleBuilder.utils';
import type { Product } from '../models/bundleBuilder.models';

function useProductCard(product: Product) {
  const hasVariants = product.variants.length > 0;

  const activeVariantId = useBundleBuilderStore((state) =>
    state.getActiveVariantId(product.id),
  );
  const setActiveVariantId = useBundleBuilderStore(
    (state) => state.setActiveVariantId,
  );
  const quantity = useBundleBuilderStore((state) =>
    state.getQuantity(product.id, activeVariantId),
  );
  const setQuantity = useBundleBuilderStore((state) => state.setQuantity);

  const isLocked = product.lockedQuantity === true;
  const isSelected = quantity > 0;

  const activeImage = useMemo(() => {
    if (!hasVariants) {
      return product.image;
    }
    const activeVariant = product.variants.find(
      (variant) => variant.id === activeVariantId,
    );
    return activeVariant?.image ?? product.image;
  }, [hasVariants, product.variants, product.image, activeVariantId]);

  const handleSelectVariant = useCallback(
    (variantId: string) => {
      setActiveVariantId(product.id, variantId);
    },
    [product.id, setActiveVariantId],
  );

  const handleQuantityChange = useCallback(
    (nextQuantity: number) => {
      setQuantity(product.id, activeVariantId, nextQuantity);
    },
    [product.id, activeVariantId, setQuantity],
  );

  const priceLabel = useMemo(() => {
    if (product.priceLabel) {
      return product.priceLabel;
    }
    return formatCurrency(product.price);
  }, [product.price, product.priceLabel]);

  return {
    hasVariants,
    activeVariantId,
    quantity,
    isLocked,
    isSelected,
    activeImage,
    priceLabel,
    handleSelectVariant,
    handleQuantityChange,
  };
}

export { useProductCard };
