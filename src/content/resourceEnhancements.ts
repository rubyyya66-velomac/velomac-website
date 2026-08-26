export type ResourceEnhancement = {
  quickAnswer: string;
  keyConditions: string[];
  relatedTechnologySlugs: string[];
  relatedResourceSlugs: string[];
};

/**
 * Curated GEO additions for established articles whose original long-form copy
 * predates the answer-ready resource format. The wording stays within the
 * engineering guidance already present in each article.
 */
const resourceEnhancements: Record<string, ResourceEnhancement> = {
  "flowmeter-quote-site-details": {
    quickAnswer:
      "A useful flowmeter quote needs the medium, pipe size, minimum/normal/maximum flow, pressure, temperature, installation conditions and required signal. Pipe size or a model name alone is not enough for application review.",
    keyConditions: ["Medium and composition", "Minimum, normal and maximum flow", "Pressure and temperature", "Pipe layout and signal requirement"],
    relatedTechnologySlugs: ["flow-calibration-systems"],
    relatedResourceSlugs: ["flowmeter-selection-messy-site-conditions", "retrofit-flowmeter-pipe-photos"]
  },
  "flowmeter-selection-messy-site-conditions": {
    quickAnswer:
      "When site conditions are complicated, start with the process and installation limits rather than a preferred meter model. Flow range, media behavior, straight pipe, vibration, access and signal needs should be reviewed together.",
    keyConditions: ["Actual flow range", "Media behavior", "Straight-pipe availability", "Vibration and access limits"],
    relatedTechnologySlugs: ["vibration-measurement-test-system"],
    relatedResourceSlugs: ["flowmeter-quote-site-details", "flowmeter-uncertainty-process-conditions"]
  },
  "retrofit-flowmeter-pipe-photos": {
    quickAnswer:
      "For retrofit review, send wide and close pipe photos together with process conditions. Photos can reveal straight-pipe limits, access, vibration, connection space and shutdown constraints that drawings or pipe size alone may not show.",
    keyConditions: ["Wide and close pipe photos", "Available installation space", "Shutdown limitations", "Process and signal details"],
    relatedTechnologySlugs: ["application-upgrade-projects"],
    relatedResourceSlugs: ["no-cut-retrofit-flowmeter-selection", "temporary-wastewater-flow-measurement-brownfield-upgrade"]
  },
  "flowmeter-number-proven": {
    quickAnswer:
      "Before approving a flowmeter, confirm how the reading will be checked and how the proposed range relates to the real process. Calibration context, operating conditions and signal use need to be reviewed as one measurement chain.",
    keyConditions: ["Calibration context", "Operating flow range", "Process pressure and temperature", "Signal use and commissioning"],
    relatedTechnologySlugs: ["flow-calibration-systems"],
    relatedResourceSlugs: ["flowmeter-uncertainty-process-conditions", "plant-flow-data-trust"]
  },
  "plant-flow-data-trust": {
    quickAnswer:
      "Plant teams trust flow data when the meter, operating range, installation and signal path are all matched to the measurement purpose. A stable display alone does not establish that the number is useful for control or reporting.",
    keyConditions: ["Measurement purpose", "Operating range", "Installation condition", "Signal and commissioning path"],
    relatedTechnologySlugs: ["testing-calibration-systems"],
    relatedResourceSlugs: ["flowmeter-data-quality-measurement-point", "plc-flowmeter-signal-integration"]
  },
  "vortex-flowmeter-complex-flow-challenges": {
    quickAnswer:
      "Vortex flowmeters are commonly reviewed for steam, gas and clean liquid service, but suitability depends on the actual flow range and site conditions. Pressure, temperature, straight pipe and vibration should be confirmed before selection.",
    keyConditions: ["Steam, gas or clean liquid", "Minimum and maximum flow", "Pressure and temperature", "Straight pipe and vibration"],
    relatedTechnologySlugs: ["vibration-measurement-test-system", "gas-flow-calibration"],
    relatedResourceSlugs: ["vortex-flowmeter-steam-selection", "steam-meter-site-conditions"]
  },
  "plc-flowmeter-signal-integration": {
    quickAnswer:
      "Flowmeter selection is not complete until the receiving system can use the signal correctly. Confirm the output type, power, scaling, communication requirement and display location before ordering and commissioning.",
    keyConditions: ["Output and protocol", "Power supply", "Signal scaling", "PLC or DCS receiving point"],
    relatedTechnologySlugs: ["smart-vortex-upgrade-chemical-pharmaceutical"],
    relatedResourceSlugs: ["plant-flow-data-trust", "flowmeter-data-quality-measurement-point"]
  },
  "steam-meter-site-conditions": {
    quickAnswer:
      "Before replacing a disputed steam meter, review the steam condition, flow range, condensate, straight pipe, vibration and compensation requirements. The installation may be the source of the problem even when the meter itself is operating.",
    keyConditions: ["Steam pressure and temperature", "Condensate condition", "Straight pipe", "Vibration and compensation"],
    relatedTechnologySlugs: ["vibration-measurement-test-system", "gas-flow-calibration"],
    relatedResourceSlugs: ["vortex-flowmeter-steam-selection", "vortex-flowmeter-complex-flow-challenges"]
  },
  "flowmeter-uncertainty-process-conditions": {
    quickAnswer:
      "Start flowmeter selection with the process uncertainty the plant needs to remove. Then define the medium, flow range, pressure, temperature, installation limits and intended use before comparing meter families.",
    keyConditions: ["Process question", "Medium", "Flow and operating range", "Installation and intended use"],
    relatedTechnologySlugs: ["flow-calibration-systems"],
    relatedResourceSlugs: ["flowmeter-selection-messy-site-conditions", "flowmeter-data-quality-measurement-point"]
  }
};

export function getResourceEnhancement(slug: string) {
  return resourceEnhancements[slug];
}
