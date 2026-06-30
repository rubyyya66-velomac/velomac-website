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

  throw new Error("GitHub save is not configured for production.");
}

function resolveContentPath(relativePath: string) {
  return path.join(process.cwd(), relativePath);
}

function hasGitHubSaveConfig() {
  return Boolean(
    process.env.GITHUB_TOKEN &&
      process.env.GITHUB_REPO
  );
}

async function commitContentToGitHub(input: {
  path: string;
  content: string;
  message: string;
}) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    throw new Error("GitHub save environment variables are missing.");
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${input.path}`;
  const currentFileResponse = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
    headers: githubHeaders(token),
    cache: "no-store"
  });

  if (!currentFileResponse.ok) {
    throw new Error(`Could not load current GitHub file: ${currentFileResponse.status}`);
  }

  const currentFile = (await currentFileResponse.json()) as { sha?: string };

  if (!currentFile.sha) {
    throw new Error("GitHub file SHA was not returned.");
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
    const errorBody = await updateResponse.text();
    throw new Error(`GitHub content update failed: ${updateResponse.status} ${errorBody}`);
  }
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}
