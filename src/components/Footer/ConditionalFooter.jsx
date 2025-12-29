"use client";
import useAuth from "../../hooks/useAuth";
import Footer from "./footer";

export default function ConditionalFooter() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null;
  }

  return <Footer />;
}
