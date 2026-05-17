"use client";

import Preloader, { isInitialLoad } from "@/components/Preloader/Preloader";
import Showreel from "@/components/Showreel/Showreel";
import About from "@/components/About/About";
import FeaturedCards from "@/components/FeaturedCards/FeaturedCards";
import CTA from "@/components/CTA/CTA";
import Copy from "@/components/Copy/Copy";
import { asset } from "@/lib/assets";

import "./home.css";

export default function Home() {
  const heroDelay = isInitialLoad ? 7 : 0.5;

  return (
    <>
      <Preloader />

      <section className="hero">
        <div className="hero-img">
          <img src={asset("/images/img2.png")} alt="" />
        </div>

        <div className="container">
          <div className="hero-header">
            <Copy animateOnScroll={false} delay={heroDelay}>
              <h1 className="subheader">Last</h1>
              <h1>Signal</h1>
            </Copy>
          </div>
        </div>
      </section>

      <About />

      <Showreel />

      <CTA />

      <FeaturedCards />
    </>
  );
}
