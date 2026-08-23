import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const Boarding = () => (
  <CategoryServicePage service={getServiceByPath("/boarding")} />
);

export default Boarding;
