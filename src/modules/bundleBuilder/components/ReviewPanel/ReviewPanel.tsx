import { QuantityStepper } from '../Stepper/QuantityStepper';
import satisfactionBadgeIcon from '../../../../assets/icons/Satisfaction Badge-05 1.png';
import shippingIcon from '../../../../assets/icons/Wyze Sense Keypad.png';
import { useReviewPanel } from '../../shares/hooks/ReviewPanel.hooks';
import { formatCurrency, REVIEW_CONTENT } from '../../shares/utils/bundleBuilder.utils';
import '../../shares/styles/ReviewPanel.css';

const CATEGORY_LABELS: Record<string, string> = {
  cameras: 'Cameras',
  plan: 'Plan',
  sensors: 'Sensors',
  accessories: 'Accessories',
};

const CATEGORY_ORDER = ['cameras', 'sensors', 'accessories', 'plan'];

function ReviewPanel() {
  const {
    catalog,
    grouped,
    totals,
    savedMessage,
    setQuantity,
    handleCheckout,
    handleSaveForLater,
  } = useReviewPanel();

  if (!catalog) {
    return null;
  }

  return (
    <aside className="bundleBuilder-reviewPanel" aria-label="Your security system">
      <p className="bundleBuilder-reviewHeader">Review </p>
      <p className="bundleBuilder-reviewTitle">{REVIEW_CONTENT.title}</p>
      <p className="bundleBuilder-reviewDescription">{REVIEW_CONTENT.description}</p>

      <div className="bundleBuilder-reviewLineItems">
        {CATEGORY_ORDER.filter((category) => (grouped.get(category) ?? []).length > 0).map(
          (category) => (
            <div key={category} className="bundleBuilder-reviewGroup">
              <h3 className="bundleBuilder-reviewGroupTitle">
                {CATEGORY_LABELS[category] ?? category}
              </h3>
              {(grouped.get(category) ?? []).map((item) => (
                <div
                  key={`${item.productId}-${item.variantId ?? 'default'}`}
                  className="bundleBuilder-reviewLine"
                >
                  <img
                    className={category === 'plan' ? 'bundleBuilder-reviewThumb bundleBuilder-reviewThumb--plan' : 'bundleBuilder-reviewThumb'}
                    src={item.image}
                    alt={item.name}
                  />
                  <div className="bundleBuilder-reviewLineInfo">
                    {category === 'plan' ? (
                      <span className="bundleBuilder-reviewLineName bundleBuilder-reviewLineName--plan">
                        <span className="bundleBuilder-reviewLineName-cam">
                          {item.name.split(' ')[0]}
                        </span>{' '}
                        <span className="bundleBuilder-reviewLineName-unlimited">
                          {item.name.split(' ').slice(1).join(' ')}
                        </span>
                        {item.variantLabel ? ` — ${item.variantLabel}` : ''}
                      </span>
                    ) : (
                      <span className="bundleBuilder-reviewLineName">
                        {item.name}
                        {item.variantLabel ? ` — ${item.variantLabel}` : ''}
                      </span>
                    )}
                  </div>
                  <QuantityStepper
                    quantity={item.quantity}
                    onChange={(next) =>
                      setQuantity(item.productId, item.variantId, next)
                    }
                    disabled={item.lockedQuantity}
                    max={item.maxQuantity}
                    label={`${item.name} quantity`}
                    size="small"
                  />
                  <span className="bundleBuilder-reviewLinePricing">
                    {item.compareAtLineTotal != null && (
                      <span className="bundleBuilder-reviewLineComparePrice">
                        {formatCurrency(item.compareAtLineTotal)}
                      </span>
                    )}
                    <span className="bundleBuilder-reviewLinePrice">
                      {item.priceLabel ?? formatCurrency(item.lineTotal)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ),
        )}
      </div>

      <div className="bundleBuilder-reviewExtras">
        <div className="bundleBuilder-reviewRow">
          <span className="bundleBuilder-reviewRowLabel">
            <img src={shippingIcon} alt="" aria-hidden="true" />
            {REVIEW_CONTENT.shipping.label}
          </span>
          <span className="bundleBuilder-reviewRowValue">
            {REVIEW_CONTENT.shipping.compareAtPrice != null && (
              <span className="bundleBuilder-reviewLineComparePrice">
                {formatCurrency(REVIEW_CONTENT.shipping.compareAtPrice)}
              </span>
            )}
           
            <span className="bundleBuilder-reviewLinePrice">
              FREE
              </span>
          </span>
        </div>

        <div className="bundleBuilder-guaranteeBlock">
          <img
            src={satisfactionBadgeIcon}
            alt={`${REVIEW_CONTENT.guarantee.label} — ${REVIEW_CONTENT.guarantee.sublabel}`}
            className="bundleBuilder-guaranteeIcon"
          />
          <div className="bundleBuilder-guaranteeSide">
            <div className="bundleBuilder-financingBadgeWrap">
              <span className="bundleBuilder-financingBadge">
                {REVIEW_CONTENT.financing.label}
              </span>
            </div>

            <div className="bundleBuilder-totalRow">
              <span className="bundleBuilder-totalValues">
                {totals.preDiscountTotal > totals.finalTotal && (
                  <span className="bundleBuilder-totalCompare">
                    {formatCurrency(totals.preDiscountTotal)}
                  </span>
                )}
                <span className="bundleBuilder-totalFinal">
                  {formatCurrency(totals.finalTotal)}
                </span>
              </span>
            </div>
          </div>
        </div>


        {totals.savings > 0 && (
          <p className="bundleBuilder-savingsCallout">
            Congrats! You're saving {formatCurrency(totals.preDiscountTotal - totals.finalTotal)} on your security
            bundle!
          </p>
        )}

        <button
          type="button"
          className="bundleBuilder-checkoutButton"
          onClick={handleCheckout}
        >
          {REVIEW_CONTENT.checkoutLabel}
        </button>

        <button
          type="button"
          className="bundleBuilder-saveForLaterButton"
          onClick={handleSaveForLater}
        >
          {REVIEW_CONTENT.saveForLaterLabel}
        </button>

        {savedMessage && (
          <p className="bundleBuilder-savedMessage" role="status">
            {savedMessage}
          </p>
        )}
      </div>
    </aside>
  );
}

export { ReviewPanel };
