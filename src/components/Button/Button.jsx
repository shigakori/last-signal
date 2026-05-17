"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

import "./Buttons.css";

export default function Button({
  href = "/",
  children,
  variant = "default",
  theme = "light",
  icon,
  className = "",
  ...props
}) {
  const isDefaultVariant = variant === "default";
  const resolvedIcon = icon ?? <FiArrowRight aria-hidden="true" />;
  const label = typeof children === "string" ? children : String(children ?? "");

  return (
    <Link
      href={href}
      className={`button button--${variant} button--${theme} ${className}`.trim()}
      aria-label={label}
      {...props}
    >
      <span className="button__label">
        <span className="button__scan" aria-hidden="true" />
        <span className="mono sm button__text">{label}</span>
      </span>

      {isDefaultVariant && (
        <span className="button__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      )}
    </Link>
  );
}
