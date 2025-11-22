"use client";
import React from "react";
import TopNav from "./topnav";
import BottomNav from "./bottmnav";
import SellerNav from "../SellerDahsboard/sellerNavbar/sellerNav";
import useAuth from "../../hooks/useAuth";
const NavBar = () => {
  const { role } = useAuth();
  console.log("role", role);
  return role === "VENDOR" ? <SellerNav /> : (<><TopNav /><BottomNav /></>);
};

export default NavBar;
