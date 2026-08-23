import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useServicePageSearch from "@/hooks/useServicePageSearch";

const useServicePageFilters = ({ path, pageTitle, description }) => {
  const [searchParams] = useSearchParams();
  const initialAnimal = searchParams.get("animal") || "all";
  const { searchText, setSearchText, hasSearchText } = useServicePageSearch({
    path,
    pageTitle,
    description,
  });
  const [selectedAnimal, setSelectedAnimal] = useState(initialAnimal);

  return {
    searchText,
    setSearchText,
    hasSearchText,
    selectedAnimal,
    setSelectedAnimal,
  };
};

export default useServicePageFilters;
