import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const Veterinarian = () => (
  <CategoryServicePage service={getServiceByPath("/veterinarians")} />
);

export default Veterinarian;
