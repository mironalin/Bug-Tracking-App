import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";

import { Link, useNavigate } from "@tanstack/react-router";
import { DottetSeparator } from "@/components/dotted-separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { ErrorContext } from "@better-fetch/fetch";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Required"),
});

export const SignInCard = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleCredentialsSignIn = async (values: z.infer<typeof formSchema>) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          navigate({ to: "/" });
        },
        onError: (ctx: ErrorContext) => {
          toast.error(ctx.error.message + "!");
        },
      }
    );
    setPending(false);
  };

  const handleSignInWithGithub = async () => {
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {},
        onError: (ctx: ErrorContext) => {
          toast.error(ctx.error.message + "!");
        },
      }
    );
    setPending(false);
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottetSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCredentialsSignIn)} className="space-y-4">
            <FormField
              disabled={pending}
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={pending}
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={pending} size="lg" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottetSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button disabled={pending} variant="secondary" size="lg" className="w-full">
          <FcGoogle className="size-7" />
          Login with Google
        </Button>
        <Button onClick={handleSignInWithGithub} disabled={pending} variant="secondary" size="lg" className="w-full">
          <FaGithub className="size-7" />
          Login with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottetSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Don't have an account?
          <Link to="/sign-up">
            <span className="text-blue-700">&nbsp;Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
