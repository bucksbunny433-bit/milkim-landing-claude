// Shapes of the editable content in src/content. The JSON files are the source of
// truth the future admin UI will write to, so the types live next to the page
// rather than inside a component - both the card and the section that lists the
// cards need them.

/** One photograph inside a case: a single stage, or a ready-made before/after collage. */
export interface Frame {
  file: string;
  label: string;
  mode: "stage" | "collage";
  /** Real pixel dimensions, recorded in the data file on purpose - see CaseCard. */
  w: number;
  h: number;
  /** True where the frame is a finished result with no "before" to pair it with. */
  marked?: boolean;
}

export interface CaseData {
  id: string;
  service: string;
  serviceTitle: string;
  number: number;
  kind: string;
  frames: Frame[];
}
