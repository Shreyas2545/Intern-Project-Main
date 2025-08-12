import React from "react";
import Category from "./HomePage/Category";
import Content from "./HomePage/Content";
import Explore from "./HomePage/Explore";
import Info from "./HomePage/Info";
import Popular from "./HomePage/Popular";
import HomePromo from "./HomePage/HomePromo";
import HomeSlider from "./HomePage/HomeSlider";

export default function Home() {
  return (
    <>
      <HomeSlider />
      <Category />
      <Content />
      <Popular />
      <HomePromo />
      <Explore />
      <Info />
    </>
  );
}
