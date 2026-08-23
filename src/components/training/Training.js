import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const Training = () => (
  <CategoryServicePage service={getServiceByPath("/training")} />
);

export default Training;
