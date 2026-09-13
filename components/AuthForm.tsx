"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";
import BrandLogo from "@/components/BrandLogo";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({
  type,
  portal = "student",
}: {
  type: FormType;
  portal?: UserPortal;
}) => {
  const router = useRouter();
  const home =
    portal === "industry" ? "/industry" : portal === "college" ? "/college" : "/";
  const signInHref =
    portal === "industry"
      ? "/industry/sign-in"
      : portal === "college"
        ? "/college/sign-in"
        : "/sign-in";
  const signUpHref =
    portal === "industry"
      ? "/industry/sign-up"
      : portal === "college"
        ? "/college/sign-up"
        : "/sign-up";

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
          portal,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push(signInHref);
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        const result = await signIn({
          email,
          idToken,
          portal,
        });

        if (!result?.success) {
          toast.error(result?.message || "Sign in Failed. Please try again.");
          return;
        }

        toast.success("Signed in successfully.");
        router.push(home);
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <Card className="max-w-lg mx-auto dark:bg-card dark:border-border dark:text-card-foreground">
      <CardHeader className="items-center text-center gap-2">
        <BrandLogo size="lg" />
        <CardTitle className="text-2xl text-foreground dark:text-card-foreground">
          {portal === "industry"
            ? isSignIn
              ? "Industry sign in"
              : "Industry account"
            : portal === "college"
              ? isSignIn
                ? "College sign in"
                : "College account"
              : isSignIn
                ? "Welcome Back"
                : "Create Account"}
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-card-foreground/70">
          {portal === "industry"
            ? isSignIn
              ? "Post jobs, match students, then shortlist or mentor"
              : "Create an industry account to post listings"
            : portal === "college"
              ? isSignIn
                ? "Monitor skills, internships, placements, and industry demand"
                : "Create a college account to monitor campus outcomes"
              : isSignIn
                ? "Sign in to keep practicing"
                : "Make an account and start a mock"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            {isSignIn && (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors dark:text-primary dark:hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            <Button
              className="w-full py-3 text-base font-semibold dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  {isSignIn ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                isSignIn ? "Sign In" : "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6 text-sm text-muted-foreground dark:text-card-foreground/60">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <Link
            href={!isSignIn ? signInHref : signUpHref}
            className="text-primary hover:text-primary/80 font-semibold ml-1 transition-colors dark:text-primary dark:hover:text-primary/80"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </div>
        <p className="text-center mt-4 text-sm text-muted-foreground space-x-3">
          {portal !== "student" && (
            <Link href="/sign-in" className="text-primary font-semibold">
              Student
            </Link>
          )}
          {portal !== "industry" && (
            <Link href="/industry/sign-in" className="text-primary font-semibold">
              Industry
            </Link>
          )}
          {portal !== "college" && (
            <Link href="/college/sign-in" className="text-primary font-semibold">
              College
            </Link>
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default AuthForm;