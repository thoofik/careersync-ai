import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry sign in | CareerSync AI",
  description: "Sign in to post jobs and match students",
};

export default function IndustrySignInPage() {
  return <AuthForm type="sign-in" portal="industry" />;
}
