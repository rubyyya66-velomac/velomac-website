import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FlowCalibrationCategoryPage } from "@/components/FlowCalibrationCategoryPage";
import { FlowCalibrationDetailPage } from "@/components/FlowCalibrationDetailPage";
import { JsonLd } from "@/components/JsonLd";
import { TechnologyCategoryPage } from "@/components/TechnologyCategoryPage";
import { TechnologyDetailExperience } from "@/components/TechnologyDetailExperience";
import { TechnologySubnav } from "@/components/TechnologySubnav";
import {
  getTechnologyArticle,
  getTechnologyCategoryBySlug,
  technologyArticles,
  technologyCategories
} from "@/content/technology";
import { getTechnologyDetailPage } from "@/content/technologyDetailPages";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbStructuredData } from "@/lib/structuredData";

export function generateStaticParams() {
  return [
    ...technologyCategories.map((category) => ({ slug: category.slug })),
    ...technologyArticles.map((article) => ({ slug: article.slug }))
  ];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getTechnologyCategoryBySlug(params.slug);

  if (category) {
    return buildPageMetadata({
      title: category.seo.title,
      description: category.seo.description,
      path: `/technology/${category.slug}`,
      image: category.image.src,
      imageAlt: category.image.alt
    });
  }

  const article = getTechnologyArticle(params.slug);
  const detailPage = getTechnologyDetailPage(params.slug);

  if (!article || !detailPage) {
    return {};
  }

  return buildPageMetadata({
    title: article.seo.title,
    description: article.seo.description,
    path: `/technology/${article.slug}`,
    image: detailPage.heroImage.src,
    imageAlt: detailPage.heroImage.alt
  });
}

export default function TechnologyPageBySlug({ params }: { params: { slug: string } }) {
  const category = getTechnologyCategoryBySlug(params.slug);

  if (category) {
    const path = `/technology/${category.slug}`;
    return (
      <>
        <JsonLd
          data={breadcrumbStructuredData([
            { name: "Home", path: "/" },
            { name: "Technology", path: "/technology" },
            { name: category.title, path }
          ])}
        />
        <TechnologySubnav />
        {category.id === "flow-calibration-systems" ? (
          <FlowCalibrationCategoryPage />
        ) : (
          <TechnologyCategoryPage category={category} />
        )}
      </>
    );
  }

  const article = getTechnologyArticle(params.slug);
  const detailPage = getTechnologyDetailPage(params.slug);

  if (!article || !detailPage) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={breadcrumbStructuredData([
          { name: "Home", path: "/" },
          { name: "Technology", path: "/technology" },
          { name: article.title, path: `/technology/${article.slug}` }
        ])}
      />
      <TechnologySubnav />
      {article.categoryId === "flow-calibration-systems" ? (
        <FlowCalibrationDetailPage article={article} page={detailPage} />
      ) : (
        <TechnologyDetailExperience article={article} page={detailPage} />
      )}
    </>
  );
}
