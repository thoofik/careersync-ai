import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry sign up | CareerSync AI",
  description: "Create an industry account to post listings and match students",
};

export default function IndustrySignUpPage() {
  return <AuthForm type="sign-up" portal="industry" />;
}
