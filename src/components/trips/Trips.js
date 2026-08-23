import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const Trips = () => (
  <CategoryServicePage service={getServiceByPath("/trips")} />
);

export default Trips;
