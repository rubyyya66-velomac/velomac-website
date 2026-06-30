import { promises as fs } from "node:fs";
import path from "node:path";
import { getAdminContentFile } from "@/content/adminContentFiles";
import type { AdminContentFileKey } from "@/content/adminContentFiles";
import aboutContent from "@/content/data/about.json";
import applicationsContent from "@/content/data/applications.json";
import articlesContent from "@/content/data/articles.json";
import contactContent from "@/content/data/contact.json";
import homepageContent from "@/content/data/homepage.json";
import productsContent from "@/content/data/products.json";
import siteContent from "@/content/data/site.json";

type SaveContentInput = {
  key: string;
  content: unknown;
  message?: string;
};

export type AdminContentLoadMode = "local-fs" | "github" | "bundled-fallback" | "failed";

export type AdminContentDiagnostics = {
  nodeEnv: string;
  key: string;
  repoPath: string;
  githubEnv: {
    token: boolean;
    repo: boolean;
    branch: boolean;
  };
  githubStatus?: number;
  githubError?: string;
  localFsError?: string;
  fallbackError?: string;
  mode: AdminContentLoadMode;
};

export class AdminContentLoadError extends Error {
  diagnostics: AdminContentDiagnostics;

  constructor(message: string, diagnostics: AdminContentDiagnostics) {
    super(message);
    this.name = "AdminContentLoadError";
    this.diagnostics = diagnostics;
  }
}

const bundledAdminContent: Record<AdminContentFileKey, unknown> = {
  site: siteContent,
  homepage: homepageContent,
  about: aboutContent,
  products: productsContent,
  applications: applicationsContent,
  articles: articlesContent,
  contact: contactContent
};

export async function readAdminContent(key: string) {
  const file = getAdminContentFile(key);

  if (!file) {
    throw new Error("Unknown editable content file.");
  }

  const diagnostics = createContentDiagnostics(key, file.path);

  if (process.env.NODE_ENV !== "production") {
    try {
      const content = await readLocalJson(file.path);
      diagnostics.mode = "local-fs";

      return {
        file,
        content,
        mode: diagnostics.mode,
        diagnostics
      };
    } catch (error) {
      diagnostics.mode = "failed";
      diagnostics.localFsError = getErrorMessage(error);
      throw new AdminContentLoadError(formatLocalReadError(file.path, error), diagnostics);
    }
  }

  let githubReadError = "";

  if (hasGitHubSaveConfig()) {
    try {
      const content = await readGitHubJson(file.path, diagnostics);
      diagnostics.mode = "github";

      return {
        file,
        content,
        mode: diagnostics.mode,
        diagnostics
      };
    } catch (error) {
      githubReadError = getErrorMessage(error);
      diagnostics.githubError = githubReadError;
    }
  } else {
    githubReadError = `missing ${getMissingGitHubConfigKeys().join(", ")}`;
    diagnostics.githubError = githubReadError;
  }

  try {
    const content = cloneBundledContent(key as AdminContentFileKey);
    diagnostics.mode = "bundled-fallback";

    return {
      file,
      content,
      mode: diagnostics.mode,
      warning: `Loaded bundled fallback because production GitHub read failed: ${githubReadError}.`,
      diagnostics
    };
  } catch (error) {
    diagnostics.mode = "failed";
    diagnostics.fallbackError = getErrorMessage(error);

    throw new AdminContentLoadError(
      `Production GitHub read failed: ${githubReadError}. Bundled fallback failed for ${file.path}: ${diagnostics.fallbackError}.`,
      diagnostics
    );
  }
}

export async function saveAdminContent(input: SaveContentInput) {
  const file = getAdminContentFile(input.key);

  if (!file) {
    throw new Error("Unknown editable content file.");
  }

  const formattedContent = JSON.stringify(input.content, null, 2) + "\n";
  JSON.parse(formattedContent);

  if (process.env.NODE_ENV !== "production") {
    await fs.writeFile(resolveContentPath(file.path), formattedContent, "utf8");
    return {
      mode: "local"
    };
  }

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

  throw new Error("Saving is not configured. Please set GITHUB_TOKEN, GITHUB_REPO, and GITHUB_BRANCH in Vercel.");
}

export async function listPublicImages() {
  if (process.env.NODE_ENV === "production" && hasGitHubSaveConfig()) {
    try {
      return await listPublicImagesFromGitHub("public/images");
    } catch (error) {
      console.error("Admin media GitHub image list failed", {
        nodeEnv: process.env.NODE_ENV,
        repoPath: "public/images",
        githubEnv: getSafeGitHubEnvStatus(),
        reason: getErrorMessage(error)
      });
    }
  }

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

function createContentDiagnostics(key: string, repoPath: string): AdminContentDiagnostics {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    key,
    repoPath,
    githubEnv: getSafeGitHubEnvStatus(),
    mode: "failed"
  };
}

