export function isPrivateAnalyticsPath(pathname: string) {
  return /^\/(?:admin|api)(?:\/|$)/i.test(pathname);
}
