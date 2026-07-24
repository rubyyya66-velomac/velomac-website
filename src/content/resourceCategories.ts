export type ResourceCategoryGroup = "topic" | "industry";

export type ResourceCategory = {
  label: string;
  slug: string;
  group: ResourceCategoryGroup;
  order: number;
  aliases?: string[];
};

export const resourceCategoryConfig: ResourceCategory[] = [
  {
    label: "Flowmeter Selection",
    slug: "flowmeter-selection",
    group: "topic",
    order: 10
  },
  {
    label: "Installation Notes",
    slug: "installation-notes",
    group: "topic",
    order: 20
  },
  {
    label: "Calibration",
    slug: "calibration",
    group: "topic",
    order: 30
  },
  {
    label: "Application Notes",
    slug: "application-notes",
    group: "topic",
    order: 40
  },
  {
    label: "Signal Integration",
    slug: "signal-integration",
    group: "topic",
    order: 50
  },
  {
    label: "Flowmeter Retrofit",
    slug: "flowmeter-retrofit",
    group: "topic",
    order: 60
  },
  {
    label: "Steam Flow Measurement",
    slug: "steam-flow-measurement",
    group: "industry",
    order: 10,
    aliases: ["Steam Measurement"]
  },
  {
    label: "Pharmaceutical Utilities",
    slug: "pharmaceutical-utilities",
    group: "industry",
    order: 20
  },
  {
    label: "Chemical Process Flow Measurement",
    slug: "chemical-process-flow-measurement",
    group: "industry",
    order: 30
  },
  {
    label: "Industrial Decarbonization",
    slug: "industrial-decarbonization",
    group: "industry",
    order: 40
  },
  {
    label: "Data Center Cooling",
    slug: "data-center-cooling",
    group: "industry",
    order: 50
  },
  {
    label: "Food and Beverage Flow Measurement",
    slug: "food-and-beverage-flow-measurement",
    group: "industry",
    order: 60
  },
  {
    label: "Process Automation",
    slug: "process-automation",
    group: "industry",
    order: 70
  },
  {
    label: "Mining & Mineral Processing",
    slug: "mining-mineral-processing",
    group: "industry",
    order: 80
  }
];

function normalizeCategoryLabel(value: string) {
  return value.trim().toLowerCase();
}

export function getResourceCategoryBySlug(slug: string | null | undefined) {
  if (!slug) {
    return undefined;
  }

  return resourceCategoryConfig.find((category) => category.slug === slug);
}

export function getResourceCategoryByLabel(label: string) {
  const normalizedLabel = normalizeCategoryLabel(label);

  return resourceCategoryConfig.find((category) =>
    [category.label, ...(category.aliases || [])].some(
      (candidate) => normalizeCategoryLabel(candidate) === normalizedLabel
    )
  );
}

export function getArticleCategorySlugs(article: {
  category: string;
  categories?: string[];
}) {
  const primaryCategory = getResourceCategoryByLabel(article.category);
  const categorySlugs = [
    ...(article.categories || []),
    ...(primaryCategory ? [primaryCategory.slug] : [])
  ];

  return Array.from(
    new Set(
      categorySlugs.filter((slug) => Boolean(getResourceCategoryBySlug(slug)))
    )
  );
}
