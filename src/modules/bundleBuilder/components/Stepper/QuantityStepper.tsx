import { Minus, Plus } from 'lucide-react';
import { useQuantityStepper } from '../../shares/hooks/QuantityStepper.hooks';
import '../../shares/styles/QuantityStepper.css';
import type { QuantityStepperProps } from '../../shares/models/QuantityStepper.models';



function QuantityStepper({
  quantity,
  onChange,
  disabled = false,
  min = 0,
  max = 99,
  label = 'Quantity',
  size = 'default',
}: QuantityStepperProps) {
  const { handleDecrement, handleIncrement } = useQuantityStepper({
    quantity,
    onChange,
    disabled,
    min,
    max,
  });

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
        className="bundleBuilder-stepperButton bundleBuilder-stepperButton--decrement"
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
        className="bundleBuilder-stepperButton bundleBuilder-stepperButton--increment"
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
