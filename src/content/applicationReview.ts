export type ApplicationReviewFieldKey =
  | "siteVibration"
  | "ptCompensation"
  | "straightRun"
  | "conductivity"
  | "fullPipe"
  | "solids"
  | "gasComposition"
  | "compositionStability"
  | "moisture"
  | "viscosity"
  | "liquidCondition"
  | "installationType"
  | "pipeConstruction";

export type ApplicationReviewProductConfig = {
  heading: string;
  fields: ApplicationReviewFieldKey[];
};

export const applicationReviewProductOptions = [
  { value: "vortex-flowmeter", label: "Vortex" },
  { value: "electromagnetic-flowmeter", label: "Electromagnetic" },
  { value: "thermal-mass-flowmeter", label: "Thermal Mass" },
  { value: "liquid-turbine-flowmeter", label: "Liquid Turbine" },
  { value: "gas-turbine-flowmeter", label: "Gas Turbine" },
  { value: "ultrasonic-flowmeter", label: "Ultrasonic" },
  { value: "v-cone-flowmeter", label: "V-Cone" },
  { value: "swirl-flowmeter", label: "Swirl" },
  { value: "balanced-differential-pressure-flowmeter", label: "Balanced DP" },
  { value: "not-sure-yet", label: "Not sure yet" }
] as const;

const productReviewConfigs: Record<string, ApplicationReviewProductConfig> = {
  "vortex-flowmeter": {
    heading: "Vortex application focus",
    fields: ["siteVibration", "ptCompensation", "straightRun"]
  },
  "wide-turndown-anti-vibration": {
    heading: "Anti-vibration application focus",
    fields: ["siteVibration", "ptCompensation", "straightRun"]
  },
  "electromagnetic-flowmeter": {
    heading: "Electromagnetic application focus",
    fields: ["conductivity", "fullPipe", "solids"]
  },
  "thermal-mass-flowmeter": {
    heading: "Thermal mass application focus",
    fields: ["gasComposition", "compositionStability", "moisture"]
  },
  "liquid-turbine-flowmeter": {
    heading: "Liquid turbine application focus",
    fields: ["viscosity", "liquidCondition"]
  },
  "ultrasonic-flowmeter": {
    heading: "Ultrasonic application focus",
    fields: ["installationType", "pipeConstruction", "fullPipe"]
  }
};

export function getApplicationReviewProductConfig(productSlug: string) {
  return productReviewConfigs[productSlug] || null;
}

export function getApplicationReviewProductOption(productSlug: string) {
  return applicationReviewProductOptions.find((option) => option.value === productSlug) || null;
}
