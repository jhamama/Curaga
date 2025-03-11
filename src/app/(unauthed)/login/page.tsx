import { SignInButton } from "@/app/components/Authentication/SignIn";

export default function Login() {
  return (
    <main>
      <div>You have are not currently signed in, please sign in</div>
      <button className="btn btn-sm mr-2 mt-4 font-normal capitalize">
        <SignInButton authUrl={process.env.NEXT_PUBLIC_AUTH_URL ?? ""} />
      </button>
    </main>
  );
}
