import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const Schools = () => (
  <CategoryServicePage service={getServiceByPath("/schools")} />
);

export default Schools;
