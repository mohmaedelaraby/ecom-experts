import axios from 'axios';
import type { CatalogResponse } from '../models/bundleBuilder.models';

const API_BASE_URL = import.meta.env.VITE_BUNDLE_BUILDER_API_BASE_URL;
async function getCatalog(): Promise<CatalogResponse> {
  const response = await axios.get<CatalogResponse>(
    `${API_BASE_URL}/api/products`,
  );
  return response.data;
}

export { getCatalog };
