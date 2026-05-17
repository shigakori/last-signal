"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button/Button";
import Copy from "@/components/Copy/Copy";
import { asset } from "@/lib/assets";

import "./report.css";

gsap.registerPlugin(ScrollTrigger);

const REPORT_WIPE_START_ANGLE = 225;

const reportImages = [
  { src: asset("/images/img1.png"), compassRotation: 0 },
  { src: asset("/images/img2.png"), compassRotation: 84 },
  { src: asset("/images/img7.png"), compassRotation: -30 },
  { src: asset("/images/img4.png"), compassRotation: 105 },
  { src: asset("/images/img10.png"), compassRotation: 130 },
];

const reportDataBlocks = [
  [
    {
      label: "Classification",
      value: "Ancient Orbital Relic",
      position: "top-left",
    },
    {
      label: "Structures Recorded",
      value: "12 fragmented ruins",
      position: "bottom-right",
    },
  ],
  [
    {
      label: "Signal Activity",
      value: "Low-frequency pulses detected",
      position: "top-right",
    },
  ],
  [
    {
      label: "Atmospheric Density",
      value: "Dense ash and ion storms",
      position: "bottom-left",
    },
  ],
  [
    {
      label: "Surface Condition",
      value: "Severe erosion across sectors",
      position: "top-left",
    },
    {
      label: "Biological Presence",
      value: "No confirmed lifeforms",
      position: "bottom-right",
    },
  ],
  [
    {
      label: "Power Source",
      value: "Unknown core remains active",
      position: "top-right",
    },
  ],
];
const REPORT_SVG_NS = "http://www.w3.org/2000/svg";
const REPORT_COMPASS_SIZE = 600;
const REPORT_COMPASS_CENTER = 300;

function reportCreateTick(degree) {
  const reportIsMajor = degree === 0 || degree % 30 === 0;
  const reportTick = document.createElementNS(REPORT_SVG_NS, "line");
  reportTick.setAttributeNS(null, "x1", REPORT_COMPASS_CENTER);
  reportTick.setAttributeNS(null, "y1", 15);
  reportTick.setAttributeNS(null, "x2", REPORT_COMPASS_CENTER);
  reportTick.setAttributeNS(null, "y2", reportIsMajor ? 60 : 45);
  reportTick.setAttributeNS(null, "stroke", "var(--base-100)");
  reportTick.setAttributeNS(null, "stroke-width", reportIsMajor ? 2 : 1);
  reportTick.setAttributeNS(null, "stroke-opacity", reportIsMajor ? 1 : 0.25);
  reportTick.setAttributeNS(
    null,
    "transform",
    `rotate(${degree}, ${REPORT_COMPASS_CENTER}, ${REPORT_COMPASS_CENTER})`,
  );
  return reportTick;
}

function reportCreateDegreeLabel(degree) {
  const reportLabel = document.createElementNS(REPORT_SVG_NS, "text");
  reportLabel.setAttributeNS(null, "x", REPORT_COMPASS_CENTER);
  reportLabel.setAttributeNS(null, "y", 80);
  reportLabel.setAttributeNS(null, "font-size", "12px");
  reportLabel.setAttributeNS(null, "font-family", "DMMono, monospace");
  reportLabel.setAttributeNS(null, "fill", "var(--base-100)");
  reportLabel.setAttributeNS(null, "text-anchor", "middle");
  reportLabel.setAttributeNS(
    null,
    "transform",
    `rotate(${degree}, ${REPORT_COMPASS_CENTER}, ${REPORT_COMPASS_CENTER})`,
  );
  reportLabel.appendChild(document.createTextNode(degree));
  return reportLabel;
}

