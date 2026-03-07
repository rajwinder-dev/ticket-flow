import type { QuickFilters } from "./QuickTable";
import SelectInput from "./SelectInput";

interface Props<T> {
  updateFilter: (x: Record<string, string | number>) => void;
  quickFilters: QuickFilters<T>[];
  quickFilterData: Record<string, string | number>;
}

// Example of dynamic filters

function QuickFilter<T>({
  updateFilter,
  quickFilters,
  quickFilterData,
}: Props<T>) {
  return (
    <>
      {quickFilters.map((filter, index) => {
        const filterKey = filter.field;
        const isActive = filterKey in quickFilterData;
        console.log(isActive)
        return (
          <SelectInput
            className={`${isActive && "bg-blue/10"}`}
            key={String(filterKey) + index}
            onChange={(e) =>
              updateFilter({
                [String(filterKey)]: e.target.value,
              })
            }
          >
            <SelectInput.Option value="">{filter.label}</SelectInput.Option>
            <>
              {filter.values.map((option) => (
                <SelectInput.Option key={option} value={option}>
                  {option}
                </SelectInput.Option>
              ))}
            </>
          </SelectInput>
        );
      })}
    </>
  );
}

export default QuickFilter;
