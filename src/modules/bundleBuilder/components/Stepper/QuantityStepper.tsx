import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  label?: string;
  size?: 'default' | 'small';
}

function QuantityStepper({
  quantity,
  onChange,
  disabled = false,
  min = 0,
  max = 99,
  label = 'Quantity',
  size = 'default',
}: QuantityStepperProps) {
  const handleDecrement = () => {
    if (disabled) return;
    onChange(Math.max(min, quantity - 1));
  };

  const handleIncrement = () => {
    if (disabled) return;
    onChange(Math.min(max, quantity + 1));
  };

  return (
    <div
      className={`bundleBuilder-quantityStepper ${
        size === 'small' ? 'bundleBuilder-quantityStepper--small' : ''
      } ${disabled ? 'bundleBuilder-quantityStepper--disabled' : ''}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className="bundleBuilder-stepperButton"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus size={size === 'small' ? 12 : 14} aria-hidden="true" />
      </button>
      <span className="bundleBuilder-stepperValue" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="bundleBuilder-stepperButton"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        aria-label={`Increase ${label}`}
      >
        <Plus size={size === 'small' ? 12 : 14} aria-hidden="true" />
      </button>
    </div>
  );
}

export { QuantityStepper };
