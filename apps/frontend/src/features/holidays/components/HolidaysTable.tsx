import { DeleteIcon, EditIcon, OpenEye } from "../../../components/ui/Icons";
import QuickTable from "../../../components/ui/QuickTable";

const data = [
  {
    holidayId: "HOL001",
    name: "Republic Day",
    date: "2025-01-26",
    day: "Sunday",
    type: "National",
    description: "Commemorates the adoption of the Constitution of India.",
    createdBy: "admin",
    createdAt: "2024-12-01T10:15:00Z",
    status: "active",
  },
  {
    holidayId: "HOL002",
    name: "Holi",
    date: "2025-03-14",
    day: "Friday",
    type: "Optional",
    description: "Festival of colors and the arrival of spring.",
    createdBy: "admin",
    createdAt: "2024-12-10T09:45:00Z",
    status: "active",
  },
  {
    holidayId: "HOL003",
    name: "Company Annual Picnic",
    date: "2025-05-03",
    day: "Saturday",
    type: "Company",
    description: "Annual offsite event for team building.",
    createdBy: "hr_manager",
    createdAt: "2025-01-05T11:00:00Z",
    status: "inactive",
  },
  {
    holidayId: "HOL004",
    name: "Independence Day",
    date: "2025-08-15",
    day: "Friday",
    type: "National",
    description: "Celebrates India's independence from British rule.",
    createdBy: "admin",
    createdAt: "2024-12-01T10:20:00Z",
    status: "active",
  },
  {
    holidayId: "HOL005",
    name: "Christmas",
    date: "2025-12-25",
    day: "Thursday",
    type: "Optional",
    description: "Christian festival celebrating the birth of Jesus Christ.",
    createdBy: "admin",
    createdAt: "2025-01-10T08:30:00Z",
    status: "active",
  },
];

const HolidaysTable = () => {
  function handleView(id: string | number | null | undefined) {
    console.log(id);
  }
  return (
    <>
      <QuickTable
        heading="Holidays"
        staticData={data}
        visibleColumns={[
          { id: "holidayId", label: "Sr No" },
          { id: "name", label: "name" },
          { id: "date", label: "Date" },
          { id: "day", label: "Day" },
          { id: "type", label: "Type" },
          { id: "createdAt", label: "CreatedAt" },
          { id: "createdBy", label: "CreatedBy" },
          { id: "status", label: "Status" },
        ]}
        options={{ textAlign: "center", pageSize: 10, advanceFilters: true }}
        actions={{
          useField: "holidayId",
          buttons: [
            {
              icon: <OpenEye />,
              callback: handleView,
            },
            {
              icon: <EditIcon />,
              callback: handleView,
            },
            {
              icon: <DeleteIcon />,
              callback: handleView,
            },
          ],
        }}
        highlightValues={[
          {
            id: "status",
            values: {
              inactive: "bg-[#FCAA5C]/10 text-[#FCAA5C]",
              active: "bg-[#28C76F]/10 text-[#28C76F] ",
            },
          },
        ]}
      />
    </>
  );
};

export default HolidaysTable;
