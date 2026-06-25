import { staticDataService } from "../services/static-data.services";

export const staticDataController = (_req, res) => {
  const { steps, review } = staticDataService()
  try {
    res.status(200).json({ steps, review });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

  