import AccountRegisterForm from "@/components/account/account-register-form";

export default function Page(): JSX.Element {
  return (
    <main className="min-w-screen flex h-full min-h-screen w-full items-center justify-center bg-black">
      <AccountRegisterForm />
    </main>
  );
}
