import AccountLoginForm from '@/components/account/account-login-form';

export default function Page (): JSX.Element {
  return (
    <main className='min-w-screen min-h-screen w-full h-full flex justify-center items-center bg-black'>
      <AccountLoginForm />
    </main>
  );
}
