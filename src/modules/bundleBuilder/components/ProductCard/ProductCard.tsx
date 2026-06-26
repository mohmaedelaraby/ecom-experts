import { QuantityStepper } from '../Stepper/QuantityStepper';
import { useProductCard } from '../../shares/hooks/ProductCard.hooks';
import { formatCurrency } from '../../shares/utils/bundleBuilder.utils';
import '../../shares/styles/ProductCard.css';
import type { ProductCardProps } from '../../shares/models/ProductCard.models';


function ProductCard({ product, stepId }: ProductCardProps) {
  const {
    hasVariants,
    activeVariantId,
    quantity,
    isLocked,
    isSelected,
    activeImage,
    priceLabel,
    handleSelectVariant,
    handleQuantityChange,
  } = useProductCard(product);

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
              src={activeImage}
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
              max={product.maxQuantity}
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
