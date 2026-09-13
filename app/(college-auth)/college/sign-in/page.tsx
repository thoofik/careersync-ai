import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College sign in | CareerSync AI",
  description: "Monitor campus skills, internships, and placements",
};

export default function CollegeSignInPage() {
  return <AuthForm type="sign-in" portal="college" />;
}
