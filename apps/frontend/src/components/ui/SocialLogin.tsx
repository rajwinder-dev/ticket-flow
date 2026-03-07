import { FacebookIcon, GoogleIcon, LinkedIn, XIcon } from "./ColoredIcons";

function SocialLogin() {
  return (
    <div className="mb-4 flex justify-center gap-4">
      <div className="bg-lightWhite flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-md">
        <GoogleIcon />
      </div>
      <div className="bg-lightWhite flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-md">
        <FacebookIcon />
      </div>
      <div className="bg-lightWhite flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-md">
        <XIcon />
      </div>
      <div className="bg-lightWhite flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-md">
        <LinkedIn />
      </div>
    </div>
  );
}

export default SocialLogin;
