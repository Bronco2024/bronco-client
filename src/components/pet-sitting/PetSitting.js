import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const PetSitting = () => (
  <CategoryServicePage service={getServiceByPath("/pet-sitting")} />
);

export default PetSitting;
