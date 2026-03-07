import { useToggleMenu } from "../../hooks/useToogleMenu";
import { FilterIcon } from "./Icons";

import TableFilterForm from "./TableFilterForm";
interface props {
  getFilterObject: (params: Record<string, string | number>) => void;
  filterFields: { id: string; label: string }[];
  advanceFilter: Record<string, string | number>;
}
// * this is the reusable component
function FilterButton({ getFilterObject, filterFields, advanceFilter }: props) {
  const { buttonRef, menuRef, isMenuOpen } = useToggleMenu();
  const activeFilters = Object.keys(advanceFilter).length;
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className={`flex h-12 items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100 ${activeFilters && `bg-blue/10`}`}
      >
        <FilterIcon />
        Filter
      </button>
      {
        <div
          className={`bg-natural-beige absolute top-[50px] -right-0 z-40 flex w-96 flex-col gap-2 overflow-auto rounded-sm border border-gray-400 bg-white p-2 text-start shadow-md transition-all duration-200 ${
            isMenuOpen
              ? "visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
          ref={menuRef}
        >
          <TableFilterForm
            getFilterObject={getFilterObject}
            filterFields={filterFields}
          />
        </div>
      }
    </div>
  );
}

export default FilterButton;
