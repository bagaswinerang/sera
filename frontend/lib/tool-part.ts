import type { getToolName } from "ai";

/** Tipe part tool apa pun yang diterima getToolName. */
export type ToolPartT = Parameters<typeof getToolName>[0];

/** Bentuk longgar supaya akses state/input/output aman secara tipe. */
export type LooseToolPart = {
  state?: string;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

export const asLoose = (p: ToolPartT): LooseToolPart =>
  p as unknown as LooseToolPart;
