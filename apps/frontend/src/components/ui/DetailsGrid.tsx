import { formatCamelCase, formatDate } from "../../utils/projectUtils";

interface props<T> {
  includeFields: (keyof T)[];
  obj: T;
}
const DetailsGrid = <T,>({ includeFields, obj }: props<T>) => {
  const fields = includeFields.map((item) => ({
    [item]: formatDate(obj[item]),
  }));
  return (
    <div className="grid grid-cols-1 gap-8 text-xl lg:grid-cols-2">
      {fields.map((item) => (
        <div
          className="grid grid-cols-[0.5fr_1fr] gap-4"
          key={Object.keys(item)[0]}
        >
          <p className="font-semibold">
            {formatCamelCase(Object.keys(item)[0])} :{" "}
          </p>{" "}
          <p>{String(Object.values(item)[0])}</p>
        </div>
      ))}
    </div>
  );
};

export default DetailsGrid;
