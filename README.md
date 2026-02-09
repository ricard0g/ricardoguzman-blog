# Personal Blog Page

This is a very minimalistic blog page where I will be sharing posts about different topics.

## Social Metadata

This project now renders dynamic Open Graph and Twitter metadata from layouts.

### Optional post frontmatter fields

```yaml
description: "Base description used for meta, OG and Twitter."
ogDescription: "Optional override only for og:description."
twitterDescription: "Optional override only for twitter:description."
image: "Optional image URL/path for social cards."
imageAlt: "Optional alt text for social images."
```

### Defaults

- Fallback social image: `/og-image.png`
- Canonical/absolute URLs are generated from `site` in `astro.config.mjs`
- Twitter attribution tags use `@ricardoguzdev`
