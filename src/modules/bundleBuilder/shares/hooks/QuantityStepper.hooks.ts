interface UseQuantityStepperArgs {
  quantity: number;
  onChange: (next: number) => void;
  disabled: boolean;
  min: number;
  max: number;
}

function useQuantityStepper({
  quantity,
  onChange,
  disabled,
  min,
  max,
}: UseQuantityStepperArgs) {
  const handleDecrement = () => {
    if (disabled) return;
    onChange(Math.max(min, quantity - 1));
  };

  const handleIncrement = () => {
    if (disabled) return;
    onChange(Math.min(max, quantity + 1));
  };

  return { handleDecrement, handleIncrement };
}

export { useQuantityStepper };
