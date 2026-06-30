import siteData from "./data/site.json";

const { navItems: siteNavItems, ...siteFields } = siteData;

export const site = {
  ...siteFields,
  url: process.env.NEXT_PUBLIC_SITE_URL || siteData.url
};

export const navItems = siteNavItems;
