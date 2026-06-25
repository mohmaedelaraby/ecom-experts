import type { Review } from '../interfaces/bundleBuilder.interfaces';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value);
}

// The BE catalog endpoint never returns review/checkout copy — it's rendered entirely on the FE.
const REVIEW_CONTENT: Review = {
  title: 'Your security system',
  description:
    'Review your personalized protection system designed to keep what matters most safe.',
  shipping: { label: 'Fast Shipping', price: 5.99, priceLabel: null },
  guarantee: {
    label: '100% Satisfaction Guaranteed',
    sublabel:
      "30-day hassle-free returns. If you're not totally in love with the product, we will refund you 100%.",
  },
  financing: { label: 'Call as low as $19.99/mo' },
  checkoutLabel: 'Checkout',
  saveForLaterLabel: 'Save my system for later',
};

export { formatCurrency, REVIEW_CONTENT };
