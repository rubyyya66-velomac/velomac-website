import { promises as fs } from "node:fs";
import path from "node:path";
import { getAdminContentFile } from "@/content/adminContentFiles";

type SaveContentInput = {
  key: string;
  content: unknown;
  message?: string;
};

export async function readAdminContent(key: string) {
  const file = getAdminContentFile(key);

  if (!file) {
    throw new Error("Unknown editable content file.");
  }

  const content = await fs.readFile(resolveContentPath(file.path), "utf8");

  return {
    file,
    content: JSON.parse(content)
  };
}

export async function saveAdminContent(input: SaveContentInput) {
  const file = getAdminContentFile(input.key);

  if (!file) {
    throw new Error("Unknown editable content file.");
  }

  const formattedContent = JSON.stringify(input.content, null, 2) + "\n";
  JSON.parse(formattedContent);

  if (hasGitHubSaveConfig()) {
    await commitContentToGitHub({
      path: file.path,
      content: formattedContent,
      message: input.message || `Update ${file.label} content`
    });

    return {
      mode: "github"
    };
  }

  if (process.env.NODE_ENV !== "production") {
    await fs.writeFile(resolveContentPath(file.path), formattedContent, "utf8");
    return {
      mode: "local"
    };
  }

  throw new Error("Saving is not configured. Please set GITHUB_TOKEN, GITHUB_REPO, and GITHUB_BRANCH in Vercel.");
}

export async function listPublicImages() {
  const imageRoot = path.join(process.cwd(), "public/images");
  const images: string[] = [];

  await collectImages(imageRoot, images);

  return images.sort((left, right) => left.localeCompare(right));
}

export async function saveUploadedImage(input: {
  filename: string;
  bytes: Buffer;
}) {
  const safeFilename = sanitizeImageFilename(input.filename);
  const publicPath = `/images/uploads/${Date.now()}-${safeFilename}`;
  const repoPath = `public${publicPath}`;

  if (hasGitHubSaveConfig()) {
    await commitNewFileToGitHub({
      path: repoPath,
      content: input.bytes,
      message: "Upload website image from admin"
    });

    return {
      mode: "github",
      path: publicPath
    };
  }

  if (process.env.NODE_ENV !== "production") {
    const uploadDir = path.join(process.cwd(), "public/images/uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, path.basename(publicPath)), input.bytes);

    return {
      mode: "local",
      path: publicPath
    };
  }

  throw new Error("Saving is not configured. Please set GITHUB_TOKEN, GITHUB_REPO, and GITHUB_BRANCH in Vercel.");
}

function resolveContentPath(relativePath: string) {
  return path.join(process.cwd(), relativePath);
}

function hasGitHubSaveConfig() {
  return Boolean(
    process.env.GITHUB_TOKEN &&
      process.env.GITHUB_REPO &&
      process.env.GITHUB_BRANCH
  );
}

async function commitContentToGitHub(input: {
  path: string;
  content: string;
  message: string;
}) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;

  if (!token || !repo || !branch) {
    throw new Error("Saving is not configured. Please set GITHUB_TOKEN, GITHUB_REPO, and GITHUB_BRANCH in Vercel.");
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${input.path}`;
  const currentFileResponse = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
    headers: githubHeaders(token),
    cache: "no-store"
  });

  if (!currentFileResponse.ok) {
    throw new Error("GitHub could not load the current content file. Please check the repository settings.");
  }

  const currentFile = (await currentFileResponse.json()) as { sha?: string };

  if (!currentFile.sha) {
    throw new Error("GitHub did not return the current file version. Please try again.");
  }

  const updateResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message: input.message,
      content: Buffer.from(input.content, "utf8").toString("base64"),
      branch,
      sha: currentFile.sha
    })
  });

  if (!updateResponse.ok) {
    throw new Error("GitHub could not save this content change. Please check token permissions.");
  }
}

async function commitNewFileToGitHub(input: {
  path: string;
  content: Buffer;
  message: string;
}) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;

  if (!token || !repo || !branch) {
    throw new Error("Saving is not configured. Please set GITHUB_TOKEN, GITHUB_REPO, and GITHUB_BRANCH in Vercel.");
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${input.path}`;
  const updateResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: githubHeaders(token),
    body: JSON.stringify({
      message: input.message,
      content: input.content.toString("base64"),
      branch
    })
  });

  if (!updateResponse.ok) {
    throw new Error("GitHub could not upload this image. Please check token permissions and filename.");
  }
}

async function collectImages(directory: string, images: string[]) {
  let entries: Awaited<ReturnType<typeof fs.readdir>>;

  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await collectImages(entryPath, images);
      continue;
    }

    if (!entry.isFile() || !isAllowedImageFilename(entry.name)) {
      continue;
    }

    images.push(`/images/${path.relative(path.join(process.cwd(), "public/images"), entryPath).replaceAll(path.sep, "/")}`);
  }
}

export function isAllowedImageFilename(filename: string) {
  return /\.(jpe?g|png|webp|svg)$/i.test(filename);
}

export function sanitizeImageFilename(filename: string) {
  const extension = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, extension);
  const safeBaseName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  if (!isAllowedImageFilename(`file${extension}`)) {
    throw new Error("Please upload a JPG, PNG, WEBP or SVG image.");
  }

  return `${safeBaseName || "image"}${extension === ".jpeg" ? ".jpg" : extension}`;
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}
