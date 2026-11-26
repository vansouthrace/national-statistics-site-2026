[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/vansouthrace/national-statistics-site-2026/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/vansouthrace/national-statistics-site-2026/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

# NusaStat — Portal Statistik Indonesia

A national statistics site for Indonesia, built for the [make.fun bounty "Make the best national statistics site"](https://make.fun/bounty/best-national-statistics-site-20261126-0539). It runs entirely from static files: no build step, no network requests, on desktop and on a phone.

Built with make.fun — enter bounties and get paid for your code: https://make.fun?ref=05vf2eby

## What it is

NusaStat presents Indonesia's official figures — population, economy, labour, health and education — with charts, tables and a source next to every number. Data is rounded from official releases by BPS (Statistics Indonesia) and the World Bank, and every page states its source and year.

Pages (all reached from the top navigation, hash routes):

- **Beranda** — key indicators at a glance (population, GDP, inflation, unemployment, poverty), a population trend chart, and the latest releases.
- **Penduduk** — population by year (working year buttons), an age pyramid, and the 10 most populous provinces with a live search filter.
- **Ekonomi** — GDP growth with a bar/line chart switch, GDP by sector (donut), inflation trend, and the 2024 trade balance.
- **Tenaga Kerja** — unemployment and poverty trends, formal vs informal work, and employment by sector.
- **Sosial** — life expectancy and literacy trends, and the Human Development Index.
- **Data & Metodologi** — every headline indicator in one sortable, searchable table, plus methodology and sources.

## How it works

- `app/` — the whole site: `index.html`, `style.css`, `data.js` (all figures with sources), `charts.js` (hand-rolled SVG line, bar, donut and pyramid charts), `main.js` (hash router and page renderers). No framework, no CDN, no fetch: everything the site shows ships in its own files.
- `main.ts` — the hand-in program (Node 22, standard library only). It copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's `buildDossier`.
- `vendor/makefun-frontend.ts` — the kit's dossier library, copied unchanged.
- `screenshots/` — real renders of the site in a browser (desktop home, economy, population, and a phone-size home view).

## Screenshots

The four images in `screenshots/` are real renders of this site in a browser: the home dashboard (desktop), the economy page (desktop), the population page (desktop), and the home page at phone size (390 × 844). They were taken after the final code was in place, with no edits afterwards.

## Run it locally

```sh
# serve the site (any static server works)
python3 -m http.server 8080 --directory app
# open http://localhost:8080

# build the hand-in output
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT. See [LICENSE](LICENSE).
