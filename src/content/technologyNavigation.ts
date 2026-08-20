export type TechnologyNavigationItem = {
  label: string;
  href: string;
  matchPaths: string[];
};

export const technologyNavigationItems = technologyData.navigation as TechnologyNavigationItem[];

export function getActiveTechnologyPath(pathname: string) {
  return technologyNavigationItems.find((item) => item.matchPaths.includes(pathname))?.href;
}
import technologyData from "./data/technology.json";
