import { EditIcon } from "../../../components/ui/Icons";
import { PrimaryButton } from "../../../components/ui/PrimaryButton";
import ProfilePic from "../../../components/ui/ProfilePic";
import { SecondaryButton } from "../../../components/ui/SecondaryButton";

const General = () => {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-4 border-b border-b-gray-300 py-8">
        <h3 className="text-lg font-black">Profile</h3>
        <div className="flex items-center gap-4">
          <ProfilePic
            image={
              "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"
            }
          />
          <EditIcon />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-b-gray-300 py-8">
        <h3 className="text-lg font-black">User Name</h3>
        <div className="flex items-center gap-4">
          <p>rajwinder singh</p>
          <EditIcon />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-b-gray-300 py-8">
        <h3 className="text-lg font-black">User Phone</h3>
        <div className="flex items-center gap-4">
          <p>8968585382</p>
          <EditIcon />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-b-gray-300 py-8">
        <h3 className="text-lg font-black"> Email</h3>
        <div className="flex items-center gap-4">
          <p>rajwindersxxx@gmail.com</p>
          <EditIcon />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-b-gray-300 py-8">
        <h3 className="text-lg font-black">Password</h3>
        <div className="flex items-center gap-4">
          <p>********</p>
          <SecondaryButton className="px-2">Change Password</SecondaryButton>
        </div>
      </div>
      <div className="flex justify-center gap-4 py-8">
        <PrimaryButton style="danger" className="w-42 ">Sign out</PrimaryButton>
      </div>
    </div>
  );
};

export default General;
