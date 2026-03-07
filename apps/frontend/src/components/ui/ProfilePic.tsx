import { cn } from "../../utils/cn";

interface props {
  image: string | undefined;
  classname?: string;
}
const ProfilePic = ({ image , classname}: props) => {
  return (
    <div className={cn("relative row-span-2 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full", classname)}>
      <img src={image || "./defaultUser.jpg"} className="h-full w-full object-cover" alt="image" />
    </div>
  );
};

export default ProfilePic;
