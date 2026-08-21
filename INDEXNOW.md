# IndexNow submission workflow

Velomac uses an explicit submission workflow so only URLs that were genuinely added, updated, redirected or removed are sent to IndexNow.

## Configuration

1. Generate an IndexNow key containing 8–128 letters, numbers or hyphens.
2. Set `INDEXNOW_KEY` in the local environment and in the production hosting environment.
3. After deployment, confirm that `https://www.velomacflowmeter.com/indexnow-key.txt` returns the configured key. The verification file is intentionally public; the environment value is not embedded in source code.

## Submit changed URLs

Run the command only after the corresponding change is live:

```bash
npm run indexnow -- /products/vortex-flowmeter /resources/example-article
```

Absolute URLs are accepted only when they use the canonical `https://www.velomacflowmeter.com` origin. The script deduplicates the explicit list and never submits the complete sitemap automatically.

## Failure handling

Missing or invalid configuration, off-domain URLs and non-success responses exit with a failure code. Check the error, confirm the public key file and deployed URL, then retry the same explicit URL list. A successful IndexNow response confirms receipt, not indexing.
