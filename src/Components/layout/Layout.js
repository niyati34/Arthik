import React from "react";
import {
  MainLayout as MainLayoutStyled,
  InnerLayout as InnerLayoutStyled,
} from "./Layout.styles";

export function MainLayout({ children }) {
  return <MainLayoutStyled>{children}</MainLayoutStyled>;
}

export function InnerLayout({ children }) {
  return <InnerLayoutStyled>{children}</InnerLayoutStyled>;
}
