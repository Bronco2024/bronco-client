import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const Groomers = () => (
  <CategoryServicePage service={getServiceByPath("/groomers")} />
);

export default Groomers;
