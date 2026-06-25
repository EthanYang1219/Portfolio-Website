// Pure logic behind the scroll-spy that highlights the current nav item.
// Kept separate from App.tsx so it can be unit-tested without a DOM or a real
// IntersectionObserver.

/** Map a section element id to the nav id it should highlight. The hero section
 *  highlights the 'Home' (#top) nav item; every other section maps to itself. */
export function sectionToNavId(sectionId: string): string {
  return sectionId === 'hero' ? 'top' : sectionId;
}

/** Given a batch of IntersectionObserver entries, return the nav id to
 *  highlight, or null when none are crossing the trigger line (so the caller
 *  leaves the current highlight untouched). The trigger line is a zero-height
 *  band, so normally at most one section intersects; if a batch reports several,
 *  the last intersecting one wins. */
export function activeNavIdFromEntries(entries: IntersectionObserverEntry[]): string | null {
  let active: string | null = null;
  for (const entry of entries) {
    if (entry.isIntersecting) {
      active = sectionToNavId(entry.target.id);
    }
  }
  return active;
}
