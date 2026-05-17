"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Copy from "../Copy/Copy";
import { asset } from "@/lib/assets";

import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const services = [
  { title: "Suspended Orbs", image: asset("/images/img6.png") },
  { title: "Buried Temples", image: asset("/images/img3.png") },
  { title: "Signal Relics", image: asset("/images/img7.png") },
  { title: "Broken Megastructures", image: asset("/images/img5.png") },
  { title: "Dead Sectors", image: asset("/images/img9.png") },
  { title: "Unknown Alloy", image: asset("/images/img10.png") },
];

export default function About() {
  const aboutRef = useRef(null);

  useGSAP(
    () => {
      const root = aboutRef.current;
      if (!root) return;

      const cards = gsap.utils.toArray(".about-service-card", root);
      if (!cards.length) return;

      gsap.set(cards, { y: 300, opacity: 0 });

      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".about-services-grid",
          start: "top 85%",
          once: true,
        },
      });

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) return;

      const parallaxLayers = gsap.utils.toArray(
        ".about-service-card-parallax",
        root,
      );

      parallaxLayers.forEach((layer, index) => {
        const direction = index % 2 === 0 ? 1 : -1;

        gsap.fromTo(
          layer,
          { yPercent: -5 * direction },
          {
            yPercent: 5 * direction,
            ease: "none",
            scrollTrigger: {
              trigger: layer.closest(".about-service-card"),
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      });
    },
    { scope: aboutRef },
  );

  return (
    <section className="about" ref={aboutRef}>
      <div className="container">
        <div className="about-wrapper">
          <div className="about-intro">
            <Copy variant="flicker">
              <p className="mono about-label">[ The Archive ]</p>
            </Copy>
  
            <Copy splitType="words">
              <h5 className="v2 about-title">
                A field archive of abandoned alien structures, suspended relics,
                and signals left inside forgotten planetary ruins.
              </h5>
            </Copy>
          </div>
  
          <div className="about-services">
          <div className="about-services-left">
  <div className="about-services-left-header">
    <Copy splitType="words">
      <h6 className="v2">
        Exploring forgotten ruins.
      </h6>
    </Copy>
  </div>

  <div className="about-services-left-copy">
    <div className="about-services-image">
      <img src={asset("/images/img4.png")} alt="Ancient alien structure" />
    </div>

    <p className="about-services-copy">
      Archived remains from dead civilizations.
    </p>
  </div>
</div>
  
            <div className="about-services-right">
              <Copy splitType="words">
                <h6 className="v2">Classifications</h6>
              </Copy>
  
              <div className="about-services-grid">
                {services.map((service, id) => (
                  <div className="about-service-card" key={service.title}>
                    <p className="mono sm">0{id + 1}</p>
                    <div className="about-service-card-media">
                      <div className="about-service-card-parallax">
                        <img
                          src={service.image}
                          alt={service.title}
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <p className="md">{service.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
