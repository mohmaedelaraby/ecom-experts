import { staticDataRepo } from "../repo/static-data.repo";

export const staticDataService = () => {
  const { steps, review } = staticDataRepo();
  if (!steps || !review) {
    throw new Error("Static data not found");
  }

  return { steps, review };
 
}