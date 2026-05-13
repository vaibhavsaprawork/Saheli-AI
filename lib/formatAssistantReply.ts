/**
 * Saheli chat renders plain text only. Models often emit Markdown (**bold**, * bullets).
 * This keeps AWW-facing copy readable on small screens.
 */
export function formatAssistantReplyForDisplay(text: string): string {
  if (!text) return text;

  let t = text;

  // Remove Markdown bold / strong delimiters
  t = t.replace(/\*\*/g, "");

  // Strip ATX heading markers at line starts
  t = t.replace(/^#{1,6}\s+/gm, "");

  // Normalize list markers at line start (* or -) to a plain bullet
  t = t.replace(/^(\s*)[\*\-]\s+/gm, "$1• ");

  return t;
}
