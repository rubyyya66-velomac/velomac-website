import { applications as contentApplications } from "@/content/applications";

export { applications } from "@/content/applications";

export type ApplicationImageStatus = "final";

export type ApplicationImage = {
  src: string;
  alt: string;
  status: ApplicationImageStatus;
};

export const applicationImages = Object.fromEntries(
  contentApplications.map((application) => [
    application.slug,
    {
      src: application.image.src,
      alt: application.image.alt,
      status: "final" as const
    }
  ])
) as Record<string, ApplicationImage>;

export function getApplicationImage(slug: string): ApplicationImage {
  return applicationImages[slug] ?? applicationImages["steam-measurement"];
}
