import Link from "next/link";

/**
 * Reusable button used across every page so actions look and behave
 * consistently. Renders a real <button> by default, or a <Link> when an
 * `href` is passed (so call-to-action links share the exact same styling).
 *
 * Color rule: `primary` is always the main-action color (cyan) and
 * `secondary` is always the alternate-action color (magenta). Hover only
 * brightens the same color — the two are never interchanged.
 */

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-bold uppercase tracking-widest cursor-pointer transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

const sizes = {
  sm: "text-xs px-4 py-2",
  md: "text-sm px-8 py-3",
};

const variants = {
  // solid main action
  primary:
    "bg-primary text-background hover:bg-primary-strong focus-visible:ring-primary",
  // solid alternate action
  secondary:
    "bg-secondary text-background hover:bg-secondary-strong focus-visible:ring-secondary",
  // bordered, transparent — for lower-emphasis actions
  outline:
    "border border-primary text-primary hover:bg-primary/10 focus-visible:ring-primary",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  type,
  ...props
}) {
  const classes = `${base} ${sizes[size] ?? sizes.md} ${
    variants[variant] ?? variants.primary
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props} />
    );
  }

  return <button type={type ?? "button"} className={classes} {...props} />;
}
