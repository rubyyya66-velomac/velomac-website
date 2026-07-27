export type TechnologyNavigationItem = {
  label: string;
  href: string;
  matchPaths: string[];
};

export const technologyNavigationItems: TechnologyNavigationItem[] = [
  {
    label: "Overview",
    href: "/technology",
    matchPaths: ["/technology"]
  },
  {
    label: "Sensor & Product Development",
    href: "/technology/sensor-product-development",
    matchPaths: [
      "/technology/sensor-product-development",
      "/technology/non-wetted-piezoelectric-vortex-sensor",
      "/technology/wide-turndown-anti-vibration-vortex-flowmeter",
      "/technology/electromagnetic-flowmeter-remote-pressure-monitoring"
    ]
  },
  {
    label: "Testing & Calibration Systems",
    href: "/technology/testing-calibration-systems",
    matchPaths: [
      "/technology/testing-calibration-systems",
      "/technology/in-house-liquid-flow-calibration-bench",
      "/technology/vibration-measurement-test-system"
    ]
  },
  {
    label: "Application Upgrade Projects",
    href: "/technology/application-upgrade-projects",
    matchPaths: [
      "/technology/application-upgrade-projects",
      "/technology/smart-vortex-upgrade-chemical-pharmaceutical"
    ]
  }
];

export function getActiveTechnologyPath(pathname: string) {
  return technologyNavigationItems.find((item) => item.matchPaths.includes(pathname))?.href;
}
