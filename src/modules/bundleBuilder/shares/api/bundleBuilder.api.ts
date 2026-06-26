import axios from 'axios';
import type { CatalogResponse } from '../models/bundleBuilder.models';

const BUNDLE_BUILDER_API_BASE_URL = 'http://localhost:4000';

async function getCatalog(): Promise<CatalogResponse> {
  const response = await axios.get<CatalogResponse>(
    `${BUNDLE_BUILDER_API_BASE_URL}/api/products`,
  );
  return response.data;
}

export { getCatalog };
