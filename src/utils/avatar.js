function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function getInitials(
  name,
  fallback = "U"
) {
  const nameParts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (nameParts.length === 0) {
    return String(fallback)
      .charAt(0)
      .toUpperCase();
  }

  const firstInitial =
    nameParts[0]?.charAt(0) || "";

  const secondInitial =
    nameParts[1]?.charAt(0) || "";

  return `${firstInitial}${secondInitial}`
    .toUpperCase();
}

export function createInitialsAvatar(
  name,
  fallback = "U"
) {
  const initials = escapeXml(
    getInitials(name, fallback)
  );

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="400"
      height="400"
      viewBox="0 0 400 400"
    >
      <rect
        width="400"
        height="400"
        rx="40"
        fill="#e8f1fb"
      />

      <circle
        cx="200"
        cy="200"
        r="135"
        fill="#d7e9fa"
      />

      <text
        x="200"
        y="210"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="125"
        font-weight="700"
        fill="#1f6fc2"
      >
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    svg
  )}`;
}