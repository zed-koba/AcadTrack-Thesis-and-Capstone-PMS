import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiUrl } from "../components/common/http";
import { ToastContainer, toast, Bounce } from "react-toastify";
import {
  Mail,
  Lock,
  SquareUser,
  GraduationCap,
  LibraryBig,
} from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
interface RegistrationForm {
  email: string;
  role: string;
  password: string;
  program: string;
  section: string;
  student_id: string;
}

interface ServerValidationError {
  status: number;
  errors: Record<string, string[]>;
}
const Registration = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationForm>();

  const onSubmit = async (data: RegistrationForm) => {
    const res = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.status == 422) {
      const errors = result.errors as Record<string, string[]>;
      Object.values(errors).forEach((fieldMessages) =>
        fieldMessages.forEach((msg) => toast.error(msg, { theme: "colored" }))
      );
    }
    if (result.status == 200) {
      toast.success(result.message);
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="h-screen w-full flex justify-center items-center">
        <div className="bg-card flex flex-col gap-2 rounded-lg w-lg h-auto p-6 border shadow-sm">
          <h2 className="text-white font-bold text-3xl w-auto text-center">
            Registration
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1 col-span-2">
              <p className="text-muted-foreground text-base">Email</p>
              <InputGroup className="text-white">
                <InputGroupInput
                  {...register("email", {
                    required: "The email field is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`text-base ${
                    errors.email && "border-destructive"
                  }`}
                  type="email"
                  placeholder="Enter your email"
                  required
                />
                <InputGroupAddon>
                  <Mail />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-base">Student ID</p>
              <InputGroup className="text-white">
                <InputGroupInput
                  {...register("student_id")}
                  className="text-base"
                  type="text"
                  placeholder="22-XXXXXX"
                  required
                />
                <InputGroupAddon>
                  <SquareUser />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-base">Password</p>
            <InputGroup className="text-white">
              <InputGroupInput
                {...register("password")}
                className="text-base"
                type="password"
                placeholder="Enter your password"
                required
              />
              <InputGroupAddon>
                <Lock />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-base">Program</p>
              <InputGroup className="text-white">
                <InputGroupInput
                  {...register("program")}
                  className="text-base"
                  type="text"
                  placeholder="ex: BSCS"
                  required
                />
                <InputGroupAddon>
                  <GraduationCap />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-muted-foreground text-base">Section</p>
              <InputGroup className="text-white">
                <InputGroupInput
                  {...register("section")}
                  className="text-base"
                  type="text"
                  placeholder="ex: CS801P"
                  required
                />
                <InputGroupAddon>
                  <LibraryBig />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
          <Button variant="primary" className="cursor-pointer mt-2">
            Register
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Registration;
