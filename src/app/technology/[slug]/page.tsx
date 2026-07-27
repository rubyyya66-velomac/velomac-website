import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

export function generateStaticParams() {
  return [
    ...technologyCategories.map((category) => ({ slug: category.slug })),
    ...technologyArticles.map((article) => ({ slug: article.slug }))
  ];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getTechnologyCategoryBySlug(params.slug);

  if (category) {
    return {
      title: category.seo.title,
      description: category.seo.description,
      alternates: {
        canonical: `/technology/${category.slug}`
      },
      openGraph: {
        title: category.seo.title,
        description: category.seo.description,
        url: `/technology/${category.slug}`,
        images: [
          {
            url: category.image.src,
            alt: category.image.alt
          }
        ]
      }
    };
  }

  const article = getTechnologyArticle(params.slug);
  const detailPage = getTechnologyDetailPage(params.slug);

  if (!article || !detailPage) {
    return {};
  }

  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: {
      canonical: `/technology/${article.slug}`
    },
    openGraph: {
      title: article.seo.title,
      description: article.seo.description,
      url: `/technology/${article.slug}`,
      images: [
        {
          url: detailPage.heroImage.src,
          alt: detailPage.heroImage.alt
        }
      ]
    }
  };
}

export default function TechnologyPageBySlug({ params }: { params: { slug: string } }) {
  const category = getTechnologyCategoryBySlug(params.slug);

  if (category) {
    return (
      <>
        <TechnologySubnav />
        <TechnologyCategoryPage category={category} />
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
      <TechnologySubnav />
      <TechnologyDetailExperience article={article} page={detailPage} />
    </>
  );
}

