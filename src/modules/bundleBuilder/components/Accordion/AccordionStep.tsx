import { useMemo } from 'react';
import { ProductCard } from '../ProductCard/ProductCard';
import { useBundleBuilderStore } from '../../shares/store/bundleBuilder.store';
import type { Step } from '../../shares/interfaces/bundleBuilder.interfaces';
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
  const openStepId = useBundleBuilderStore((state) => state.openStepId);
  const setOpenStepId = useBundleBuilderStore((state) => state.setOpenStepId);
  const selectedCount = useBundleBuilderStore((state) =>
    state.getSelectedCountForStep(step.id),
  );
  const catalog = useBundleBuilderStore((state) => state.catalog);

  const isOpen = openStepId === step.id;
  const iconSrc = ICONS_BY_KEY[step.icon] ?? shieldIcon;

  const nextStep = useMemo(() => {
    if (!catalog) return null;
    const idx = catalog.steps.findIndex((s) => s.id === step.id);
    return catalog.steps[idx + 1] ?? null;
  }, [catalog, step.id]);

  const handleToggle = () => {
    setOpenStepId(isOpen ? null : step.id);
  };

  const handleNext = () => {
    if (nextStep) {
      setOpenStepId(nextStep.id);
    } else {
      setOpenStepId(null);
    }
  };

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
        aria-expanded={isOpen}
        aria-controls={`bundleBuilder-step-panel-${step.id}`}
      >
        <span className="bundleBuilder-accordionHeaderLeft">
          <span className="bundleBuilder-stepEyebrow">
            STEP {step.stepNumber} OF 4
          </span>
          <span className="bundleBuilder-stepTitleRow">
            <img
              className="bundleBuilder-stepIcon"
              src={iconSrc}
              width={20}
              height={20}
              alt=""
              aria-hidden="true"
            />
            <span className="bundleBuilder-stepTitle">{step.title}</span>
          </span>
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
                width={20}
                height={20}
                alt=""
                aria-hidden="true"
              />
            </>
          ) : (
            <img
              className="bundleBuilder-accordionChevron"
              src={chevronIcon}
              width={20}
              height={20}
              alt=""
              aria-hidden="true"
            />
          )}
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
