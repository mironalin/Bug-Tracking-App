import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, redirect, useNavigate } from "@tanstack/react-router";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { ErrorContext } from "@better-fetch/fetch";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Minimum of 8 characters required."),
});

export const SignUpCard = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleCredentialsSignUp = async (values: z.infer<typeof formSchema>) => {
    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          navigate({ to: "/sign-in" });
        },
        onError: (ctx) => {
          setPending(false);
          toast.error(ctx.error.message + "!");
        },
      }
    );
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
        onError: (ctx: ErrorContext) => {
          setPending(false);
          toast.error(ctx.error.message + "!");
        },
      }
    );
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form.formState, form.reset]);

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up!</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link>
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link>
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCredentialsSignUp)} className="space-y-4">
            <FormField
              disabled={pending}
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Enter your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              disabled={pending}
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your email address" />
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
                    <Input {...field} type="password" placeholder="Enter your password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={pending} size="lg" className="w-full">
              Sign up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
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
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Already have an account?
          <Link to="/sign-in">
            <span className="text-blue-700">&nbsp;Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
