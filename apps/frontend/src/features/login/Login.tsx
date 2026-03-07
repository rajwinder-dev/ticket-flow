import { Background1 } from "../../components/ui/Background";
import LoginForm from "../../components/ui/LoginForm";

function Login() {
  return (
    <>
      <div className="absolute top-1/2 left-1/2 z-10 flex w-[30rem] -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-xl bg-white px-16 py-8 shadow-lg">
        <h1 className="absolute -top-14 left-1/2 -translate-x-1/2 text-center text-xl font-bold text-gray-600">
          Welcome to Human Resource Management
        </h1>
        <LoginForm />
        <p className="text-center text-gray-400">
          Forget your Password?{" "}
          {/* <Link href="/signup" className="text-blue2">
            Reset Now
          </Link> */}
        </p>
      </div>
      <Background1 />
    </>
  );
}

export default Login;
