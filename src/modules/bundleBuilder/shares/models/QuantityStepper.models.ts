export interface QuantityStepperProps {
  quantity: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  label?: string;
  size?: 'default' | 'small';
}

export interface UseQuantityStepperArgs {
  quantity: number;
  onChange: (next: number) => void;
  disabled: boolean;
  min: number;
  max: number;
}
