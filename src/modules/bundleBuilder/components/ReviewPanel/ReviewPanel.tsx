import { useMemo, useState } from 'react';
import { Truck } from 'lucide-react';
import { QuantityStepper } from '../Stepper/QuantityStepper';
import satisfactionBadgeIcon from '../../../../assets/icons/Satisfaction Badge-05 1.svg';
import {
  useBundleBuilderStore,
  computeReviewLineItems,
  computeTotals,
} from '../../shares/store/bundleBuilder.store';
import { formatCurrency } from '../../shares/utils/bundleBuilder.utils';
import type { ReviewLineItem } from '../../shares/interfaces/bundleBuilder.interfaces';

const CATEGORY_LABELS: Record<string, string> = {
  cameras: 'Cameras',
  plan: 'Plan',
  sensors: 'Sensors',
  accessories: 'Accessories',
};

const CATEGORY_ORDER = ['cameras', 'sensors', 'accessories', 'plan'];

function ReviewPanel() {
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

  if (!catalog) {
    return null;
  }

  const { review } = catalog;

  const handleCheckout = () => {
    window.alert('This is a placeholder checkout. No order was actually placed.');
  };

  const handleSaveForLater = () => {
    saveForLater();
    setSavedMessage('Your system has been saved!');
    window.setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <aside className="bundleBuilder-reviewPanel" aria-label="Your security system">
      <h2 className="bundleBuilder-reviewTitle">{review.title}</h2>
      <p className="bundleBuilder-reviewDescription">{review.description}</p>

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
                    className="bundleBuilder-reviewThumb"
                    src={item.image}
                    alt={item.name}
                  />
                  <div className="bundleBuilder-reviewLineInfo">
                    <span className="bundleBuilder-reviewLineName">
                      {item.name}
                      {item.variantLabel ? ` — ${item.variantLabel}` : ''}
                    </span>
                  </div>
                  <QuantityStepper
                    quantity={item.quantity}
                    onChange={(next) =>
                      setQuantity(item.productId, item.variantId, next)
                    }
                    disabled={item.lockedQuantity}
                    label={`${item.name} quantity`}
                    size="small"
                  />
                  <span className="bundleBuilder-reviewLinePrice">
                    {item.priceLabel ?? formatCurrency(item.lineTotal)}
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
            <Truck size={16} aria-hidden="true" /> {review.shipping.label}
          </span>
          <span className="bundleBuilder-reviewRowValue">
            {review.shipping.priceLabel ?? formatCurrency(review.shipping.price)}
          </span>
        </div>

        <div className="bundleBuilder-guaranteeBlock">
          <img
            src={satisfactionBadgeIcon}
            width={20}
            height={20}
            alt=""
            aria-hidden="true"
            className="bundleBuilder-guaranteeIcon"
          />
          <div>
            <p className="bundleBuilder-guaranteeLabel">{review.guarantee.label}</p>
            <p className="bundleBuilder-guaranteeSublabel">{review.guarantee.sublabel}</p>
          </div>
        </div>

        <div className="bundleBuilder-reviewRow bundleBuilder-reviewRow--financing">
          <span>{review.financing.label}</span>
        </div>

        <div className="bundleBuilder-totalRow">
          <span className="bundleBuilder-totalLabel">Total</span>
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

        {totals.savings > 0 && (
          <p className="bundleBuilder-savingsCallout">
            Congrats! You're saving {formatCurrency(totals.savings)} on your security
            bundle!
          </p>
        )}

        <button
          type="button"
          className="bundleBuilder-checkoutButton"
          onClick={handleCheckout}
        >
          {review.checkoutLabel}
        </button>

        <button
          type="button"
          className="bundleBuilder-saveForLaterButton"
          onClick={handleSaveForLater}
        >
          {review.saveForLaterLabel}
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
