import CategoryServicePage from "@/components/listings/CategoryServicePage";
import { getServiceByPath } from "@/data/services-catalog";

const ShowsAndCompetitions = () => (
  <CategoryServicePage service={getServiceByPath("/shows-and-competitions")} />
);

export default ShowsAndCompetitions;
