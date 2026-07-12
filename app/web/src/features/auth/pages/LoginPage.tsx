import { LoginForm } from "@/features/auth/components/LoginForm";
import { ProjectLogo } from "@/features/home/ProjectLogo";

const LoginPage = () => {
  return (
    <div className="bg-muted flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="fixed top-4 left-4">
        <ProjectLogo />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
