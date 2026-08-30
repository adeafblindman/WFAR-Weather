/* ============================================================
   SUPER EARTH METEOROLOGICAL DIVISION — DATA CORE
   Shared by index.html (dossier view) and admin.html (command console)
   ============================================================ */

const STORAGE_KEY = "sem_weather_config_v1";
const DATE_KEY = "sem_weather_lastdate_v1";

/* If a file named config.json sits alongside index.html / admin.html
   (same folder, served over http/https), it's fetched on every page
   load and applied as the active config — this lets a site owner
   publish one config for every visitor without hand-editing data.js.
   If it's missing, unreachable, or malformed, the page silently falls
   back to this browser's localStorage / the built-in defaults below. */
const CONFIG_FILE = "config.json";

/* ---------- Biome definitions ----------
   Modeled on the real Helldivers 2 biome roster (see
   https://helldivers.wiki.gg/wiki/Biomes), grouped by archetype.
   Each biome carries a condition pool, a temperature range (C), and
   a swatch/pattern used only as a fallback CSS texture. */
const BIOMES = {
  "desert-dunes": { label: "Desert Dunes", archetype: "Sandy",
    pool: ["Clear Skies", "Heatwave", "Sandstorm", "Dust Devils", "Scorching Winds"],
    tempRange: [32, 58], swatch: ["#c98a3a", "#8a5a22", "#e8b667"], pattern: "bands" },
  "desert-cliffs": { label: "Desert Cliffs", archetype: "Sandy",
    pool: ["Clear & Hazy", "Twisting Sandstorms", "Scorching Winds", "Static Haze", "Dust Devils"],
    tempRange: [28, 52], swatch: ["#c1863f", "#7d4e1e", "#e3ae6a"], pattern: "bands" },
  "acidic-badlands": { label: "Acidic Badlands", archetype: "Sandy",
    pool: ["Toxic Haze", "Corrosive Mist", "Chem Fog", "Clear (Masks Advised)", "Acid Vents Active"],
    tempRange: [26, 50], swatch: ["#9fbf3f", "#5c6b1f", "#c7e86a"], pattern: "mottle" },
  "rocky-canyons": { label: "Rocky Canyons", archetype: "Sandy",
    pool: ["Clear & Crisp", "Mountain Winds", "Dust Squalls", "Clear & Dry", "Rockslide Advisory"],
    tempRange: [15, 42], swatch: ["#8a7658", "#4a3f2f", "#b9a888"], pattern: "bands" },
  "moon": { label: "Moon", archetype: "Sandy",
    pool: ["Vacuum Clear", "Micrometeor Shower", "Radiation Spike", "Low-G Dust Winds", "Solar Flare Exposure"],
    tempRange: [-130, 120], swatch: ["#9a9a9a", "#4d4d4d", "#d4d4d4"], pattern: "craters" },

  "volcanic-jungle": { label: "Volcanic Jungle", archetype: "Primordial",
    pool: ["Humid & Overcast", "Thunderstorms", "Heavy Rain", "Ashfall", "Clear & Humid"],
    tempRange: [22, 38], swatch: ["#2f6b3a", "#1b4322", "#68a35a"], pattern: "mottle" },
  "deadlands": { label: "Deadlands", archetype: "Primordial",
    pool: ["Grey Haze", "Spore Drift", "Ashfall", "Ashen Overcast", "Clear & Dust"],
    tempRange: [8, 28], swatch: ["#6b6558", "#38352c", "#8f8a4e"], pattern: "mottle" },
  "ethereal-jungle": { label: "Ethereal Jungle", archetype: "Primordial",
    pool: ["Bioluminescent Mist", "Spore Bloom", "Humid & Still", "Clear & Humid", "Static Fog"],
    tempRange: [18, 32], swatch: ["#5a3f8f", "#2e1f4d", "#a17fd6"], pattern: "swirl" },
  "ionic-jungle": { label: "Ionic Jungle", archetype: "Primordial",
    pool: ["Ion Storms", "Static Haze", "Humid & Overcast", "Thunderstorms", "Clear & Charged"],
    tempRange: [20, 34], swatch: ["#2f5f8f", "#182f4d", "#6aa7d6"], pattern: "mottle" },
  "supercolony": { label: "Supercolony", archetype: "Primordial",
    pool: ["Spore Storm", "Chitin Dust", "Toxic Bloom", "Humid & Fetid", "Overcast & Still"],
    tempRange: [26, 44], swatch: ["#7a3f2f", "#3f1f16", "#c76a4a"], pattern: "mottle" },

  "icy-glaciers": { label: "Icy Glaciers", archetype: "Arctic",
    pool: ["Blizzard", "Whiteout", "Clear & Frigid", "Ice Storm", "Glacial Winds"],
    tempRange: [-45, -8], swatch: ["#bfe4ef", "#7fb8cf", "#eaf7fb"], pattern: "swirl" },
  "boneyard": { label: "Boneyard", archetype: "Arctic",
    pool: ["Frost Fog", "Ice Storm", "Clear & Cold", "Moss Thaw Drizzle", "Bitter Winds"],
    tempRange: [-30, 2], swatch: ["#9fb0ae", "#4f6360", "#cfe0dd"], pattern: "swirl" },
  "cyberstan-megafactory": { label: "Cyberstan Megafactory", archetype: "Arctic",
    pool: ["Industrial Smog", "Ice Storm", "Ash-Streaked Snow", "Clear & Frigid", "Chem Haze"],
    tempRange: [-25, 5], swatch: ["#5a6470", "#2b3038", "#8b96a3"], pattern: "swirl" },

  "plains": { label: "Plains", archetype: "Moor",
    pool: ["Mountain Winds", "Dense Fog", "Clear & Crisp", "Light Showers", "Overcast"],
    tempRange: [4, 20], swatch: ["#6b8a4e", "#37451f", "#a3c47a"], pattern: "bands" },
  "tundra": { label: "Tundra", archetype: "Moor",
    pool: ["Clear & Cold", "Sleet", "Ground Fog", "Snow Squalls", "Bitter Winds"],
    tempRange: [-15, 8], swatch: ["#8fa89a", "#4f6358", "#c7dbd0"], pattern: "swirl" },
  "scorched-moor": { label: "Scorched Moor", archetype: "Moor",
    pool: ["Wildfire Winds", "Ember Gusts", "Drought Haze", "Clear & Scorched", "Ashfall"],
    tempRange: [30, 52], swatch: ["#a3572f", "#5c2c14", "#d68a4f"], pattern: "bands" },
  "ionic-crimson": { label: "Ionic Crimson", archetype: "Moor",
    pool: ["Static Storms", "Crimson Haze", "Clear & Still", "Overcast", "Ion Squalls"],
    tempRange: [10, 28], swatch: ["#8f2f3a", "#4d161c", "#c96a72"], pattern: "mottle" },

  "basic-swamp": { label: "Basic Swamp", archetype: "Swamp",
    pool: ["Heavy Fog", "Downpour", "Humid & Overcast", "Thunderstorms", "Clear & Muggy"],
    tempRange: [18, 30], swatch: ["#4a5a3a", "#2b3520", "#7a8f5a"], pattern: "mottle" },
  "haunted-swamp": { label: "Haunted Swamp", archetype: "Swamp",
    pool: ["Bog Mist", "Marsh Gas Seep", "Thunderstorms", "Clear & Muggy", "Downpour"],
    tempRange: [16, 28], swatch: ["#3a4a3f", "#1c2921", "#5f7a63"], pattern: "mottle" },

  "deciduous-forest": { label: "Deciduous Forest", archetype: "Forest",
    pool: ["Clear & Crisp", "Light Rain", "Overcast", "Gentle Winds", "Morning Fog"],
    tempRange: [8, 24], swatch: ["#4a7a3f", "#254016", "#83b56a"], pattern: "mottle" },
  "autumn-forest": { label: "Autumn Forest", archetype: "Forest",
    pool: ["Gusty Winds", "Drizzle", "Clear & Cool", "Overcast", "Falling-Leaf Squalls"],
    tempRange: [4, 20], swatch: ["#b5722f", "#6b3c14", "#e0a35a"], pattern: "mottle" },
  "crimson-forest": { label: "Crimson Forest", archetype: "Forest",
    pool: ["Crimson Haze", "Still Air", "Clear & Mild", "Overcast", "Light Showers"],
    tempRange: [10, 26], swatch: ["#8f3a3a", "#4d1c1c", "#c97a7a"], pattern: "mottle" },

  "desert-oasis": { label: "Desert Oasis", archetype: "Oasis",
    pool: ["Clear & Humid", "Heatwave", "Dust Devils", "Light Showers", "Static Haze"],
    tempRange: [24, 42], swatch: ["#3f9f8a", "#1f5c4d", "#7ad6c1"], pattern: "swirl" },
  "bleak-oasis": { label: "Bleak Oasis", archetype: "Oasis",
    pool: ["Grey Overcast Haze", "Dense Fog", "Clear & Damp", "Overcast", "Drizzle"],
    tempRange: [14, 30], swatch: ["#5f7a7a", "#2f3f3f", "#8fa8a8"], pattern: "swirl" },

  "magma-desert": { label: "Magma Desert", archetype: "Special",
    pool: ["Lava Flow Advisory", "Ashfall", "Ember Winds", "Sulfur Storm", "Clear & Hazy"],
    tempRange: [45, 85], swatch: ["#c94a2b", "#5c1f12", "#f2894a"], pattern: "bands" },
  "hive-world": { label: "Hive World", archetype: "Special",
    pool: ["Spore Storm", "Chitin Dust", "Toxic Bloom", "Humid & Fetid", "Overcast & Still"],
    tempRange: [25, 42], swatch: ["#7a8f3a", "#3f4d1c", "#a8c76a"], pattern: "mottle" },
  "super-earth-metropolis": { label: "Super Earth Metropolis", archetype: "Special",
    pool: ["Clear Skies", "Urban Haze", "Smog Advisory", "Overcast", "Light Showers"],
    tempRange: [8, 26], swatch: ["#3a5a8f", "#1c2e4d", "#7aa0d6"], pattern: "bands" },
  "void-forest": { label: "Void Forest", archetype: "Special",
    pool: ["Void Mist", "Phase Static", "Dim Ambient Light", "Clear & Still", "Ion Flux"],
    tempRange: [2, 20], swatch: ["#3a2f5a", "#1c1730", "#7a6ab5"], pattern: "swirl" },
};

