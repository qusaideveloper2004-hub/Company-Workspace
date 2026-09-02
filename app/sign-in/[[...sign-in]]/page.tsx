import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <SignIn
        path="/sign-in"
        routing="path"
        fallbackRedirectUrl="/dashboard"
      />
    </main>
  );
}
