import type { Review } from '../models/bundleBuilder.models';

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value);
}

const REVIEW_CONTENT: Review = {
  shipping: { label: 'Fast Shipping', price: 0, priceLabel: 'FREE', compareAtPrice: 5.99 },
};

export { formatCurrency, REVIEW_CONTENT };
