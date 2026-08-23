import useUrlSearchQuery from "@/hooks/useUrlSearchQuery";
import useSeo from "@/hooks/useSeo";
import { SITE_NAME, SITE_URL } from "@/data/site-config";

const useServicePageSearch = ({ path, pageTitle, description }) => {
  const { searchText, setSearchText, hasSearchText } = useUrlSearchQuery();

  useSeo({
    title: `${pageTitle} | ${SITE_NAME}`,
    description: description || `${pageTitle} — ${SITE_NAME}`,
    url: `${SITE_URL}${path}`,
  });

  return {
    searchText,
    setSearchText,
    hasSearchText,
  };
};

export default useServicePageSearch;
