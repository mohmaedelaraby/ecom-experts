import { useCallback, useMemo } from 'react';
import { QuantityStepper } from '../Stepper/QuantityStepper';
import { useBundleBuilderStore } from '../../shares/store/bundleBuilder.store';
import { formatCurrency } from '../../shares/utils/bundleBuilder.utils';
import type { Product } from '../../shares/interfaces/bundleBuilder.interfaces';
import '../../shares/styles/ProductCard.css';

interface ProductCardProps {
  product: Product;
  stepId: string;
}

function ProductCard({ product, stepId }: ProductCardProps) {
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

  const isSelected = quantity > 0;

  const priceLabel = useMemo(() => {
    if (product.priceLabel) {
      return product.priceLabel;
    }
    return formatCurrency(product.price);
  }, [product.price, product.priceLabel]);

  return (
    <div
      className={`bundleBuilder-productCard ${
        isSelected ? 'bundleBuilder-productCard--selected' : ''
      }`}
      data-step-id={stepId}
      data-product-id={product.id}
    >
      {product.badge && (
        <span className="bundleBuilder-productBadge">{product.badge}</span>
      )}

      <div className="bundleBuilder-productMain">
        <div className="bundleBuilder-productLeft">
          <div className="bundleBuilder-productImageWrap">
            <img
              className="bundleBuilder-productImage"
              src={product.image}
              alt={product.name}
              loading="lazy"
            />
          </div>
        </div>

        <div className="bundleBuilder-productRight">
          <h3 className="bundleBuilder-productTitle">{product.name}</h3>
          <p className="bundleBuilder-productDescription">
            {product.description}{' '}
            <a
              className="bundleBuilder-learnMoreLink"
              href={product.learnMoreUrl}
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          </p>

          {hasVariants && (
            <div
              className="bundleBuilder-variantCardRow"
              role="group"
              aria-label="Color"
            >
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={`bundleBuilder-variantCard ${
                    variant.id === activeVariantId
                      ? 'bundleBuilder-variantCard--active'
                      : ''
                  }`}
                  aria-pressed={variant.id === activeVariantId}
                  onClick={() => handleSelectVariant(variant.id)}
                >
                  {variant.image && (
                    <span className="bundleBuilder-variantCardImageWrap">
                      <img
                        className="bundleBuilder-variantCardImage"
                        src={variant.image}
                        alt={variant.label}
                        loading="lazy"
                      />
                    </span>
                  )}
                  <span className="bundleBuilder-variantCardLabel">
                    {variant.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="bundleBuilder-productFooter">
            <QuantityStepper
              quantity={quantity}
              onChange={handleQuantityChange}
              disabled={isLocked}
              label={`${product.name} quantity`}
            />

            <div className="bundleBuilder-productPricing">
              {product.compareAtPrice != null && (
                <span className="bundleBuilder-comparePrice">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
              <span
                className={`bundleBuilder-activePrice ${
                  product.priceLabel ? 'bundleBuilder-activePrice--free' : ''
                }`}
              >
                {priceLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProductCard };
