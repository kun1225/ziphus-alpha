import AccountRegisterForm from '@/components/account/account-register-form';

export default function Page (): JSX.Element {
  return (
    <main className='min-w-screen min-h-screen w-full h-full flex justify-center items-center bg-black'>
      <AccountRegisterForm />
    </main>
  );
}
