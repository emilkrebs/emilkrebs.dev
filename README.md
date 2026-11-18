<div id="logo" align="center">
  <a href="https://github.com/emilkrebs/emilkrebs-website" target="_blank" rel="noopener noreferrer">
   <img width="256" alt="Emil Krebs Logo" src="./public/favicon.svg">
 </a>
  <h3>
    <a href="https://emilkrebs.dev/">emilkrebs.dev</a>
  </h3>
</div>

<div id="badges" align="center">

[![Deployed](https://github.com/emilkrebs/emilkrebs-website/actions/workflows/static.yml/badge.svg)](https://github.com/emilkrebs/emilkrebs-website/actions/workflows/static.yml)

</div>

<hr>

My website was made with Next.js, TypeScript, and Tailwind CSS deployed using
GitHub-Pages.

All rights reserved.

# How to setup

### Install dependencies

```
npm install
```

### Build the Website

```
npm run build
```

## For developers

```
npm run dev
```

## Generative-engine optimisation

The static export publishes [llms.txt](./public/llms.txt) without a route handler.
Keep its facts in sync with the rendered site and its UTF-8 size below 1,500 bytes.

Run `npm run lint` and `npm run build` before checking the exported copy. Manual
AI baselines, external profile updates, and post-deployment edge checks are
tracked outside this repository; a successful build does not complete them.

## Performance [_↗_](https://pagespeed.web.dev/analysis/https-emilkrebs-dev/n9vix5zf6e?hl=en_GB&form_factor=mobile)

<img width="1016" height="1213" alt="grafik" src="https://github.com/user-attachments/assets/57000563-a9a3-4c91-be75-ac715a5ee137" />
