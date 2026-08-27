// Config labels use human tokens (DD/MM/YYYY). Display/parsing uses date-fns
// patterns via ENV.defaultDateFormat / toDateFnsPattern().

export const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";

export const DATE_FORMAT_OPTIONS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY (14/05/2026)" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY (05/14/2026)" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2026-05-14)" },
];

const DATE_FNS_BY_CONFIG = {
  "DD/MM/YYYY": "dd/MM/yyyy",
  "MM/DD/YYYY": "MM/dd/yyyy",
  "YYYY-MM-DD": "yyyy-MM-dd",
};

export function toDateFnsPattern(configFormat) {
  return DATE_FNS_BY_CONFIG[configFormat] ?? "dd/MM/yyyy";
}