const ARCHETYPE_ORDER = ["Sandy", "Primordial", "Arctic", "Moor", "Swamp", "Forest", "Oasis", "Special"];

const SEVERITIES = ["Low", "Moderate", "High", "Extreme"];
const SEVERITY_WEIGHTS = [0.4, 0.32, 0.2, 0.08];

/* ---------- Default planet roster ---------- */
const DEFAULT_PLANETS = [
  { id: "malevelon-creek", name: "Malevelon Creek", biome: "basic-swamp", faction: "Terminid", color: "#3ea34d", icon: "🌴", displayed: true },
  { id: "hellmire", name: "Hellmire", biome: "magma-desert", faction: "Automaton", color: "#e0552b", icon: "🌋", displayed: true },
  { id: "vernen-wells", name: "Vernen Wells", biome: "desert-dunes", faction: "Terminid", color: "#d1a24a", icon: "🏜️", displayed: true },
  { id: "fenrir-iii", name: "Fenrir III", biome: "icy-glaciers", faction: "Automaton", color: "#8fd3e8", icon: "🧊", displayed: true },
  { id: "moradesh", name: "Moradesh", biome: "acidic-badlands", faction: "Terminid", color: "#a4d24a", icon: "☣️", displayed: true },
  { id: "tien-kwan", name: "Tien Kwan", biome: "plains", faction: "Automaton", color: "#b09a76", icon: "⛰️", displayed: true },
  { id: "crimsica", name: "Crimsica", biome: "haunted-swamp", faction: "Terminid", color: "#6b8a4e", icon: "🐊", displayed: true },
  { id: "fori-prime", name: "Fori Prime", biome: "hive-world", faction: "Terminid", color: "#8fbf3f", icon: "🐛", displayed: true },
  { id: "draupnir-ridge", name: "Draupnir Ridge", biome: "crimson-forest", faction: "Automaton", color: "#c96a72", icon: "🍁", displayed: true },
  { id: "iridica-luna", name: "Iridica Luna", biome: "moon", faction: "Illuminate", color: "#c9c9c9", icon: "🌑", displayed: false },
  { id: "port-brackis", name: "Port Brackis", biome: "bleak-oasis", faction: "Illuminate", color: "#3f86b5", icon: "🌊", displayed: false },
  { id: "gorrund-drift", name: "Gorrund Drift", biome: "tundra", faction: "Automaton", color: "#87a498", icon: "❄️", displayed: false },
  { id: "veil-of-tarsis", name: "Veil of Tarsis", biome: "void-forest", faction: "Illuminate", color: "#7a6ab5", icon: "🌌", displayed: false },

  /* ---- Full Helldivers 2 planet roster (auto-added, alphabetical) ---- */
  { id: "acamar-iv", name: "Acamar IV", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "achernar-secundus", name: "Achernar Secundus", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "achird-iii", name: "Achird III", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "acrab-xi", name: "Acrab XI", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "acrux-ix", name: "Acrux IX", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "adhara", name: "Adhara", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "aesir-pass", name: "Aesir Pass", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "afoyay-bay", name: "Afoyay Bay", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "ain-5", name: "Ain-5", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "alairt-iii", name: "Alairt III", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "alamak-vii", name: "Alamak VII", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "alaraph", name: "Alaraph", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "alathfar-xi", name: "Alathfar XI", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "alderidge-cove", name: "Alderidge Cove", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "alta-v", name: "Alta V", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "andar", name: "Andar", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "angels-venture", name: "Angel's Venture", biome: "void-forest", faction: null, color: "#3a2f5a", icon: "🌌", displayed: false },
  { id: "arkturus", name: "Arkturus", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "asperoth-prime", name: "Asperoth Prime", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "atrama", name: "Atrama", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "aurora-bay", name: "Aurora Bay", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "azterra", name: "Azterra", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "azur-secundus", name: "Azur Secundus", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "baldrick-prime", name: "Baldrick Prime", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "barabos", name: "Barabos", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "bashyr", name: "Bashyr", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "basquine-viii", name: "Basquine VIII", biome: "autumn-forest", faction: null, color: "#b5722f", icon: "🍁", displayed: false },
  { id: "bellatrix", name: "Bellatrix", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "blistica", name: "Blistica", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "bore-rock", name: "Bore Rock", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "borea", name: "Borea", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "botein", name: "Botein", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "brilliance", name: "Brilliance", biome: "desert-oasis", faction: null, color: "#3f9f8a", icon: "🌊", displayed: false },
  { id: "brink-2", name: "Brink-2", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "bunda-secundus", name: "Bunda Secundus", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "calypso", name: "Calypso", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "canopus", name: "Canopus", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "caph", name: "Caph", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "caramoor", name: "Caramoor", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "castor", name: "Castor", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "cerberus-iiic", name: "Cerberus IIIc", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "charbal-vii", name: "Charbal-VII", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "charon-prime", name: "Charon Prime", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "choepessa-iv", name: "Choepessa IV", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "choohe", name: "Choohe", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "chort-bay", name: "Chort Bay", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "cirrus", name: "Cirrus", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "claorell", name: "Claorell", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "clasa", name: "Clasa", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "curia", name: "Curia", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "cyberstan", name: "Cyberstan", biome: "cyberstan-megafactory", faction: null, color: "#5a6470", icon: "🏭", displayed: false },
  { id: "darius-ii", name: "Darius II", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "darrowsport", name: "Darrowsport", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "demiurg", name: "Demiurg", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "deneb-secundus", name: "Deneb Secundus", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "diaspora-x", name: "Diaspora X", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "dolph", name: "Dolph", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "draupnir", name: "Draupnir", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "durgen", name: "Durgen", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "east-iridium-trading-bay", name: "East Iridium Trading Bay", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "effluvia", name: "Effluvia", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "electra-bay", name: "Electra Bay", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "elysian-meadows", name: "Elysian Meadows", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "emeria", name: "Emeria", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "enuliale", name: "Enuliale", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "epsilon-phoencis-vi", name: "Epsilon Phoencis VI", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "erata-prime", name: "Erata Prime", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "erson-sands", name: "Erson Sands", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "esker", name: "Esker", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "estanu", name: "Estanu", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "eukoria", name: "Eukoria", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "euphoria-iii", name: "Euphoria III", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "fenmire", name: "Fenmire", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "fornskogur-ii", name: "Fornskogur II", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "fort-sanctuary", name: "Fort Sanctuary", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "fort-union", name: "Fort Union", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "freedom-peak", name: "Freedom Peak", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "fury", name: "Fury", biome: "magma-desert", faction: null, color: "#c94a2b", icon: "🌋", displayed: false },
  { id: "gacrux", name: "Gacrux", biome: "deciduous-forest", faction: null, color: "#4a7a3f", icon: "🌳", displayed: false },
  { id: "gaellivare", name: "Gaellivare", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "gar-haren", name: "Gar Haren", biome: "haunted-swamp", faction: null, color: "#3a4a3f", icon: "👻", displayed: false },
  { id: "gatria", name: "Gatria", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "gemma", name: "Gemma", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "gemstone-bluffs", name: "Gemstone Bluffs", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "genesis-prime", name: "Genesis Prime", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "grafmere", name: "Grafmere", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "grand-errant", name: "Grand Errant", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "gunvald", name: "Gunvald", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "hadar", name: "Hadar", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "haka", name: "Haka", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "haldus", name: "Haldus", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "halies-port", name: "Halies Port", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "heeth", name: "Heeth", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "herthon-secundus", name: "Herthon Secundus", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "hesoe-prime", name: "Hesoe Prime", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "heze-bay", name: "Heze Bay", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "hort", name: "Hort", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "hydrobius", name: "Hydrobius", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "hydrofall-prime", name: "Hydrofall Prime", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "igla", name: "Igla", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "imber", name: "Imber", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "inari", name: "Inari", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "ingmar", name: "Ingmar", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "iridica", name: "Iridica", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "iro", name: "Iro", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "irulta", name: "Irulta", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "ivis", name: "Ivis", biome: "void-forest", faction: null, color: "#3a2f5a", icon: "🌌", displayed: false },
  { id: "julheim", name: "Julheim", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "k", name: "K", biome: "magma-desert", faction: null, color: "#c94a2b", icon: "🌋", displayed: false },
  { id: "karlia", name: "Karlia", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "keid", name: "Keid", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "kelvinor", name: "Kelvinor", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "kerth-secundus", name: "Kerth Secundus", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "khandark", name: "Khandark", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "kharst", name: "Kharst", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "kirrik", name: "Kirrik", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "klaka-5", name: "Klaka 5", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "klen-dahth-ii", name: "Klen Dahth II", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "kneth-port", name: "Kneth Port", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "krakabos", name: "Krakabos", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "krakatwo", name: "Krakatwo", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "kraz", name: "Kraz", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "kuma", name: "Kuma", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "kuper", name: "Kuper", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "lastofe", name: "Lastofe", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "leng-secundus", name: "Leng Secundus", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "lesath", name: "Lesath", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "liberty-ridge", name: "Liberty Ridge", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "luxuriant", name: "Luxuriant", biome: "desert-oasis", faction: null, color: "#3f9f8a", icon: "🌊", displayed: false },
  { id: "maia", name: "Maia", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "mantes", name: "Mantes", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "marfark", name: "Marfark", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "marre-iv", name: "Marre IV", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "martale", name: "Martale", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "martyrs-bay", name: "Martyr's Bay", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "mastia", name: "Mastia", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "matar-bay", name: "Matar Bay", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "meissa", name: "Meissa", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "mekbuda", name: "Mekbuda", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "menkent", name: "Menkent", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "merak", name: "Merak", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "merga-iv", name: "Merga IV", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "meridia", name: "Meridia", biome: "void-forest", faction: null, color: "#3a2f5a", icon: "🌌", displayed: false },
  { id: "minchir", name: "Minchir", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "mintoria", name: "Mintoria", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "mog", name: "Mog", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "mordia-9", name: "Mordia 9", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "mort", name: "Mort", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "mortax-prime", name: "Mortax Prime", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "mox", name: "Mox", biome: "magma-desert", faction: null, color: "#c94a2b", icon: "🌋", displayed: false },
  { id: "myradesh", name: "Myradesh", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "myrium", name: "Myrium", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "nabatea-secundus", name: "Nabatea Secundus", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "navi-vii", name: "Navi VII", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "new-haven", name: "New Haven", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "new-kiruna", name: "New Kiruna", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "new-stockholm", name: "New Stockholm", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "nivel-43", name: "Nivel 43", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "nublaria-i", name: "Nublaria I", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "oasis", name: "Oasis", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "obari", name: "Obari", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "okul-vi", name: "Okul VI", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "omicron", name: "Omicron", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "oshaune", name: "Oshaune", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "oslo-station", name: "Oslo Station", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "osupsam", name: "Osupsam", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "outpost-32", name: "Outpost 32", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "overgoe-prime", name: "Overgoe Prime", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "pandion-xxiv", name: "Pandion-XXIV", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "parsh", name: "Parsh", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "partion", name: "Partion", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "pathfinder-v", name: "Pathfinder V", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "peacock", name: "Peacock", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "penta", name: "Penta", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "phact-bay", name: "Phact Bay", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "pherkad-secundus", name: "Pherkad Secundus", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "pilen-v", name: "Pilen V", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "pioneer-ii", name: "Pioneer II", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "polaris-prime", name: "Polaris Prime", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "pollux-31", name: "Pollux 31", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "prasa", name: "Prasa", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "primordia", name: "Primordia", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "propus", name: "Propus", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "prosperity-falls", name: "Prosperity Falls", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "providence", name: "Providence", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "p-pli-ix", name: "Pöpli IX", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "ras-algethi", name: "Ras Algethi", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "rasp", name: "Rasp", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "ratch", name: "Ratch", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "rd-4", name: "RD-4", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "reaf", name: "Reaf", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "regnus", name: "Regnus", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "rirga-bay", name: "Rirga Bay", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "rogue-5", name: "Rogue 5", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "sangis", name: "Sangis", biome: "autumn-forest", faction: null, color: "#b5722f", icon: "🍁", displayed: false },
  { id: "seasse", name: "Seasse", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "senge-23", name: "Senge 23", biome: "rocky-canyons", faction: null, color: "#8a7658", icon: "🪨", displayed: false },
  { id: "setia", name: "Setia", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "seyshel-beach", name: "Seyshel Beach", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "shallus", name: "Shallus", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "shelt", name: "Shelt", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "shete", name: "Shete", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "siemnot", name: "Siemnot", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "sirius", name: "Sirius", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "skaash", name: "Skaash", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "skat-bay", name: "Skat Bay", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "skitter", name: "Skitter", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "slif", name: "Slif", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "socorro-iii", name: "Socorro III", biome: "haunted-swamp", faction: null, color: "#3a4a3f", icon: "👻", displayed: false },
  { id: "solghast", name: "Solghast", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "spherion", name: "Spherion", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "stor-tha-prime", name: "Stor Tha Prime", biome: "boneyard", faction: null, color: "#9fb0ae", icon: "❄️", displayed: false },
  { id: "stout", name: "Stout", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "sulfura", name: "Sulfura", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "tarsh", name: "Tarsh", biome: "haunted-swamp", faction: null, color: "#3a4a3f", icon: "👻", displayed: false },
  { id: "termadon", name: "Termadon", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "terrek", name: "Terrek", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "the-weir", name: "The Weir", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "tibit", name: "Tibit", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "trandor", name: "Trandor", biome: "tundra", faction: null, color: "#8fa89a", icon: "🦌", displayed: false },
  { id: "troost", name: "Troost", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "turing", name: "Turing", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "ubanea", name: "Ubanea", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "ustotu", name: "Ustotu", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "valgaard", name: "Valgaard", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "valmox", name: "Valmox", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "vandalon-iv", name: "Vandalon IV", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "varylia-5", name: "Varylia 5", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "vega-bay", name: "Vega Bay", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "veil", name: "Veil", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "veld", name: "Veld", biome: "ionic-jungle", faction: null, color: "#2f5f8f", icon: "⚡", displayed: false },
  { id: "vindemitarix-prime", name: "Vindemitarix Prime", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "viridia-prime", name: "Viridia Prime", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "vog-sojoth", name: "Vog-sojoth", biome: "icy-glaciers", faction: null, color: "#bfe4ef", icon: "🧊", displayed: false },
  { id: "volterra", name: "Volterra", biome: "plains", faction: null, color: "#6b8a4e", icon: "⛰️", displayed: false },
  { id: "wasat", name: "Wasat", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "wezen", name: "Wezen", biome: "scorched-moor", faction: null, color: "#a3572f", icon: "🔥", displayed: false },
  { id: "widows-harbor", name: "Widow's Harbor", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "wilford-station", name: "Wilford Station", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "wraith", name: "Wraith", biome: "acidic-badlands", faction: null, color: "#9fbf3f", icon: "☣️", displayed: false },
  { id: "x-45", name: "X-45", biome: "basic-swamp", faction: null, color: "#4a5a3a", icon: "🐊", displayed: false },
  { id: "yed-prior", name: "Yed Prior", biome: "ionic-crimson", faction: null, color: "#8f2f3a", icon: "⚡", displayed: false },
  { id: "zagon-prime", name: "Zagon Prime", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
  { id: "zea-rugosia", name: "Zea Rugosia", biome: "desert-dunes", faction: null, color: "#c98a3a", icon: "🏜️", displayed: false },
  { id: "zefia", name: "Zefia", biome: "ethereal-jungle", faction: null, color: "#5a3f8f", icon: "✨", displayed: false },
  { id: "zegema-paradise", name: "Zegema Paradise", biome: "volcanic-jungle", faction: null, color: "#2f6b3a", icon: "🌋", displayed: false },
  { id: "zosma", name: "Zosma", biome: "moon", faction: null, color: "#9a9a9a", icon: "🌑", displayed: false },
  { id: "zzaniah-prime", name: "Zzaniah Prime", biome: "desert-cliffs", faction: null, color: "#c1863f", icon: "🌵", displayed: false },
];

/* ---------- Default theme ----------
   Drives the public outlook page's broadcast-style forecast card:
   a dusk sky gradient behind bold headline type, a header bar, and
   a light strip along the bottom for the low temperatures. */
const DEFAULT_THEME = {
  skyTop: "#0a1330",
  skyMid: "#1c3f6e",
  skyBottom: "#e2823f",
  sunGlow: "#ffd27a",
  bar: "#0c1a3a",
  lowBarBg: "#f4f1ea",
  lowBarText: "#0c1a3a",
  textPrimary: "#ffffff",
  accentPercent: "#8fd0ec",
};

const THEME_CSS_VAR_MAP = {
  skyTop: "--sky-top",
  skyMid: "--sky-mid",
  skyBottom: "--sky-bottom",
  sunGlow: "--sun-glow",
  bar: "--bar-dark",
  lowBarBg: "--low-bg",
  lowBarText: "--low-text",
  textPrimary: "--text-primary",
  accentPercent: "--accent-percent",
};

/* ---------- Default app settings ---------- */
const DEFAULT_SETTINGS = {
  rotationSeconds: 10,
};

/* ---------- Weather icon categories ----------
   Custom icons (uploaded images) can override any of these 8 buckets
   from the admin console. Each condition string is classified into a
   bucket by keyword so new/custom conditions still get a sensible icon. */
const DEFAULT_CATEGORY_ICONS = {
  clear: "☀️",
  cloudy: "☁️",
  storm: "⛈️",
  rain: "🌧️",
  snow: "🌨️",
  fog: "🌫️",
  hazard: "⚠️",
  wind: "💨",
};
const ICON_CATEGORY_LABELS = {
  clear: "Clear", cloudy: "Cloudy / Overcast", storm: "Storms", rain: "Rain",
  snow: "Snow / Ice", fog: "Fog / Mist", hazard: "Hazard / Toxic", wind: "Wind / Dust",
};

function categoryFor(condition) {
  const c = (condition || "").toLowerCase();
  if (/clear|vacuum clear/.test(c)) return "clear";
  if (/toxic|gas|spore|chem|corrosive|radiation|advisory|warning|lava|magma|ember|sulfur|bloom|chitin|fetid|ash/.test(c)) return "hazard";
  if (/snow|blizzard|ice|frost|sleet|hail|whiteout|glacial/.test(c)) return "snow";
  if (/rain|downpour|monsoon|drizzle|shower/.test(c)) return "rain";
  if (/fog|mist|haze/.test(c)) return "fog";
  if (/wind|dust|breeze|gust/.test(c)) return "wind";
  if (/storm|squall|twister|thunder|tropical|flux|static/.test(c)) return "storm";
  if (/overcast|cloud|still/.test(c)) return "cloudy";
  return "clear";
}

/* Returns the raw icon value (emoji string, or an image data-URL/URL)
   for a weather condition, honoring any admin-configured overrides. */
function iconFor(condition, config) {
  const cat = categoryFor(condition);
  const overrides = (config && config.icons) || {};
  return overrides[cat] || DEFAULT_CATEGORY_ICONS[cat] || "🌡️";
}

/* Detects whether an icon value is an image (uploaded data-URL or a
   direct image URL) versus a plain emoji/text glyph. */
function isImageValue(v) {
  return typeof v === "string" && (v.startsWith("data:image") || /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(v));
}

/* Renders an icon value (emoji or image) as HTML, for shared use by
   index.html (forecast icons, planet icon) and admin.html (previews). */
function renderIconHTML(value, cls) {
  if (!value) return "";
  cls = cls || "";
  if (isImageValue(value)) return `<img class="${cls}" src="${value}" alt="">`;
  return `<span class="${cls} icon-emoji">${value}</span>`;
}

/* Reads a File object (from an <input type=file>) as a base64 data URL. */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/* ---------- Weather generation ---------- */
function weightedPick(arr, weights) {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < arr.length; i++) {
    acc += weights[i];
    if (r <= acc) return arr[i];
  }
  return arr[arr.length - 1];
}

