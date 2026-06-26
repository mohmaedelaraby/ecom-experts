import { useEffect } from 'react';
import { useBundleBuilderStore } from '../store/bundleBuilder.store';

function useBundleBuilder() {
  const fetchCatalog = useBundleBuilderStore((state) => state.fetchCatalog);
  const catalog = useBundleBuilderStore((state) => state.catalog);
  const isLoading = useBundleBuilderStore((state) => state.isLoading);
  const error = useBundleBuilderStore((state) => state.error);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return { catalog, isLoading, error };
}

export { useBundleBuilder };
