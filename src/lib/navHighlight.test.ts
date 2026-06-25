import { describe, it, expect } from 'vitest';
import { sectionToNavId, activeNavIdFromEntries } from './navHighlight';

// Minimal stand-in for the IntersectionObserverEntry fields the logic reads.
const entry = (id: string, isIntersecting: boolean) =>
  ({ isIntersecting, target: { id } }) as unknown as IntersectionObserverEntry;

describe('sectionToNavId', () => {
  it("maps the hero section to the 'top' nav id", () => {
    expect(sectionToNavId('hero')).toBe('top');
  });

  it('returns the section id unchanged for every other section', () => {
    expect(sectionToNavId('work')).toBe('work');
    expect(sectionToNavId('experience')).toBe('experience');
  });
});

describe('activeNavIdFromEntries', () => {
  it('returns null when no entry is intersecting the trigger line', () => {
    expect(activeNavIdFromEntries([entry('work', false), entry('about', false)])).toBeNull();
  });

  it('returns the nav id of the single intersecting section', () => {
    expect(activeNavIdFromEntries([entry('work', false), entry('experience', true)])).toBe(
      'experience',
    );
  });

  it("maps an intersecting hero to 'top'", () => {
    expect(activeNavIdFromEntries([entry('hero', true)])).toBe('top');
  });

  it('lets the last intersecting entry in the batch win', () => {
    expect(
      activeNavIdFromEntries([entry('work', true), entry('experience', true)]),
    ).toBe('experience');
  });
});