export default function FieldReportPage() {
  const reportSectionRef = useRef(null);
  const reportCompassRef = useRef(null);

  useGSAP(
    () => {
      const reportSection = reportSectionRef.current;
      const reportCompassSvg = reportCompassRef.current;
      if (!reportSection || !reportCompassSvg) return;

      const reportLayers = [...reportSection.querySelectorAll(".report-img")];
      const reportWiperHand = reportSection.querySelector(".report-wiper-hand");
      const reportWiperFixed = reportSection.querySelector(
        ".report-wiper-fixed",
      );

      const reportWipeStartAngle = REPORT_WIPE_START_ANGLE;
      const reportTotal = reportImages.length;
      const reportSegmentSize = 1 / reportTotal;
      const reportCompassRotations = reportImages.map(
        (img) => img.compassRotation ?? 0,
      );
      let reportCompassPrevSegmentIndex = -1;

      while (reportCompassSvg.firstChild)
        reportCompassSvg.removeChild(reportCompassSvg.firstChild);

      const reportCompassRingGroup = document.createElementNS(
        REPORT_SVG_NS,
        "g",
      );
      reportCompassSvg.appendChild(reportCompassRingGroup);

      for (let i = 0; i < 360; i += 2) {
        reportCompassRingGroup.appendChild(reportCreateTick(i));
        if (i % 30 === 0)
          reportCompassRingGroup.appendChild(reportCreateDegreeLabel(i));
      }

      for (let i = 0; i < reportTotal; i++) {
        const reportClip = `conic-gradient(from ${reportWipeStartAngle}deg, #000 0deg, transparent 0deg)`;
        reportLayers[i].style.maskImage = reportClip;
        reportLayers[i].style.webkitMaskImage = reportClip;
      }

      gsap.set(reportWiperHand, { rotation: reportWipeStartAngle });
      gsap.set(reportWiperFixed, { opacity: 0 });
      gsap.set(reportLayers, { scale: 1.25 });

      function reportSetCompassRotate(el, angle) {
        el.setAttributeNS(
          null,
          "transform",
          `rotate(${angle} ${REPORT_COMPASS_CENTER} ${REPORT_COMPASS_CENTER})`,
        );
      }

      const reportRingTweenState = {
        angle: reportCompassRotations[0] ?? 0,
      };
      reportSetCompassRotate(
        reportCompassRingGroup,
        reportRingTweenState.angle,
      );

      function reportSetMask(el, angle) {
        const reportMask = `conic-gradient(from ${reportWipeStartAngle}deg, #000 ${angle}deg, transparent ${angle}deg)`;
        el.style.maskImage = reportMask;
        el.style.webkitMaskImage = reportMask;
      }

      function reportGetImageScale(imageIndex, segmentIndex, localProgress) {
        const reportCyclesAhead = segmentIndex - imageIndex;

        if (reportCyclesAhead < 0) return 1.25;
        if (reportCyclesAhead === 0) {
          return 1.25 - 0.125 * localProgress;
        }
        if (reportCyclesAhead === 1) {
          return 1.125 - 0.125 * localProgress;
        }
        return 1;
      }

      function reportOnScroll(progress) {
        const reportSegmentIndex = Math.min(
          Math.floor(progress / reportSegmentSize),
          reportTotal - 1,
        );
        if (reportCompassPrevSegmentIndex !== reportSegmentIndex) {
          reportCompassPrevSegmentIndex = reportSegmentIndex;
          const reportCompassTargetAngle =
            reportCompassRotations[reportSegmentIndex] ?? 0;
          gsap.to(reportRingTweenState, {
            angle: reportCompassTargetAngle,
            duration: 0.75,
            ease: "power3.out",
            overwrite: true,
            onUpdate: () => {
              reportSetCompassRotate(
                reportCompassRingGroup,
                reportRingTweenState.angle,
              );
            },
          });
        }
        const reportLocalProgress =
          (progress - reportSegmentIndex * reportSegmentSize) /
          reportSegmentSize;

        const reportAngle = reportLocalProgress * 360;

        const reportHandRotation =
          reportWipeStartAngle + reportSegmentIndex * 360 + reportAngle;
        gsap.set(reportWiperHand, { rotation: reportHandRotation });

        const reportIsWiping = reportAngle > 0 && reportAngle < 360;
        gsap.set(reportWiperFixed, { opacity: reportIsWiping ? 1 : 0 });

        for (let i = 0; i < reportTotal; i++) {
          if (i < reportSegmentIndex) {
            reportSetMask(reportLayers[i], 360);
          } else if (i === reportSegmentIndex) {
            reportSetMask(reportLayers[i], reportAngle);
          } else {
            reportSetMask(reportLayers[i], 0);
          }

          const reportZoomScale = reportGetImageScale(
            i,
            reportSegmentIndex,
            reportLocalProgress,
          );
          gsap.set(reportLayers[i], {
            scale: reportZoomScale,
            force3D: true,
          });
        }
      }

      const reportTotalScroll = window.innerHeight * 2 * reportTotal;
      const reportExtraScroll = window.innerHeight * 2;

      const reportScrollTrigger = ScrollTrigger.create({
        trigger: reportSection,
        start: "top top",
        end: `+=${reportTotalScroll + reportExtraScroll}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          reportOnScroll(self.progress);
        },
      });

      reportOnScroll(reportScrollTrigger.progress);

      return () => {
        reportScrollTrigger.kill();
        gsap.killTweensOf([reportRingTweenState]);
        while (reportCompassSvg.firstChild)
          reportCompassSvg.removeChild(reportCompassSvg.firstChild);
      };
    },
    { scope: reportSectionRef },
  );

  return (
    <>
      <section className="report-hero">
        <div className="container">
          <div className="report-hero-grid">
            <div className="report-hero-image">
              <img src={asset("/images/img9.png")} alt="Teryn Shelf" />
            </div>
  
            <div className="report-hero-right">
              <div className="report-header">
                <Copy animateOnScroll={false} delay={0.65}>
                  <h1 className="subheader">The Isolated</h1>
                  <h1>Maw of Teryn</h1>
                </Copy>
              </div>
  
              <div className="report-hero-meta">
                <div className="report-hero-meta-left">
                  <Copy variant="flicker" delay={0.85} animateOnScroll={false}>
                    <p className="mono sm">Teryn Shelf,</p>
                    <p className="mono sm">Northern Scar</p>
                  </Copy>
                </div>
  
                <div className="report-hero-meta-right">
                  <Copy variant="flicker" delay={0.85} animateOnScroll={false}>
                    <p className="mono sm">Cycle 5901</p>
                    <p className="mono sm">Recovered Log 024</p>
                  </Copy>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <section className="report-discovery">
        <div className="container">
          <div className="report-copy-grid">
            <div className="report-copy-empty" />
  
            <div className="report-copy-content">
              <Copy splitType="words">
                <h5 className="v2">Discovery</h5>
              </Copy>
  
              <Copy splitType="lines">
                <p className="lg">
                  The first transmission from Teryn arrived as a corrupted visual
                  sweep: a dark shelf of broken stone, suspended debris, and a
                  circular void carved into the horizon.
                </p>
              </Copy>
  
              <Copy splitType="lines">
                <p className="lg">
                  A second scan confirmed that the formation was not natural. The
                  surrounding ruins showed signs of controlled collapse, as if the
                  entire sector had been cut away from the planet and left to
                  drift in place.
                </p>
              </Copy>
            </div>
          </div>
        </div>
      </section>
  
      <section className="report-section" ref={reportSectionRef}>
        <div className="report-canvas">
          <div className="report-layer">
            {reportImages.map((img, i) => (
              <div
                className="report-img"
                key={i}
                style={{
                  "--report-img": `url(${img.src})`,
                  zIndex: i,
                  maskImage: `conic-gradient(from ${REPORT_WIPE_START_ANGLE}deg, #000 0deg, transparent 0deg)`,
                  WebkitMaskImage: `conic-gradient(from ${REPORT_WIPE_START_ANGLE}deg, #000 0deg, transparent 0deg)`,
                }}
              >
                {reportDataBlocks[i]?.map((block, j) => (
                  <div
                    className={`report-data-block report-data-${block.position}`}
                    key={j}
                  >
                    <p className="sm">{block.label}</p>
                    <p className="mono">{block.value}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
  
          <svg
            ref={reportCompassRef}
            className="report-compass"
            width={REPORT_COMPASS_SIZE}
            height={REPORT_COMPASS_SIZE}
            viewBox={`0 0 ${REPORT_COMPASS_SIZE} ${REPORT_COMPASS_SIZE}`}
            xmlns="http://www.w3.org/2000/svg"
          />
  
          <div className="report-wiper-fixed">
            <div className="report-wiper-line">
              <div className="report-wiper-dot" />
            </div>
          </div>
  
          <div className="report-wiper-hand">
            <div className="report-wiper-line">
              <div className="report-wiper-dot" />
            </div>
          </div>
        </div>
      </section>
  
      <section className="report-current-conditions">
        <div className="container">
          <div className="report-copy-grid">
            <div className="report-copy-empty" />
  
            <div className="report-copy-content">
              <Copy splitType="words">
                <h5 className="v2">Current Conditions</h5>
              </Copy>
  
              <Copy splitType="lines">
                <p className="lg">
                  The shelf remains locked above the basin with no visible
                  structural support. Fragments around the main rupture drift in
                  fixed orbit, despite constant storm pressure.
                </p>
              </Copy>
  
              <Copy splitType="lines">
                <p className="lg">
                  Signal pulses continue from beneath the central void every
                  ninety-one minutes. No lifeforms have been confirmed, but survey
                  teams report movement inside the ruins when the storms fall
                  silent.
                </p>
              </Copy>
  
              <Copy variant="slide" delay={0.5}>
                <Button href="/chronicles">Open Archive</Button>
              </Copy>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
