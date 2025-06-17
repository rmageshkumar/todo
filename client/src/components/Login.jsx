import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="h-screen flex justify-center items-center transform -translate-y-16">
      <form className="flex flex-col gap-6 max-w-xl w-full px-8">
        <div className="flex flex-col gap-2">
          <Label htmlFor="Email">Email</Label>
          <Input id="email" type="email" name="email" placeholder="Email" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Password" />
        </div>
        <Button type="submit">Login</Button>
        <span className="text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="transition ease-in-out hover:cursor-pointer hover:text-primary hover:underline"
          >
            Register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
