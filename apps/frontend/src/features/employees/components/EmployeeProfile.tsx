import DetailsGrid from "../../../components/ui/DetailsGrid";
import { singleEmployeeData } from "../../../data/EmployeeData";

const EmployeeProfile = () => {
  return (
    <div className="p-4">
      <h2 className="mb-8 text-2xl font-semibold">Employee Details</h2>
      <DetailsGrid
        obj={singleEmployeeData.data}
        includeFields={[
          "firstName",
          "lastName",
          "jobTitle",
          "dateOfBirth",
          "gender",
          "hireDate",
          "nationalId",
          "idType",
          "updatedAt",
          "address",
        ]}
      />
      here we need to modify api Role: "manger" RoleCreatedAt: "date (add ad
      detail in one api call )
    </div>
  );
};

export default EmployeeProfile;
