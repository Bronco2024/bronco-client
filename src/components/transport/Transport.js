import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const Transport = () => (
  <CategoryServicePage service={getServiceByPath("/transport")} />
);

export default Transport;
