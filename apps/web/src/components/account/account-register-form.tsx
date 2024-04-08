"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { toast } from "sonner";
import {
  type AccountRegisterRequestDTO,
  type AccountRegisterResponseDTO,
} from "@repo/shared-types";
import { useMutation } from "@tanstack/react-query";
import { Input, Button } from "@/components/nextui";
import axiosInstance from "@/utils/axios";

async function fetchAccountRegister(data: AccountRegisterRequestDTO) {
  return await axiosInstance.post<AccountRegisterResponseDTO>(
    "/account/register",
    data
  );
}

function AccountRegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountRegisterRequestDTO>();
  const mutation = useMutation({
    mutationKey: ["account", "register"],
    mutationFn: fetchAccountRegister,
    onSuccess: (response) => {
      const authorization = response.data.authorization;
      setCookie("authorization", authorization);
      toast.success("Login success");
      axiosInstance.defaults.headers.authorization = authorization;
      router.push("/spaces");
    },
    onError: (error: any) => {
      if (error.response.data.message) {
        return toast.error(error.response.data.message);
      }
      toast.error("發生錯誤，請檢查控制台");
    },
  });
  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form
      className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96"
      onSubmit={onSubmit}
    >
      <div className="mb-1 flex flex-col gap-6">
        <h4 className="-mb-3 text-white">Create an account</h4>
        <h6 className="text-blue-gray-100 -mb-3">Your Email</h6>
        <Input
          size="lg"
          placeholder="name@mail.com"
          className="!border-t-blue-gray-900 text-white focus:!border-t-gray-200"
          {...register("email", {
            required: "請輸入電子郵件",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "請輸入正確的電子郵件格式",
            },
          })}
        />
        {errors.email?.message && (
          <p color="red" className="text-sm">
            {errors.email.message}
          </p>
        )}
        <h6 className="text-blue-gray-100 -mb-3">Name</h6>
        <Input
          size="lg"
          placeholder="name"
          className="!border-t-blue-gray-900 text-white focus:!border-t-gray-200"
          {...register("name", {
            required: "請輸入名稱",
          })}
        />
        {errors.name?.message && (
          <p color="red" className="text-sm">
            {errors.name.message}
          </p>
        )}
        <h6 className="text-blue-gray-100 -mb-3">Password</h6>
        <Input
          type="password"
          size="lg"
          placeholder="********"
          className="!border-t-blue-gray-900 text-white focus:!border-t-gray-200"
          {...register("password", {
            required: "請輸入密碼",
            minLength: {
              value: 6,
              message: "密碼長度至少 6 個字元",
            },
          })}
        />
        {errors.password?.message && (
          <p color="red" className="text-sm">
            {errors.password.message}
          </p>
        )}
      </div>
      <Button className="mt-6" fullWidth size="lg" type="submit">
        sign up
      </Button>
      <p
        color="gray"
        className="text-blue-gray-100 mt-4 text-center  font-normal"
      >
        Already have an account?{" "}
        <Link className="text-blue-gray-200 font-medium" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default AccountRegisterForm;
