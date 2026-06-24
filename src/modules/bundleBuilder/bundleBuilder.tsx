import { useEffect } from 'react';
import { AccordionStep } from './components/Accordion/AccordionStep';
import { ReviewPanel } from './components/ReviewPanel/ReviewPanel';
import { useBundleBuilderStore } from './shares/store/bundleBuilder.store';
import './shares/styles/bundleBuilder.css';

function BundleBuilder() {
  const fetchCatalog = useBundleBuilderStore((state) => state.fetchCatalog);
  const catalog = useBundleBuilderStore((state) => state.catalog);
  const isLoading = useBundleBuilderStore((state) => state.isLoading);
  const error = useBundleBuilderStore((state) => state.error);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  if (isLoading && !catalog) {
    return (
      <div className="bundleBuilder-root bundleBuilder-root--centered">
        <p className="bundleBuilder-loadingText" role="status">
          Loading your security system…
        </p>
      </div>
    );
  }

  if (error && !catalog) {
    return (
      <div className="bundleBuilder-root bundleBuilder-root--centered">
        <p className="bundleBuilder-errorText" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!catalog) {
    return null;
  }

  return (
    <div className="bundleBuilder-root">
      <div className="bundleBuilder-layout">
        <div className="bundleBuilder-accordionColumn">
          {catalog.steps.map((step) => (
            <AccordionStep key={step.id} step={step} />
          ))}
        </div>
        <div className="bundleBuilder-reviewColumn">
          <ReviewPanel />
        </div>
      </div>
    </div>
  );
}

export default BundleBuilder;
