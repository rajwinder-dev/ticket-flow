import { useState } from "react";

type Filter = Record<string, string | number>;

function useQuickFilter() {
  const [filter, setFilter] = useState<Filter>({});
  const updateFilter = (payload: Filter) => {
    setFilter(prev => {
      const updated = { ...prev };
      for (const key in payload) {
        const value = payload[key];
        if (value === "") {
          delete updated[key]; // remove filter
        } else {
          updated[key] = value; // add/update filter
        }
      }
      return updated;
    });
  };

  return { quickFilterData: filter, updateQuickFilterData: updateFilter };
}

export default useQuickFilter;
