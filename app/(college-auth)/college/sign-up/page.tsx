import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College sign up | CareerSync AI",
  description: "Create a college account to monitor campus outcomes",
};

export default function CollegeSignUpPage() {
  return <AuthForm type="sign-up" portal="college" />;
}
