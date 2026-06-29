export type ProductApplicationImageStatus = "final" | "closest-match" | "todo";

export type ProductApplicationImage = {
  src: string;
  alt: string;
  summary: string;
  status: ProductApplicationImageStatus;
  todo?: string;
};

export const productApplicationImages = {
  "vortex-flowmeter": {
    src: "/images/applications/product-use/vortex-flowmeter.png",
    alt: "Steam process line for vortex flowmeter application context",
    summary:
      "Used around steam, gas and vibration-prone process lines where site conditions affect the final configuration.",
    status: "final"
  },
  "electromagnetic-flowmeter": {
    src: "/images/applications/product-use/electromagnetic-flowmeter.png",
    alt: "Water process line for electromagnetic flowmeter application context",
    summary:
      "Used for conductive liquid, water and chemical service where lining, electrode material and grounding need to be checked.",
    status: "final"
  },
  "liquid-turbine-flowmeter": {
    src: "/images/applications/product-use/liquid-turbine-flowmeter.png",
    alt: "Clean liquid process line for liquid turbine flowmeter application context",
    summary:
      "Used for clean liquid or process liquid lines where stable flow, pressure loss and media cleanliness matter.",
    status: "final"
  },
  "gas-turbine-flowmeter": {
    src: "/images/applications/product-use/gas-turbine-flowmeter.png",
    alt: "Industrial gas flow line for gas turbine flowmeter application context",
    summary:
      "Used for compatible clean gas service where gas composition, operating pressure and flow profile are known.",
    status: "final"
  },
  "thermal-mass-flowmeter": {
    src: "/images/applications/product-use/thermal-mass-flowmeter.png",
    alt: "Industrial gas utility line for thermal mass flowmeter application context",
    summary:
      "Used for compressed air and industrial gas monitoring where gas composition and normal operating range can be confirmed.",
    status: "final"
  },
  "v-cone-flowmeter": {
    src: "/images/applications/product-use/v-cone-flowmeter.png",
    alt: "Process pipeline for V-Cone flowmeter application context",
    summary:
      "Used for process, steam or gas lines where differential pressure measurement fits the installation condition.",
    status: "final"
  },
  "swirl-flowmeter": {
    src: "/images/applications/product-use/swirl-flowmeter.png",
    alt: "Gas and steam process line for swirl flowmeter application context",
    summary:
      "Used for gas or steam utility lines where compact installation and compensation requirements should be reviewed.",
    status: "final"
  },
  "balanced-differential-pressure-flowmeter": {
    src: "/images/applications/product-use/balanced-dp-flowmeter.png",
    alt: "Industrial process line for balanced differential pressure flowmeter application context",
    summary:
      "Used for process and utility measurement where the primary element and pressure taps must match the line layout.",
    status: "final"
  },
  "ultrasonic-flowmeter": {
    src: "/images/applications/product-use/ultrasonic-flowmeter.png",
    alt: "Utility liquid pipeline for ultrasonic flowmeter application context",
    summary:
      "Used for liquid, utility and pipeline measurement where the installation approach can be matched to the pipe condition.",
    status: "final"
  },
  "radar-level-transmitter": {
    src: "/images/applications/product-use/radar-level-transmitter.png",
    alt: "Tank and vessel process scene for radar level transmitter application context",
    summary:
      "Used for tanks, vessels and open process points where non-contact level measurement is suitable.",
    status: "final"
  },
  "magnetic-level-gauge": {
    src: "/images/applications/product-use/magnetic-level-gauge.png",
    alt: "Tank and vessel process scene for magnetic level gauge application context",
    summary:
      "Used for tank and vessel liquid level indication where connection, pressure, temperature and media compatibility matter.",
    status: "final"
  }
} as const satisfies Record<string, ProductApplicationImage>;

export type ProductApplicationImageSlug = keyof typeof productApplicationImages;

export function getProductApplicationImage(slug: string): ProductApplicationImage {
  return (
    productApplicationImages[slug as ProductApplicationImageSlug] ??
    productApplicationImages["vortex-flowmeter"]
  );
}
