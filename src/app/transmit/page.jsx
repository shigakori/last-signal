"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Copy from "@/components/Copy/Copy";
import { asset } from "@/lib/assets";

import "./transmit.css";

gsap.registerPlugin(ScrollTrigger);
const transmitCards = [
  {
    id: "transmit-card-1",
    image: asset("/transmit/transmit-1.jpeg"),
    index: "01",
    label: "GitHub Archive",
    value: "github.com/shigakori",
    href: "https://github.com/shigakori",
    label2: "Repository Access",
    value2: "Open Source Logs",
  },
  {
    id: "transmit-card-2",
    image: asset("/transmit/transmit-2.jpeg"),
    index: "02",
    label: "Direct Transmission",
    value: "t.me/accccide",
    href: "https://t.me/accccide",
    label2: "Communication Channel",
    value2: "Encrypted Contact Line",
  },
  {
    id: "transmit-card-3",
    image: asset("/transmit/transmit-3.jpeg"),
    index: "03",
    label: "Signal Address",
    value: "shigakori@gmail.com",
    href: "mailto:shigakori@gmail.com",
    label2: "Response State",
    value2: "Active Monitoring",
  },
];

const MOBILE_BREAKPOINT = 1000;

export default function TransmitPage() {
  const transmitStickyRef = useRef(null);
  const transmitContainerRef = useRef(null);
  const transmitHeaderRef = useRef(null);
  const transmitGapCompleted = useRef(false);
  const transmitFlipCompleted = useRef(false);

  useGSAP(
    () => {
      const transmitSection = transmitStickyRef.current;
      const transmitContainer = transmitContainerRef.current;
      const transmitHeader = transmitHeaderRef.current;
      if (!transmitSection || !transmitContainer || !transmitHeader) return;

      const transmitCardEls = [
        ...transmitSection.querySelectorAll(".transmit-card"),
      ];
      const transmitCard1 = transmitSection.querySelector("#transmit-card-1");
      const transmitCard2 = transmitSection.querySelector("#transmit-card-2");
      const transmitCard3 = transmitSection.querySelector("#transmit-card-3");

      let transmitScrollTrigger;

      function setup() {
        cleanup();

        transmitCardEls.forEach((card) =>
          gsap.set(card, { clearProps: "all" }),
        );
        gsap.set(transmitContainer, { clearProps: "all" });
        gsap.set(transmitHeader, { clearProps: "all" });

        transmitGapCompleted.current = false;
        transmitFlipCompleted.current = false;

        if (window.innerWidth < MOBILE_BREAKPOINT) return;

        gsap.set(transmitHeader, { y: 40, opacity: 0 });

        transmitScrollTrigger = ScrollTrigger.create({
          trigger: transmitSection,
          start: "top top",
          end: `+=${window.innerHeight * 4}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
            const transmitProgress = self.progress;

            if (transmitProgress >= 0.1 && transmitProgress <= 0.25) {
              const transmitHeaderProgress = gsap.utils.mapRange(
                0.1,
                0.25,
                0,
                1,
                transmitProgress,
              );
              gsap.set(transmitHeader, {
                y: gsap.utils.mapRange(0, 1, 40, 0, transmitHeaderProgress),
                opacity: transmitHeaderProgress,
              });
            } else if (transmitProgress < 0.1) {
              gsap.set(transmitHeader, { y: 40, opacity: 0 });
            } else {
              gsap.set(transmitHeader, { y: 0, opacity: 1 });
            }

            if (transmitProgress <= 0.25) {
              const transmitWidth = gsap.utils.mapRange(
                0,
                0.25,
                80,
                60,
                transmitProgress,
              );
              gsap.set(transmitContainer, { width: `${transmitWidth}%` });
            } else {
              gsap.set(transmitContainer, { width: "60%" });
            }

            if (transmitProgress >= 0.35 && !transmitGapCompleted.current) {
              gsap.to(transmitContainer, {
                gap: "16px",
                duration: 0.5,
                ease: "power3.out",
              });
              gsap.to(transmitCardEls, {
                borderRadius: "12px",
                duration: 0.5,
                ease: "power3.out",
              });
              transmitGapCompleted.current = true;
            } else if (
              transmitProgress < 0.35 &&
              transmitGapCompleted.current
            ) {
              gsap.to(transmitContainer, {
                gap: "0px",
                duration: 0.5,
                ease: "power3.out",
              });
              gsap.to(transmitCard1, {
                borderRadius: "12px 0 0 12px",
                duration: 0.5,
                ease: "power3.out",
              });
              gsap.to(transmitCard2, {
                borderRadius: "0px",
                duration: 0.5,
                ease: "power3.out",
              });
              gsap.to(transmitCard3, {
                borderRadius: "0 12px 12px 0",
                duration: 0.5,
                ease: "power3.out",
              });
              transmitGapCompleted.current = false;
            }

            if (transmitProgress >= 0.7 && !transmitFlipCompleted.current) {
              gsap.to(transmitCardEls, {
                rotationY: 180,
                duration: 0.75,
                ease: "power3.inOut",
                stagger: 0.1,
              });
              gsap.to([transmitCard1, transmitCard3], {
                y: 30,
                rotationZ: (i) => [-12, 12][i],
                duration: 0.75,
                ease: "power3.inOut",
              });
              transmitFlipCompleted.current = true;
            } else if (
              transmitProgress < 0.7 &&
              transmitFlipCompleted.current
            ) {
              gsap.to(transmitCardEls, {
                rotationY: 0,
                duration: 0.75,
                ease: "power3.inOut",
                stagger: -0.1,
              });
              gsap.to([transmitCard1, transmitCard3], {
                y: 0,
                rotationZ: 0,
                duration: 0.75,
                ease: "power3.inOut",
              });
              transmitFlipCompleted.current = false;
            }
          },
        });
      }

      function cleanup() {
        transmitScrollTrigger?.kill();
        transmitScrollTrigger = null;
      }

      setup();

      let transmitResizeTimer;
      const handleTransmitResize = () => {
        clearTimeout(transmitResizeTimer);
        transmitResizeTimer = setTimeout(setup, 250);
      };

      window.addEventListener("resize", handleTransmitResize);

      return () => {
        cleanup();
        clearTimeout(transmitResizeTimer);
        window.removeEventListener("resize", handleTransmitResize);
      };
    },
    { scope: transmitStickyRef },
  );

  return (
    <>
      <section className="transmit-hero">
        <div className="container">
          <div className="transmit-hero-header">
            <Copy animateOnScroll={false} delay={0.65}>
              <h1 className="subheader">Coordinates</h1>
              <h1>Open Channel</h1>
            </Copy>
          </div>
          <div className="transmit-hero-footer">
            <Copy variant="flicker" delay={0.85} animateOnScroll={false}>
              <p className="mono sm">Field Office 01</p>
            </Copy>
            <Copy variant="flicker" delay={0.85} animateOnScroll={false}>
              <p className="mono sm">[ Frequency active ]</p>
            </Copy>
          </div>
        </div>
      </section>

      <section className="transmit-sticky" ref={transmitStickyRef}>
        <div className="container">
          <div className="transmit-sticky-header" ref={transmitHeaderRef}>
            <h6 className="v2">Three channels, one frequency</h6>
          </div>

          <div className="transmit-card-container" ref={transmitContainerRef}>
            {transmitCards.map((card) => (
              <div className="transmit-card" id={card.id} key={card.id}>
                <div className="transmit-card-front">
                  <img src={card.image} alt={card.label} />
                </div>
                <div className="transmit-card-back">
                  <span className="transmit-card-index">[ {card.index} ]</span>
                  <div className="transmit-card-info">
                    <div className="transmit-card-block">
                      <p className="mono sm">{card.label}</p>
                      <a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="lg">{card.value}</p>
                      </a>
                    </div>
                    <div className="transmit-card-block">
                      <p className="mono sm">{card.label2}</p>
                      <p className="lg">{card.value2}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
