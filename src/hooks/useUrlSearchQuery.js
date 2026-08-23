import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useUrlSearchQuery = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchText, setSearchText] = useState(initialQuery);

  const hasSearchText = useMemo(
    () => Boolean(searchText.trim()),
    [searchText]
  );

  return { searchText, setSearchText, hasSearchText };
};

export default useUrlSearchQuery;
