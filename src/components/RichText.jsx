/**
 * Renders text with [label](url) markdown-style links.
 * Use in any component that displays JSON-sourced text.
 */
export function RichText({ text }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/)
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (match) {
      return (
        <a
          key={i}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold-dark hover:text-gold underline underline-offset-2 transition-colors"
        >
          {match[1]}
        </a>
      )
    }
    return part
  })
}