function generateDay(biomeKey, dateStr) {
  const biome = BIOMES[biomeKey] || BIOMES["desert-dunes"];
  const condition = biome.pool[Math.floor(Math.random() * biome.pool.length)];
  const [lo, hi] = biome.tempRange;
  const temp = Math.round(lo + Math.random() * (hi - lo));
  const severity = weightedPick(SEVERITIES, SEVERITY_WEIGHTS);
  const sevIdx = SEVERITIES.indexOf(severity);
  // "risk" mirrors a broadcast precip-chance readout, scaled by severity.
  const risk = Math.min(97, Math.max(3, Math.round(sevIdx * 20 + 8 + Math.random() * 15)));
  // Low temp trails the high by a randomized diurnal swing.
  const swing = Math.round(6 + Math.random() * 14);
  const low = temp - swing;
  return { date: dateStr, condition, temp, low, severity, risk };
}

function generateForecast(biomeKey, startDate, days = 7) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    out.push(generateDay(biomeKey, isoDate(d)));
  }
  return out;
}

/* ---------- Date helpers (local calendar day, not UTC) ---------- */
function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function todayIso() {
  return isoDate(new Date());
}
function daysBetween(a, b) {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db - da) / 86400000);
}

/* Fills in any fields missing from an older/foreign config export
   (used for both localStorage data and a fetched config.json) so the
   rest of the app can rely on every field being present. Returns
   whether anything had to be patched. */
