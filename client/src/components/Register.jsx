import React, { useActionState, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/actions/userActions";

const Register = () => {
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [state, formAction, ispending] = useActionState(register, {
    success: null,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      console.log(state.success);
      setTimeout(() => {
        Navigate("/login");
      }, 2000);
    }
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  console.log(formData);

  return (
    <div className="h-screen flex justify-center items-center transform -translate-y-16">
      <form
        action={formAction}
        className="flex flex-col gap-6 max-w-xl w-full px-8"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="Email">Email</Label>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {state.success && (
          <span className="text-green-500 message">
            {state.success} {"Redirecting ..."}
          </span>
        )}
        {state.error && (
          <span className="text-red-500 message">
            {state.error} {"Redirecting ..."}
          </span>
        )}
        <Button disabled={ispending} type="submit">
          {ispending ? "Loading..." : "Register"}
        </Button>
        <span className="text-center text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="transition ease-in-out hover:cursor-pointer hover:text-primary hover:underline"
          >
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