function hasGitHubSaveConfig() {
  return Boolean(
    process.env.GITHUB_TOKEN &&
      process.env.GITHUB_REPO &&
      process.env.GITHUB_BRANCH
  );
}

function getSafeGitHubEnvStatus() {
  return {
    token: Boolean(process.env.GITHUB_TOKEN),
    repo: Boolean(process.env.GITHUB_REPO),
    branch: Boolean(process.env.GITHUB_BRANCH)
  };
}

function getMissingGitHubConfigKeys() {
  return ["GITHUB_TOKEN", "GITHUB_REPO", "GITHUB_BRANCH"].filter((key) => !process.env[key]);
}

async function readLocalJson(relativePath: string) {
  const content = await fs.readFile(resolveContentPath(relativePath), "utf8");

  try {
    return JSON.parse(content) as unknown;
  } catch (error) {
    throw new Error(`JSON parse error in ${relativePath}: ${getErrorMessage(error)}`);
  }
}

async function readGitHubJson(repoPath: string, diagnostics: AdminContentDiagnostics) {
  const response = await fetchGitHubContent(repoPath);
  diagnostics.githubStatus = response.status;

  if (!response.ok) {
    throw new Error(formatGitHubResponseError(response.status, await readGitHubErrorMessage(response)));
  }

  const payload = (await response.json()) as {
    type?: string;
    content?: string;
    encoding?: string;
  };

  if (payload.type !== "file" || typeof payload.content !== "string") {
    throw new Error(`unexpected GitHub response for ${repoPath}`);
  }

  if (payload.encoding !== "base64") {
    throw new Error(`unsupported GitHub file encoding for ${repoPath}`);
  }

  const decoded = Buffer.from(payload.content.replace(/\n/g, ""), "base64").toString("utf8");

  try {
    return JSON.parse(decoded) as unknown;
  } catch (error) {
    throw new Error(`JSON parse error in ${repoPath}: ${getErrorMessage(error)}`);
  }
}

function cloneBundledContent(key: AdminContentFileKey) {
  const content = bundledAdminContent[key];

  if (content === undefined) {
    throw new Error(`No bundled fallback exists for ${key}.`);
  }

  return JSON.parse(JSON.stringify(content)) as unknown;
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
  const currentFileResponse = await fetchGitHubContent(input.path);

  if (!currentFileResponse.ok) {
    throw new Error(`GitHub could not load the current content file: ${formatGitHubResponseError(currentFileResponse.status, await readGitHubErrorMessage(currentFileResponse))}`);
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
    throw new Error(`GitHub could not save this content change: ${formatGitHubResponseError(updateResponse.status, await readGitHubErrorMessage(updateResponse))}`);
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
    throw new Error(`GitHub could not upload this image: ${formatGitHubResponseError(updateResponse.status, await readGitHubErrorMessage(updateResponse))}`);
  }
}

async function fetchGitHubContent(repoPath: string) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH;

  if (!token || !repo || !branch) {
    throw new Error(`missing ${getMissingGitHubConfigKeys().join(", ")}`);
  }

  return fetch(`https://api.github.com/repos/${repo}/contents/${repoPath}?ref=${encodeURIComponent(branch)}`, {
    headers: githubHeaders(token),
    cache: "no-store"
  });
}

async function listPublicImagesFromGitHub(repoPath: string) {
  const response = await fetchGitHubContent(repoPath);

  if (!response.ok) {
    throw new Error(formatGitHubResponseError(response.status, await readGitHubErrorMessage(response)));
  }

  const entries = (await response.json()) as Array<{
    type?: string;
    path?: string;
  }>;

  if (!Array.isArray(entries)) {
    throw new Error(`unexpected GitHub response for ${repoPath}`);
  }

  const images: string[] = [];

  for (const entry of entries) {
    if (!entry.path) {
      continue;
    }

    if (entry.type === "file" && isAllowedImageFilename(entry.path)) {
      images.push(`/${entry.path.replace(/^public\//, "")}`);
      continue;
    }

    if (entry.type === "dir") {
      images.push(...(await listPublicImagesFromGitHub(entry.path)));
    }
  }

  return Array.from(new Set(images)).sort((left, right) => left.localeCompare(right));
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

async function readGitHubErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || response.statusText;
  } catch {
    return response.statusText;
  }
}

function formatGitHubResponseError(status: number, message: string) {
  if (status === 401 || status === 403) {
    return `${status} auth error${message ? `: ${message}` : ""}`;
  }

  if (status === 404) {
    return `404 file not found${message ? `: ${message}` : ""}`;
  }

  return `${status}${message ? `: ${message}` : ""}`;
}

function formatLocalReadError(repoPath: string, error: unknown) {
  const message = getErrorMessage(error);

  if (message.includes("ENOENT")) {
    return `Content file path not found: ${repoPath}`;
  }

  return `Content file could not be loaded: ${repoPath}. ${message}`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
