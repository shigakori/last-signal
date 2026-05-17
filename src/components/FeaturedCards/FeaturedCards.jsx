"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "../Button/Button";
import Copy from "../Copy/Copy";
import { asset } from "@/lib/assets";

import "./FeaturedCards.css";

gsap.registerPlugin(ScrollTrigger);



const FEATURED_CARDS_DATA = [

  {

    subtitle: "Orbital Collapse",

    title: "The Hollow Ring",

    image: asset("/images/img1.png"),

  },

  {

    subtitle: "Signal Monolith",

    title: "Kheir Vault",

    image: asset("/images/img2.png"),

  },

  {

    subtitle: "Suspended Core",

    title: "Orbs of Vaelor",

    image: asset("/images/img3.png"),

  },

  {

    subtitle: "Flooded Ruins",

    title: "Aethon Passage",

    image: asset("/images/img4.png"),

  },

  {

    subtitle: "Dead Frontier",

    title: "Nethra Expanse",

    image: asset("/images/img5.png"),

  },

];

export default function FeaturedCards() {
  const featuredCardsRef = useRef(null);
  const featuredCardsContainerRef = useRef(null);

  useGSAP(
    () => {
      const section = featuredCardsRef.current;
      const cards =
        featuredCardsContainerRef.current?.querySelectorAll(".featured-card");

      if (!section || !cards?.length) return;

      let featuredCardsTrigger;

      function setup() {
        cleanup();

        cards.forEach((card) => gsap.set(card, { clearProps: "all" }));

        if (window.innerWidth < 1000) return;

        const totalCards = cards.length;

        featuredCardsTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${window.innerHeight * totalCards}px`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress * totalCards;

            cards.forEach((card, i) => {
              const cardProgress = gsap.utils.clamp(0, 1, progress - i);
              const nextCardProgress = gsap.utils.clamp(
                0,
                1,
                progress - (i + 1),
              );

              gsap.set(card, {
                y: gsap.utils.interpolate("200%", "-50%", cardProgress),
                scale: gsap.utils.interpolate(1, 0.85, nextCardProgress),
                "--overlay-opacity": gsap.utils.interpolate(
                  0,
                  1,
                  nextCardProgress * 0.5,
                ),
              });
            });
          },
        });
      }

      function cleanup() {
        featuredCardsTrigger?.kill();
        featuredCardsTrigger = null;
      }

      setup();

      let featuredCardsResizeTimer;
      const handleFeaturedCardsResize = () => {
        clearTimeout(featuredCardsResizeTimer);
        featuredCardsResizeTimer = setTimeout(setup, 250);
      };

      window.addEventListener("resize", handleFeaturedCardsResize);

      return () => {
        cleanup();
        clearTimeout(featuredCardsResizeTimer);
        window.removeEventListener("resize", handleFeaturedCardsResize);
      };
    },
    { scope: featuredCardsRef },
  );

  return (

    <section className="featured-cards" ref={featuredCardsRef}>
  
      <div className="container">
  
        <div className="featured-cards-wrapper">
  
          <div className="featured-cards-header">
  
            <Copy variant="flicker">
  
              <p className="mono">[ Archived Sectors ]</p>
  
            </Copy>
  
            <Copy splitType="words">
  
              <h5 className="v2">
  
                Recovered locations from collapsed civilizations
  
              </h5>
  
            </Copy>
  
            <Copy variant="slide" delay={0.5}>
  
              <Button href="/chronicles">Open Archive</Button>
  
            </Copy>
  
          </div>
  
          <div
  
            className="featured-cards-container"
  
            ref={featuredCardsContainerRef}
  
          >
  
            {FEATURED_CARDS_DATA.map((card) => (
  
              <div className="featured-card" key={card.title}>
  
                <div className="featured-card-img">
  
                  <img src={card.image} alt="" />
  
                </div>
  
                <div className="featured-card-content">
  
                  <h6 className="subheader">{card.subtitle}</h6>
  
                  <h5>{card.title}</h5>
  
                </div>
  
              </div>
  
            ))}
  
          </div>
  
        </div>
  
      </div>
  
    </section>
  
  );
}
