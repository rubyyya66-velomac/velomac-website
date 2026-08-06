export type TechnologyNavigationItem = {
  label: string;
  href: string;
  matchPaths: string[];
};

export const technologyNavigationItems: TechnologyNavigationItem[] = [
  {
    label: "Sensor & Product Development",
    href: "/technology#sensor-product-development",
    matchPaths: [
      "/technology/sensor-product-development",
      "/technology/non-wetted-piezoelectric-vortex-sensor",
      "/technology/wide-turndown-anti-vibration-vortex-flowmeter",
      "/technology/electromagnetic-flowmeter-remote-pressure-monitoring"
    ]
  },
  {
    label: "Flow Calibration Systems",
    href: "/technology/flow-calibration-systems",
    matchPaths: [
      "/technology/flow-calibration-systems",
      "/technology/gas-flow-calibration",
      "/technology/master-meter-liquid-calibration",
      "/technology/liquid-flow-calibration-bench",
      "/technology/gravimetric-liquid-calibration"
    ]
  },
  {
    label: "Testing & Verification Systems",
    href: "/technology#testing-verification-systems",
    matchPaths: [
      "/technology/testing-calibration-systems",
      "/technology/vibration-measurement-test-system"
    ]
  },
  {
    label: "Application Upgrade Projects",
    href: "/technology#application-upgrade-projects",
    matchPaths: [
      "/technology/application-upgrade-projects",
      "/technology/smart-vortex-upgrade-chemical-pharmaceutical"
    ]
  }
];

export function getActiveTechnologyPath(pathname: string) {
  return technologyNavigationItems.find((item) => item.matchPaths.includes(pathname))?.href;
}
