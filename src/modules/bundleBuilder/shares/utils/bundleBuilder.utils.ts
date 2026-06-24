const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value);
}

export { formatCurrency };