function normalizeConfig(raw) {
  let dirty = false;
  if (!raw.settings) { raw.settings = { ...DEFAULT_SETTINGS }; dirty = true; }
  if (!raw.icons) { raw.icons = { ...DEFAULT_CATEGORY_ICONS }; dirty = true; }
  if (!raw.theme) { raw.theme = { ...DEFAULT_THEME }; dirty = true; }
  (raw.planets || []).forEach((p) => {
    if (!BIOMES[p.biome]) { p.biome = "desert-dunes"; dirty = true; }
    if (!p.forecast || !p.forecast.length) {
      p.forecast = generateForecast(p.biome, todayIso(), 7);
      dirty = true;
    }
    p.forecast.forEach((d) => {
      if (d.low === undefined) { d.low = d.temp - 10; dirty = true; }
      if (d.risk === undefined) { d.risk = 20; dirty = true; }
    });
  });
  return dirty;
}

/* ---------- Store ---------- */
const Store = {
  load() {
    let raw = null;
    try {
      raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      raw = null;
    }
    if (!raw || !raw.planets) {
      raw = this.buildDefault();
      this.save(raw);
    } else {
      // Migrate configs saved by earlier versions of this app.
      if (normalizeConfig(raw)) this.save(raw);
    }
    return raw;
  },

  /* Tries to fetch config.json from beside the current page. Returns
     the parsed config on success, or null if it doesn't exist, fails
     to load (e.g. opened via file:// with no server), or isn't a
     valid config (no planets array). Never throws. */
  async fetchRemoteConfig() {
    try {
      const res = await fetch(CONFIG_FILE, { cache: "no-store" });
      if (!res.ok) return null;
      const raw = await res.json();
      if (!raw || !Array.isArray(raw.planets) || raw.planets.length === 0) return null;
      normalizeConfig(raw);
      return raw;
    } catch (e) {
      return null;
    }
  },

  /* Preferred entry point for page startup: prefers a config.json
     dropped next to this page (so every visitor sees the same
     published config), and otherwise falls back to this browser's
     localStorage / the built-in defaults, exactly like load(). When
     config.json is found, it's also written to localStorage so the
     rest of the app (rollForward, admin edits, etc.) has a single
     consistent source to read/write during this session. */
  async init() {
    const remote = await this.fetchRemoteConfig();
    if (remote) {
      this.save(remote);
      return remote;
    }
    return this.load();
  },

  buildDefault() {
    const today = todayIso();
    const planets = DEFAULT_PLANETS.map((p) => ({
      ...p,
      forecast: generateForecast(p.biome, today, 7),
    }));
    return { theme: { ...DEFAULT_THEME }, settings: { ...DEFAULT_SETTINGS }, icons: { ...DEFAULT_CATEGORY_ICONS }, planets };
  },

  save(config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  },

  /* Advance forecasts so day 0 is always "today". Catches up however
     many calendar days have passed since the last visit (handles the
     tab being closed over midnight, or over several days). */
  rollForward(config) {
    const today = todayIso();
    const last = localStorage.getItem(DATE_KEY);
    if (!last) {
      localStorage.setItem(DATE_KEY, today);
      return { config, advanced: 0 };
    }
    let delta = daysBetween(last, today);
    if (delta <= 0) return { config, advanced: 0 };
    if (delta > 30) delta = 30; // safety cap

    config.planets.forEach((p) => {
      for (let i = 0; i < delta; i++) {
        p.forecast.shift();
        const lastDay = p.forecast[p.forecast.length - 1];
        const nextDate = new Date(lastDay ? lastDay.date : today);
        if (lastDay) nextDate.setDate(nextDate.getDate() + 1);
        p.forecast.push(generateDay(p.biome, isoDate(nextDate)));
      }
    });

    localStorage.setItem(DATE_KEY, today);
    this.save(config);
    return { config, advanced: delta };
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DATE_KEY);
  },

  exportJson(config) {
    return JSON.stringify(config, null, 2);
  },

  /* Pushes config.theme onto CSS custom properties consumed by the
     forecast-card styling, shared by index.html and admin.html. */
  applyTheme(theme) {
    const root = document.documentElement.style;
    Object.keys(THEME_CSS_VAR_MAP).forEach((key) => {
      if (theme[key]) root.setProperty(THEME_CSS_VAR_MAP[key], theme[key]);
    });
  },
};

const WEATHER_ICONS = null; // superseded by category-based iconFor() above
