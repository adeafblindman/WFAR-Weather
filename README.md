# Super Earth Meteorological Division — Planetary Weather Outlook

A Helldivers 2–themed 7-day weather outlook page for GitHub Pages, plus an admin
console for managing planets, weather, and colors.

## Files
- `index.html` — the public outlook page. Auto-cycles through planets on a
  timer (default 10s, configurable in admin). Prev/next buttons sit beside
  the dots below the forecast card. Shows a 7-day forecast per planet.
- `admin.html` — the command console for editing theme colors, the planet
  roster, forecast data, the rotation timer, and custom icons/backgrounds.
- `data.js` — shared biome definitions (matching the real Helldivers 2
  biome roster), default planet roster, default theme/settings/icons, and
  the weather-generation / day-rollover logic.
- `style.css` — shared "Super Earth broadcast" styling for both pages.

## Custom icons & backgrounds
- **Weather icons**: every forecast condition is automatically sorted into
  one of 8 categories (Clear, Cloudy, Storm, Rain, Snow/Ice, Fog, Hazard,
  Wind). In admin → **Icons, BG & Timer**, you can upload a custom image to
  replace any category's default emoji, or reset it back.
- **Planet icon**: each planet's icon (shown next to its name) can be a
  typed emoji or an uploaded image, set per-planet in the Planets tab.
- **Backgrounds**: set a global background image (admin → Icons, BG &
  Timer) used behind the forecast card by default, and/or a per-planet
  background image (Planets tab) that overrides it for that one planet.
  With no image set, the card falls back to the dusk sky gradient.
- Uploaded images are stored as embedded base64 data in this browser's
  local storage — keep them reasonably small, since browsers typically cap
  local storage around 5–10MB total.

## How the daily rollover works
Each planet stores 7 forecast days keyed to real calendar dates. On every page
load (and every 60 seconds while the tab stays open), the page compares
today's date to the last-recorded date in `localStorage`. If a new calendar
day has started, it drops the oldest day, generates a new day 7 at the end
(randomized from that planet's biome weather pool), and repeats until caught
up — so it works correctly even if the tab was closed over midnight or for
several days.

## Rotation timer
The outlook page auto-advances to the next planet on a timer, default 10
seconds. Change it in admin → **Icons, BG & Timer** → Rotation Timer.

## Biomes
The biome roster (and each biome's weather pool) is modeled on the real
Helldivers 2 biomes — see https://helldivers.wiki.gg/wiki/Biomes — grouped
into the game's archetypes (Sandy, Primordial, Arctic, Moor, Swamp, Forest,
Oasis, Special). The Planets tab's biome dropdown is grouped the same way.

## About the admin console and GitHub Pages' limits
GitHub Pages only serves static files — there's no server or shared database.
So `admin.html` saves changes to **your browser's `localStorage`**, meaning:
- Changes you make are only visible to you, in that browser, immediately.
- Other visitors keep seeing the defaults baked into `data.js`.

To publish changes for everyone:
1. In the admin console, go to **Backup → Export Config**. This downloads a
   JSON file with your current theme + planets + forecasts.
2. Open that JSON and copy the `theme` object and `planets` array over into
   `DEFAULT_THEME` and `DEFAULT_PLANETS` in `data.js` (note: forecasts inside
   the exported `planets` include a `forecast` array with dated entries —
   you'll likely want to drop those dated entries and let `data.js` regenerate
   fresh dates, unless you specifically want to freeze a forecast).
3. Commit and push `data.js`. Every visitor without their own local
   customizations will now see the update.

The admin console also supports **Import Config**, useful for moving your
local setup between browsers/devices, and **Reset Everything to Defaults**.

## Customizing biomes / weather pools
Open `data.js` and edit the `BIOMES` object — each biome has a `pool` of
possible conditions, a `tempRange`, and a `swatch`/`pattern` used to render
the CSS-drawn planet globe on the outlook page (no external image assets
required, so nothing to host).

## Adding planets permanently
Either use the admin console + the export/copy-into-`data.js` process above,
or add directly to `DEFAULT_PLANETS` in `data.js`:

```js
{ id: "unique-id", name: "Planet Name", biome: "toxic", faction: "Terminid",
  color: "#a4d24a", icon: "☣️", displayed: true }
```

(`forecast` is generated automatically on first load — you don't need to
supply it by hand.)
