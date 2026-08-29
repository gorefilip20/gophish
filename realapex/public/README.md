# Public assets

## `RealApex_Whitepaper_v1.0.pdf`

The file currently in this directory is a **placeholder** so the download and
in-browser reader work out of the box.

To ship the real document:

1. Export your final whitepaper as a PDF.
2. Name it **exactly** `RealApex_Whitepaper_v1.0.pdf` (it must match
   `BRAND.whitepaperFile` in `src/lib/constants.ts`).
3. Drop it in this `/public` directory, replacing the placeholder.

It is then served two ways with **no code changes**:

- **Direct download (logged):** `GET /api/analytics/download-pdf` streams the
  file with `Content-Disposition: attachment` and records a `pdf_download`
  analytics event. This is what the "Download Whitepaper PDF" buttons call.
- **In-browser reader:** the `/whitepaper` page renders it via react-pdf from
  the static path `/RealApex_Whitepaper_v1.0.pdf` (no download logged on render).

If you rename the file, update `whitepaperFile` in `src/lib/constants.ts`.
