"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";

import { asset } from "@/lib/assets";

import "./chronicles.css";

gsap.registerPlugin(Observer, SplitText);

const chronicles = [
  {
    subtitle: "Orbital Collapse",
    title: "The Hollow Ring",
    image: asset("/images/img1.png"),
    tags: ["Megastructure", "Collapsed Orbit", "Ancient Alloy"],
    location: "Nethra Belt, Outer Sector",
    year: "Cycle 4821",
  },
  {
    subtitle: "Signal Monolith",
    title: "Kheir Vault",
    image: asset("/images/img2.png"),
    tags: ["Transmission", "Monolith", "Unknown Signal"],
    location: "Kheir Basin, Dead Frontier",
    year: "Cycle 3910",
  },
  {
    subtitle: "Suspended Core",
    title: "Orbs of Vaelor",
    image: asset("/images/img3.png"),
    tags: ["Levitation", "Orb Chamber", "Energy Field"],
    location: "Vaelor Depths, Inner Expanse",
    year: "Cycle 6024",
  },
  {
    subtitle: "Flooded Ruins",
    title: "Aethon Passage",
    image: asset("/images/img4.png"),
    tags: ["Submerged", "Ancient Route", "Corroded Stone"],
    location: "Aethon Rift, Western Reach",
    year: "Cycle 2740",
  },
  {
    subtitle: "Dead Frontier",
    title: "Nethra Expanse",
    image: asset("/images/img5.png"),
    tags: ["Deserted", "Storm Sector", "Buried Structures"],
    location: "Nethra Surface, Sector-09",
    year: "Cycle 5140",
  },
  {
    subtitle: "Collapsed Sanctuary",
    title: "Vault of Seruun",
    image: asset("/images/img6.png"),
    tags: ["Temple", "Ancient Core", "Dust Storms"],
    location: "Seruun Wastes, Southern Line",
    year: "Cycle 4332",
  },
  {
    subtitle: "The Fractured",
    title: "Eclipse of Vaarn",
    image: asset("/images/img7.png"),
    tags: ["Broken Orbit", "Dark Matter", "Unstable"],
    location: "Vaarn Divide, Upper Halo",
    year: "Cycle 7210",
  },
  {
    subtitle: "Buried Archive",
    title: "Chambers of Oryx",
    image: asset("/images/img8.png"),
    tags: ["Underground", "Data Vault", "Restricted"],
    location: "Oryx Depths, Black Sector",
    year: "Cycle 3688",
  },
  {
    subtitle: "The Isolated",
    title: "Maw of Teryn",
    image: asset("/images/img9.png"),
    tags: ["Void Rift", "Floating Debris", "Silent Zone"],
    location: "Teryn Shelf, Northern Scar",
    year: "Cycle 5901",
  },
  {
    subtitle: "Ancient Passage",
    title: "Corridors of Ishar",
    image: asset("/images/img10.png"),
    tags: ["Processional", "Light Shaft", "Stone Path"],
    location: "Ishar Canyon, Deep Interior",
    year: "Cycle 4450",
  },
];

function preloadImages(sources) {
  return Promise.all(
    sources.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        }),
    ),
  );
}

