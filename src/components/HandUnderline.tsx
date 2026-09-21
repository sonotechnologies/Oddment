/** One of the sparing "oddment" touches — a hand-drawn rule under a heading. */
export function HandUnderline({
  width = 200,
  className = "",
  color = "var(--color-clay)",
}: {
  width?: number;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 12"
      width={width}
      height={Math.round((width / 220) * 12)}
      className={`block overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 8 C 60 1, 150 12, 218 4"
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
