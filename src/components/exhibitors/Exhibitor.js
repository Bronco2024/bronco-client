import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const Exhibitors = () => (
  <CategoryServicePage service={getServiceByPath("/exhibitors")} />
);

export default Exhibitors;
