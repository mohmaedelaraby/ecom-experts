import { useMemo } from 'react';
import { useBundleBuilderStore } from '../store/bundleBuilder.store';
import type { Step } from '../models/bundleBuilder.models';

function useAccordionStep(step: Step) {
  const openStepId = useBundleBuilderStore((state) => state.openStepId);
  const setOpenStepId = useBundleBuilderStore((state) => state.setOpenStepId);
  const selectedCount = useBundleBuilderStore((state) =>
    state.getSelectedCountForStep(step.id),
  );
  const catalog = useBundleBuilderStore((state) => state.catalog);

  const isOpen = openStepId === step.id;

  const nextStep = useMemo(() => {
    if (!catalog) return null;
    const idx = catalog.steps.findIndex((s) => s.id === step.id);
    return catalog.steps[idx + 1] ?? null;
  }, [catalog, step.id]);

  const handleToggle = () => {
    setOpenStepId(isOpen ? null : step.id);
  };

  const handleNext = () => {
    setOpenStepId(nextStep ? nextStep.id : null);
  };

  return { isOpen, selectedCount, nextStep, handleToggle, handleNext };
}

export { useAccordionStep };
