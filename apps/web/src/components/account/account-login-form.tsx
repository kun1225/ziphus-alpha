'use client';
import { Typography, Input, Button } from '@/components/material-tailwind';
import { type AccountLoginWithEmailRequestDTO, type AccountLoginWithEmailResponseDTO } from '@repo/shared-types';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from '@/utils/axios';
import { toast } from 'sonner';
import { setCookie } from 'cookies-next';
import Link from 'next/link';

async function fetchAccountLoginWithEmail(data: AccountLoginWithEmailRequestDTO) {
  return await axios.post<AccountLoginWithEmailResponseDTO>('/account/login-with-email', data);
}

function AccountLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountLoginWithEmailRequestDTO>();
  const mutation = useMutation({
    mutationFn: fetchAccountLoginWithEmail,
    onSuccess: (response) => {
      const authorization = response.data.authorization;
      setCookie('authorization', authorization);
      toast.success('Login success');
    },
    onError: (error: any) => {
      if (error.response.data.message) {
        return toast.error(error.response.data.message);
      }
      toast.error('發生錯誤，請檢查控制台');
    },
  });
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={onSubmit}>
      <div className="mb-1 flex flex-col gap-6">
        <Typography variant="h4" className="-mb-3 text-white">
          Login
        </Typography>
        <Typography variant="h6" className="-mb-3 text-blue-gray-100">
          Your Email
        </Typography>
        <Input
          size="lg"
          placeholder="name@mail.com"
          className='!border-t-blue-gray-900 focus:!border-t-gray-200 text-white'
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          {...register('email', {
            required: '請輸入電子郵件',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: '請輸入正確的電子郵件格式',
            },
          })}
        />
        {errors.email?.message && (
          <Typography variant="paragraph" color="red" className="text-sm">
            {errors.email.message}
          </Typography>
        )}
        <Typography variant="h6" className="-mb-3 text-blue-gray-100">
          Password
        </Typography>
        <Input
          type="password"
          size="lg"
          placeholder="********"
          className='!border-t-blue-gray-900 focus:!border-t-gray-200 text-white'
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          {...register('password', {
            required: '請輸入密碼',
            minLength: {
              value: 6,
              message: '密碼長度至少 6 個字元',
            },
          
          })}
        />
        {errors.password?.message && (
          <Typography variant="paragraph" color="red" className="text-sm">
            {errors.password.message}
          </Typography>
        )}
      </div>
      <Button className="mt-6" fullWidth size="lg" type="submit">
        sign in
      </Button>
      <Typography color="gray" className="mt-4 text-center font-normal  text-blue-gray-100">
        Do not have an account?{' '}
        <Link className="font-medium text-blue-gray-200" href='/register'>
          Sign up
        </Link>
      </Typography>
    </form>
  );
}

export default AccountLoginForm;
