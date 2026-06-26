import { ProductCard } from '../ProductCard/ProductCard';
import { useAccordionStep } from '../../shares/hooks/AccordionStep.hooks';
import type { Step } from '../../shares/models/bundleBuilder.models';
import cameraIcon from '../../../../assets/icons/livestream.svg';
import shieldIcon from '../../../../assets/icons/logo_hms_new 1.svg';
import radioIcon from '../../../../assets/icons/Group 1417.svg';
import plusCircleIcon from '../../../../assets/icons/Frame 1419.svg';
import chevronIcon from '../../../../assets/icons/carrot-up.svg';
import '../../shares/styles/AccordionStep.css';

interface AccordionStepProps {
  step: Step;
}

const ICONS_BY_KEY: Record<string, string> = {
  camera: cameraIcon,
  shield: shieldIcon,
  radio: radioIcon,
  'plus-circle': plusCircleIcon,
};

function AccordionStep({ step }: AccordionStepProps) {
  const { isOpen, selectedCount, nextStep, handleToggle, handleNext } =
    useAccordionStep(step);

  const iconSrc = ICONS_BY_KEY[step.icon] ?? shieldIcon;

  return (
    <section
      className={`bundleBuilder-accordionStep ${
        isOpen ? 'bundleBuilder-accordionStep--open' : ''
      }`}
    >
      <button
        type="button"
        className="bundleBuilder-accordionHeader"
        onClick={handleToggle}
        aria-controls={`bundleBuilder-step-panel-${step.id}`}
      >
        <span className="bundleBuilder-stepEyebrowRow">
          <span className="bundleBuilder-stepEyebrow">
            STEP {step.stepNumber} OF 4
          </span>
        </span>
        <span className="bundleBuilder-accordionHeaderLeft">
          <span className="bundleBuilder-stepTitleRow">
            <img
              className="bundleBuilder-stepIcon"
              src={iconSrc}
              width={26}
              height={26}
              alt=""
              aria-hidden="true"
            />
            <span className="bundleBuilder-stepTitle">{step.title}</span>
          </span>
          <span className="bundleBuilder-accordionHeaderRight">
            {isOpen ? (
              <>
                <span className="bundleBuilder-selectedCount">
                  {selectedCount} selected
                </span>
                <img
                  className="bundleBuilder-accordionChevron bundleBuilder-accordionChevron--up"
                  src={chevronIcon}
                  width={12}
                  height={12}
                  alt=""
                  aria-hidden="true"
                />
              </>
            ) : (
              <img
                className="bundleBuilder-accordionChevron"
                src={chevronIcon}
                width={12}
                height={12}
                alt=""
                aria-hidden="true"
              />
            )}
          </span>
        </span>
      </button>

      {isOpen && (
        <div
          id={`bundleBuilder-step-panel-${step.id}`}
          className="bundleBuilder-accordionBody"
        >
          <div className="bundleBuilder-productGrid">
            {step.products.map((product) => (
              <ProductCard key={product.id} product={product} stepId={step.id} />
            ))}
          </div>

          {nextStep && (
            <div className="bundleBuilder-nextButtonContainer">
            <button
              type="button"
              className="bundleBuilder-nextButton"
              onClick={handleNext}
            >
              Next: {nextStep.title}
            </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export { AccordionStep };
