import AuthForm from "./AuthForm";

export const metadata = {
  title: "DevForge // access terminal",
  description: "Log in or sign up to DevForge.",
};

export default function AuthPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <AuthForm />
    </div>
  );
}