function ChroniclesTitleLink({ href, title }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      className={`chronicles-title-link${hovered ? " chronicles-title-link-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h1>{title}</h1>
      <span className="chronicles-title-underline" />
    </Link>
  );
}

export default function ChroniclesPage() {
  const chroniclesPageRef = useRef(null);
  const chroniclesSlidesRef = useRef(null);
  const chroniclesCurrentRef = useRef(0);
  const chroniclesAnimatingRef = useRef(false);
  const chroniclesObserverRef = useRef(null);
  const chroniclesTimelineRef = useRef(null);
  const chroniclesSplitsRef = useRef([]);
  const chroniclesActiveFlickerSplits = useRef([]);

  useEffect(() => {
    const chroniclesSlidesEl = chroniclesSlidesRef.current;
    if (!chroniclesSlidesEl) return;

    const chroniclesSlides = [
      ...chroniclesSlidesEl.querySelectorAll(".chronicles-slide"),
    ];
    const chroniclesDecos = [
      ...chroniclesSlidesEl.querySelectorAll(".chronicles-deco"),
    ];
    const chroniclesTotal = chroniclesSlides.length;

    chroniclesSplitsRef.current = chroniclesSlides.map((slide) => {
      const chroniclesH1s = slide.querySelectorAll(
        ".chronicles-slide-title-block h1",
      );
      const chroniclesSplitInstances = [...chroniclesH1s].map((h1) =>
        SplitText.create(h1, {
          type: "words",
          wordsClass: "chronicles-word",
        }),
      );
      return chroniclesSplitInstances;
    });

    function chroniclesGetAllWords(slideIndex) {
      return chroniclesSplitsRef.current[slideIndex].flatMap(
        (split) => split.words,
      );
    }

    function chroniclesGetSlideExtras(slide) {
      const year = slide.querySelector(".chronicles-slide-year");
      const location = slide.querySelector(".chronicles-slide-footer > .mono");
      const counter = slide.querySelector(".chronicles-slide-counter");
      const tags = [...slide.querySelectorAll(".chronicles-slide-tag")];

      return {
        flickerTargets: [year, location, counter].filter(Boolean),
        tags,
      };
    }

    function chroniclesRevertActiveFlicker() {
      chroniclesActiveFlickerSplits.current.forEach((split) => split.revert());
      chroniclesActiveFlickerSplits.current = [];
    }

    function chroniclesAnimateSlideExtras(slide, tl, startLabel) {
      chroniclesRevertActiveFlicker();

      const { flickerTargets, tags } = chroniclesGetSlideExtras(slide);

      const flickerSplits = flickerTargets.map((el) =>
        SplitText.create(el, {
          type: "chars",
          charsClass: "chronicles-flicker-char",
        }),
      );

      chroniclesActiveFlickerSplits.current = flickerSplits;

      const allFlickerChars = flickerSplits.flatMap((split) => split.chars);

      gsap.set(allFlickerChars, { opacity: 0 });
      gsap.set(tags, { y: 50, opacity: 0 });

      tl.to(
        allFlickerChars,
        {
          duration: 0.05,
          opacity: 1,
          ease: "power2.inOut",
          stagger: {
            amount: 0.5,
            each: 0.1,
            from: "random",
          },
        },
        startLabel,
      ).to(
        tags,
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.1,
        },
        `${startLabel}+=0.2`,
      );
    }

    function chroniclesResetAllSlides() {
      chroniclesSlides.forEach((slide, i) => {
        const chroniclesIsCurrent = i === chroniclesCurrentRef.current;
        gsap.set(slide, {
          scale: 1,
          rotation: 0,
          opacity: chroniclesIsCurrent ? 1 : 0,
          visibility: chroniclesIsCurrent ? "visible" : "hidden",
        });
        slide.classList.toggle("chronicles-slide-current", chroniclesIsCurrent);

        const chroniclesWords = chroniclesGetAllWords(i);
        gsap.set(chroniclesWords, {
          opacity: chroniclesIsCurrent ? 1 : 0,
          rotationX: chroniclesIsCurrent ? 0 : -90,
          transformOrigin: "50% 50% -50px",
        });
      });
      gsap.set(chroniclesDecos, { autoAlpha: 0, yPercent: 0 });
    }

    function chroniclesInit() {
      chroniclesResetAllSlides();

      const firstSlide = chroniclesSlides[0];
      const firstWords = chroniclesGetAllWords(0);

      gsap.set(firstWords, {
        opacity: 0,
        rotationX: -90,
        transformOrigin: "50% 50% -50px",
      });

      const introTl = gsap.timeline({ delay: 0.5 });

      introTl.to(firstWords, {
        rotationX: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: {
          each: 0.035,
          from: "random",
        },
      });

      chroniclesAnimateSlideExtras(firstSlide, introTl, 0.5);

      introTl.add(() => {
        chroniclesRevertActiveFlicker();
      });

      function chroniclesNavigate(direction) {
        if (chroniclesAnimatingRef.current) return;
        chroniclesAnimatingRef.current = true;

        if (chroniclesTimelineRef.current) {
          chroniclesTimelineRef.current.kill();
          chroniclesTimelineRef.current = null;
        }

        const previous = chroniclesCurrentRef.current;
        chroniclesCurrentRef.current =
          direction === 1
            ? chroniclesCurrentRef.current < chroniclesTotal - 1
              ? chroniclesCurrentRef.current + 1
              : 0
            : chroniclesCurrentRef.current > 0
              ? chroniclesCurrentRef.current - 1
              : chroniclesTotal - 1;

        const currentSlide = chroniclesSlides[previous];
        const upcomingSlide = chroniclesSlides[chroniclesCurrentRef.current];
        const chroniclesUpcomingWords = chroniclesGetAllWords(
          chroniclesCurrentRef.current,
        );

        gsap.set(upcomingSlide, {
          opacity: 0,
          scale: 1,
          rotation: 0,
          visibility: "visible",
        });
        gsap.set(chroniclesUpcomingWords, {
          opacity: 0,
          rotationX: -90,
          transformOrigin: "50% 50% -50px",
        });

        const chroniclesTl = gsap.timeline({
          defaults: {
            duration: 0.8,
            ease: "power3.inOut",
          },
          onComplete: () => {
            chroniclesRevertActiveFlicker();
            chroniclesResetAllSlides();
            chroniclesTimelineRef.current = null;
            chroniclesAnimatingRef.current = false;
          },
        });

        chroniclesTimelineRef.current = chroniclesTl;

        chroniclesTl
          .addLabel("start", 0)
          .fromTo(
            chroniclesDecos,
            {
              yPercent: (pos) => (pos ? -100 : 100),
              autoAlpha: 1,
            },
            {
              yPercent: (pos) => (pos ? -50 : 50),
            },
            "start",
          )
          .to(
            currentSlide,
            {
              scale: 1.35,
              rotation: direction * 5,
            },
            "start",
          )
          .addLabel("middle", ">")
          .add(() => {
            currentSlide.classList.remove("chronicles-slide-current");
            gsap.set(currentSlide, { opacity: 0, visibility: "hidden" });
            upcomingSlide.classList.add("chronicles-slide-current");
            gsap.set(upcomingSlide, { opacity: 1, visibility: "visible" });
          }, "middle")
          .to(
            chroniclesDecos,
            {
              duration: 1.1,
              ease: "expo",
              yPercent: (pos) => (pos ? -100 : 100),
            },
            "middle",
          )
          .fromTo(
            upcomingSlide,
            {
              scale: 1.35,
              rotation: direction * 5,
            },
            {
              duration: 1.1,
              ease: "expo",
              scale: 1,
              rotation: 0,
            },
            "middle",
          )
          .to(
            chroniclesUpcomingWords,
            {
              rotationX: 0,
              opacity: 1,
              duration: 0.75,
              ease: "power3.out",
              stagger: {
                each: 0.035,
                from: "random",
              },
            },
            "middle+=0.15",
          );

        chroniclesAnimateSlideExtras(
          upcomingSlide,
          chroniclesTl,
          "middle+=0.5",
        );
      }

      chroniclesObserverRef.current = Observer.create({
        type: "wheel,touch",
        onDown: () => chroniclesNavigate(-1),
        onUp: () => chroniclesNavigate(1),
        wheelSpeed: -1,
        tolerance: 10,
      });
    }

    preloadImages(chronicles.map((c) => c.image)).then(chroniclesInit);

    return () => {
      if (chroniclesTimelineRef.current) chroniclesTimelineRef.current.kill();
      if (chroniclesObserverRef.current) chroniclesObserverRef.current.kill();
      chroniclesSplitsRef.current.forEach((slideSplits) =>
        slideSplits.forEach((split) => split.revert()),
      );
      chroniclesRevertActiveFlicker();
    };
  }, []);

  const chroniclesTotal = String(chronicles.length).padStart(2, "0");

  return (
    <div className="chronicles-page" ref={chroniclesPageRef}>
      <div className="chronicles-slides" ref={chroniclesSlidesRef}>
        {chronicles.map((item, i) => (
          <div className="chronicles-slide" key={i}>
            <div
              className="chronicles-slide-img"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="chronicles-slide-content">
              <p className="mono chronicles-slide-year">{item.year}</p>
              <div className="chronicles-slide-title-block">
                <h1 className="subheader">{item.subtitle}</h1>
                <ChroniclesTitleLink href="/report" title={item.title} />
              </div>
              <div className="chronicles-slide-footer">
                <p className="mono sm">{item.location}</p>
                <div className="chronicles-slide-tags">
                  {item.tags.map((tag, j) => (
                    <span className="chronicles-slide-tag" key={j}>
                      <p className="mono sm">{tag}</p>
                    </span>
                  ))}
                </div>
                <p className="mono sm chronicles-slide-counter">
                  CHR {String(i + 1).padStart(2, "0")} / {chroniclesTotal}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="chronicles-deco"></div>
        <div className="chronicles-deco"></div>
      </div>
    </div>
  );
}
