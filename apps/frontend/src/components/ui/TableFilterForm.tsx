import { useCallback, useEffect, useRef, useState } from "react";
interface props {
  getFilterObject: (params: Record<string, string | number>) => void;
  filterFields: { id: string; label: string }[];
}
function TableFilterForm({ getFilterObject, filterFields }: props) {
  type FilterRow = {
    id: number;
    field: string;
    operator: string;
    value: string;
  };
  const [internalFilter, setInternalFilter] = useState<FilterRow[]>([]);
  const justRemoved = useRef(false);
  function addNewField() {
    setInternalFilter((prev) => [
      ...prev,
      { id: Date.now(), field: "", operator: "", value: "" },
    ]);
  }
  function removeField(id: number) {
    setInternalFilter((prev) => prev.filter((row) => row.id !== id));
    justRemoved.current = true;
    applyFilters();
  }

  function updateField(id: number, key: keyof FilterRow, value: string) {
    setInternalFilter((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
  );
}
const applyFilters = useCallback(() => {
  const filterData: Record<string, string | number> = {};
  internalFilter.forEach((item) => {
    filterData[`${item.field}${item.operator ? `[${item.operator}]` : ""}`] =
    item.value;
  });
  getFilterObject(filterData);
}, [getFilterObject, internalFilter]);

useEffect(() => {
  console.log("test")
  if (justRemoved.current) {
    applyFilters();
    justRemoved.current = false;
  }
}, [applyFilters, internalFilter]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        applyFilters();
      }}
    >
      {!internalFilter.length && (
        <div className="border-b-gary4 border-b pb-2">
          <p>No filters applied to this view</p>
          <p className="text-gary4 text-sm">
            Add a column below to filter the view
          </p>
        </div>
      )}
      <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-2">
        {internalFilter.map((item) => (
          <>
            <select
              value={item.field}
              onChange={(e) => updateField(item.id, "field", e.target.value)}
              className="min-w-0 rounded-sm p-1 outline outline-gray-400"
            >
              <option value="">Select Field</option>
              {filterFields.map((item) => (
                <option value={item.id}>{item.label}</option>
              ))}
            </select>
            <select
              value={item.operator}
              onChange={(e) => updateField(item.id, "operator", e.target.value)}
              className="rounded-md px-2 py-1 outline outline-gray-400"
            >
              <option value="">=</option>
              <option value="gt">&gt;</option>
              <option value="gte">&gt;=</option>
              <option value="lte">&lt;=</option>
              <option value="lt">&lt;</option>
            </select>
            <input
              type="text"
              placeholder="Value"
              value={item.value}
              onChange={(e) => updateField(item.id, "value", e.target.value)}
              className="min-w-0 rounded-sm p-1 outline outline-gray-400"
            />
            <button
              type="button"
              onClick={() => removeField(item.id)}
              className="hover:cursor-pointer"
            >
              ❌
            </button>
          </>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-2">
        <button
          type="button"
          onClick={addNewField}
          className="border-gary4 rounded border px-2 text-sm"
        >
          Add filter
        </button>
        <button
          type="submit"
          className="border-gary4 rounded border px-2 text-sm"
        >
          Apply filter
        </button>
      </div>
    </form>
  );
}

export default TableFilterForm;
