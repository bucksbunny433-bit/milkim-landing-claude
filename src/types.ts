// Shapes for the JSON in src/content/. Kept here so a data file stays plain JSON that
// anyone can edit, while the components still get real types.

/** One photograph inside a case card. */
export interface Frame {
  /** Path under src/assets/portfolio/, e.g. "brows/01/before.jpg". */
  file: string;
  /** Intrinsic size. Read from the data, never from the image module: touching
      ImageMetadata.width in a template makes Astro emit the untouched original. */
  w: number;
  h: number;
  /** Only on a "pair". Drives alt text; never rendered as a visible label. */
  role?: "before" | "after";
  /** object-position, when the default centre crop puts the brows off the stage.
      e.g. "50% 30%". Omit unless a card actually needs it. */
  focus?: string;
}

/**
 * How a case is shown:
 *  collage - one image supplied by the studio, already a before/after in a single frame;
 *  pair    - two real frames placed side by side, which is the same comparison built in CSS;
 *  single  - a finished result with no "before" frame in existence.
 */
export type CaseLayout = "collage" | "pair" | "single";

export interface CaseData {
  id: string;
  /** Folder under src/assets/portfolio/: "brows" or "correction". */
  service: string;
  serviceTitle: string;
  number: number;
  layout: CaseLayout;
  frames: Frame[];
}
