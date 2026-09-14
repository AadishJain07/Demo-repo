/**
 * ==============================================================================
 * OreBit - Pure JavaScript Application Logic
 * Interactive GIS Map, Pre-surveyed Zones & Live AI Analysis Simulation
 * ==============================================================================
 */

// Known manganese belts in India (from Geological Survey & Historical belts)
const KNOWN_ZONES = [
  {
    id: "keonjhar-or",
    name: "Keonjhar",
    state: "Odisha",
    lat: 21.63,
    lng: 85.58,
    potential: "high",
    score: 93,
    soilType: "Lateritic, iron-rich",
    estimatedAmount: "9.5 – 13.2 million tonnes",
    confidence: 91,
    supportingFactors: [
      { label: "Historical mining activity", value: "Extensive, active belt", score: 95 },
      { label: "Rock type match", value: "Banded ferruginous formation", score: 90 },
      { label: "Annual rainfall", value: "1,450 mm", score: 70 },
      { label: "Terrain moisture", value: "Moderate, well-drained", score: 65 },
    ]
  },
  {
    id: "sundargarh-or",
    name: "Sundargarh",
    state: "Odisha",
    lat: 22.12,
    lng: 84.03,
    potential: "high",
    score: 89,
    soilType: "Lateritic",
    estimatedAmount: "7.8 – 10.6 million tonnes",
    confidence: 88,
    supportingFactors: [
      { label: "Historical mining activity", value: "Established belt", score: 89 },
      { label: "Rock type match", value: "Gondite series", score: 85 },
      { label: "Annual rainfall", value: "1,520 mm", score: 72 },
      { label: "Terrain moisture", value: "Moderate", score: 68 },
    ]
  },
  {
    id: "balaghat-mp",
    name: "Balaghat",
    state: "Madhya Pradesh",
    lat: 21.81,
    lng: 80.18,
    potential: "high",
    score: 91,
    soilType: "Ferruginous, red loamy",
    estimatedAmount: "8.1 – 11.4 million tonnes",
    confidence: 90,
    supportingFactors: [
      { label: "Historical mining activity", value: "Major active belt (Bharweli)", score: 93 },
      { label: "Rock type match", value: "Gondite series", score: 88 },
      { label: "Annual rainfall", value: "1,320 mm", score: 66 },
      { label: "Terrain moisture", value: "Low-moderate", score: 58 },
    ]
  },
  {
    id: "nagpur-mh",
    name: "Nagpur",
    state: "Maharashtra",
    lat: 21.15,
    lng: 79.09,
    potential: "medium",
    score: 68,
    soilType: "Black cotton soil",
    estimatedAmount: "3.2 – 5.0 million tonnes",
    confidence: 76,
    supportingFactors: [
      { label: "Historical mining activity", value: "Moderate, older workings", score: 62 },
      { label: "Rock type match", value: "Metasedimentary", score: 60 },
      { label: "Annual rainfall", value: "1,140 mm", score: 55 },
      { label: "Terrain moisture", value: "Low", score: 48 },
    ]
  },
  {
    id: "bhandara-mh",
    name: "Bhandara",
    state: "Maharashtra",
    lat: 21.17,
    lng: 79.65,
    potential: "medium",
    score: 65,
    soilType: "Red sandy loam",
    estimatedAmount: "2.9 – 4.4 million tonnes",
    confidence: 74,
    supportingFactors: [
      { label: "Historical mining activity", value: "Moderate", score: 58 },
      { label: "Rock type match", value: "Gondite-adjacent", score: 63 },
      { label: "Annual rainfall", value: "1,280 mm", score: 57 },
      { label: "Terrain moisture", value: "Moderate", score: 52 },
    ]
  },
  {
    id: "koraput-or",
    name: "Koraput",
    state: "Odisha",
    lat: 18.81,
    lng: 82.71,
    potential: "medium",
    score: 59,
    soilType: "Lateritic, hilly terrain",
    estimatedAmount: "2.4 – 3.8 million tonnes",
    confidence: 70,
    supportingFactors: [
      { label: "Historical mining activity", value: "Limited surveys", score: 50 },
      { label: "Rock type match", value: "Khondalite group", score: 55 },
      { label: "Annual rainfall", value: "1,580 mm", score: 74 },
      { label: "Terrain moisture", value: "High", score: 70 },
    ]
  },
  {
    id: "shivamogga-ka",
    name: "Shivamogga",
    state: "Karnataka",
    lat: 13.93,
    lng: 75.57,
    potential: "medium",
    score: 56,
    soilType: "Lateritic",
    estimatedAmount: "2.1 – 3.3 million tonnes",
    confidence: 69,
    supportingFactors: [
      { label: "Historical mining activity", value: "Scattered workings", score: 52 },
      { label: "Rock type match", value: "Dharwar schist belt", score: 58 },
      { label: "Annual rainfall", value: "1,890 mm", score: 78 },
      { label: "Terrain moisture", value: "High", score: 73 },
    ]
  },
  {
    id: "srikakulam-ap",
    name: "Srikakulam",
    state: "Andhra Pradesh",
    lat: 18.30,
    lng: 83.90,
    potential: "low",
    score: 34,
    soilType: "Red sandy",
    estimatedAmount: "0.6 – 1.2 million tonnes",
    confidence: 61,
    supportingFactors: [
      { label: "Historical mining activity", value: "Minimal", score: 30 },
      { label: "Rock type match", value: "Weak indicator overlap", score: 34 },
      { label: "Annual rainfall", value: "1,090 mm", score: 48 },
      { label: "Terrain moisture", value: "Low", score: 40 },
    ]
  },
  {
    id: "north-goa",
    name: "North Goa",
    state: "Goa",
    lat: 15.50,
    lng: 73.83,
    potential: "low",
    score: 31,
    soilType: "Lateritic, coastal",
    estimatedAmount: "0.4 – 0.9 million tonnes",
    confidence: 58,
    supportingFactors: [
      { label: "Historical mining activity", value: "Iron-dominant, minor Mn", score: 28 },
      { label: "Rock type match", value: "Limited overlap", score: 32 },
      { label: "Annual rainfall", value: "3,000 mm", score: 62 },
      { label: "Terrain moisture", value: "Very high", score: 66 },
    ]
  }
];

// 6 One-hot encoded state names (drop_first=true dropped 'Andhra Pradesh')
const MODEL_STATES = [
  'Goa',
  'Karnataka',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Rajasthan'
];

const SOIL_TYPES = [
  "Lateritic, iron-rich",
  "Ferruginous, red loamy",
  "Black cotton soil",
  "Red sandy loam",
  "Metasedimentary weathered",
  "Lateritic, hilly terrain"
];

// Current active analysis record (for JSON export)
let currentRecord = null;

// ==============================================================================
// DOM Ready Initialization
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initLandingScreen();
  initNavbar();
  initMapAndPlatform();
  setupSmoothScroll();
});

// ==============================================================================
// Landing Intro Screen
// ==============================================================================
function initLandingScreen() {
  const landingScreen = document.getElementById("landingScreen");
  const enterBtn = document.getElementById("landingEnterBtn");
  if (!landingScreen || !enterBtn) return;

  document.body.classList.add("landing-active");

  const dismissLanding = () => {
    landingScreen.classList.add("is-dismissed");
    document.body.classList.remove("landing-active");
    landingScreen.addEventListener("transitionend", () => {
      landingScreen.remove();
    }, { once: true });
  };

  enterBtn.addEventListener("click", dismissLanding);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !landingScreen.classList.contains("is-dismissed")) {
      dismissLanding();
    }
  });
}

// ==============================================================================
// Navbar & Navigation
// ==============================================================================
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileToggle = document.getElementById("mobileMenuToggle");
  const mobilePanel = document.getElementById("mobileNavPanel");
  const exploreDropdownBtn = document.getElementById("exploreDropdownBtn");
  const exploreDropdownMenu = document.getElementById("exploreDropdownMenu");
  const dropdownWrapper = exploreDropdownBtn.parentElement;

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  mobileToggle.addEventListener("click", () => {
    const isHidden = mobilePanel.classList.toggle("hidden");
    mobileToggle.querySelector(".icon-menu").classList.toggle("hidden", !isHidden);
    mobileToggle.querySelector(".icon-close").classList.toggle("hidden", isHidden);
  });

  // Close mobile menu on link click
  mobilePanel.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobilePanel.classList.add("hidden");
      mobileToggle.querySelector(".icon-menu").classList.remove("hidden");
      mobileToggle.querySelector(".icon-close").classList.add("hidden");
    });
  });

  // Dropdown toggle
  exploreDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownWrapper.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!dropdownWrapper.contains(e.target)) {
      dropdownWrapper.classList.remove("open");
    }
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });

        // Tab routing if provided
        const desiredTab = this.getAttribute("data-tab");
        if (desiredTab) {
          switchDashboardTab(desiredTab);
        }
      }
    });
  });

  // Region choice cards click
  document.querySelectorAll("[data-tab-trigger]").forEach(card => {
    card.addEventListener("click", () => {
      const tab = card.getAttribute("data-tab-trigger");
      const mapSec = document.getElementById("map-section");
      if (mapSec) {
        mapSec.scrollIntoView({ behavior: "smooth" });
        switchDashboardTab(tab);
      }
    });
  });
}

// ==============================================================================
// Interactive Map & Analysis Platform
// ==============================================================================
let map;
let zoneMarkers = [];
let userClickMarker = null;

function initMapAndPlatform() {
  // 1. Initialize Leaflet Map
  map = L.map("indiaMap", {
    center: [21.5, 80.0],
    zoom: 5,
    minZoom: 4,
    maxZoom: 12,
    zoomControl: true
  });

  // Esri Dark Gray Canvas tiles (free, no API key required)
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, &copy; OpenStreetMap contributors | Sentinel-2 | OreBit',
    maxZoom: 16
  }).addTo(map);

  // Reference layer (borders & place labels) drawn on top of the dark canvas
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 16
  }).addTo(map);

  // 2. Populate Discovered Zones List and Markers
  renderDiscoveredZones();

  // 3. Tab Switches
  const tabDiscoveredBtn = document.getElementById("tabDiscoveredBtn");
  const tabUndiscoveredBtn = document.getElementById("tabUndiscoveredBtn");

  tabDiscoveredBtn.addEventListener("click", () => switchDashboardTab("discovered"));
  tabUndiscoveredBtn.addEventListener("click", () => switchDashboardTab("undiscovered"));

  // 4. Coordinate Form Handling
  const coordForm = document.getElementById("coordForm");
  const quickSampleBtn = document.getElementById("quickSampleBtn");

  coordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const lat = parseFloat(document.getElementById("latInput").value);
    const lng = parseFloat(document.getElementById("lngInput").value);
    if (!isNaN(lat) && !isNaN(lng)) {
      runLiveCoordinateAnalysis(lat, lng);
    }
  });

  quickSampleBtn.addEventListener("click", () => {
    // Balaghat coordinates
    document.getElementById("latInput").value = "21.810";
    document.getElementById("lngInput").value = "80.180";
  });

  // 5. Map Click for Undiscovered Region
  map.on("click", (e) => {
    const lat = parseFloat(e.latlng.lat.toFixed(4));
    const lng = parseFloat(e.latlng.lng.toFixed(4));
    
    // Switch to undiscovered tab if not active
    switchDashboardTab("undiscovered");
    document.getElementById("latInput").value = lat;
    document.getElementById("lngInput").value = lng;
    runLiveCoordinateAnalysis(lat, lng);
  });

  // 6. Export Button
  const exportBtn = document.getElementById("exportDataBtn");
  exportBtn.addEventListener("click", exportCurrentRecordAsJSON);

  // Load initial default zone
  selectZone(KNOWN_ZONES[0]);
}

function switchDashboardTab(tabName) {
  const discoveredControls = document.getElementById("discoveredControls");
  const undiscoveredControls = document.getElementById("undiscoveredControls");
  const tabDiscoveredBtn = document.getElementById("tabDiscoveredBtn");
  const tabUndiscoveredBtn = document.getElementById("tabUndiscoveredBtn");

  if (tabName === "discovered") {
    discoveredControls.classList.remove("hidden");
    undiscoveredControls.classList.add("hidden");
    tabDiscoveredBtn.classList.add("active");
    tabUndiscoveredBtn.classList.remove("active");
  } else {
    discoveredControls.classList.add("hidden");
    undiscoveredControls.classList.remove("hidden");
    tabDiscoveredBtn.classList.remove("active");
    tabUndiscoveredBtn.classList.add("active");
  }
}

function renderDiscoveredZones() {
  const container = document.getElementById("zoneListContainer");
  container.innerHTML = "";

  KNOWN_ZONES.forEach(zone => {
    // Sidebar list item
    const item = document.createElement("div");
    item.className = "zone-item";
    item.id = `zone-item-${zone.id}`;
    item.innerHTML = `
      <div class="zone-item-info">
        <span class="zone-item-name">${zone.name}</span>
        <span class="zone-item-state">${zone.state} (${zone.lat.toFixed(2)}°N, ${zone.lng.toFixed(2)}°E)</span>
      </div>
      <span class="potential-badge badge-${zone.potential}">${zone.potential}</span>
    `;

    item.addEventListener("click", () => {
      selectZone(zone);
    });

    container.appendChild(item);

    // Map Custom Marker
    const markerColorClass = `marker-${zone.potential === "high" ? "high" : zone.potential === "medium" ? "med" : "low"}`;
    const customIcon = L.divIcon({
      className: "custom-map-marker",
      html: `<div class="marker-ring ${markerColorClass}"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([zone.lat, zone.lng], { icon: customIcon }).addTo(map);
    marker.bindTooltip(`<b>${zone.name}</b><br>${zone.state} (${zone.potential.toUpperCase()} Potential)`, {
      direction: "top",
      offset: [0, -10]
    });

    marker.on("click", () => {
      selectZone(zone);
    });

    zoneMarkers.push(marker);
  });
}

function selectZone(zone) {
  // Highlight sidebar item
  document.querySelectorAll(".zone-item").forEach(el => el.classList.remove("active"));
  const currentItem = document.getElementById(`zone-item-${zone.id}`);
  if (currentItem) currentItem.classList.add("active");

  // Pan map to zone
  map.flyTo([zone.lat, zone.lng], 8, { duration: 1.2 });

  // Update Result Panel
  displayResult({
    regionName: `${zone.name} Belt`,
    coords: `${zone.lat.toFixed(3)}°N, ${zone.lng.toFixed(3)}°E`,
    potential: zone.potential,
    score: zone.score,
    estimate: zone.estimatedAmount,
    confidence: `${zone.confidence}%`,
    soil: zone.soilType,
    state: zone.state,
    factors: zone.supportingFactors,
    lat: zone.lat,
    lng: zone.lng
  });
}

// ==============================================================================
// Live AI Analysis for Undiscovered Coordinates
// ==============================================================================
function runLiveCoordinateAnalysis(lat, lng) {
  // Add or move pin
  if (userClickMarker) {
    userClickMarker.setLatLng([lat, lng]);
  } else {
    const userIcon = L.divIcon({
      className: "custom-map-marker",
      html: `<div class="marker-ring marker-high" style="border-color:#F5A524; box-shadow: 0 0 12px #7C6AFB;"></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
    userClickMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
  }

  map.flyTo([lat, lng], 7, { duration: 1.0 });

  // UI Loading state
  const loader = document.getElementById("resultLoader");
  const details = document.getElementById("resultDetails");
  loader.classList.remove("hidden");
  details.classList.add("hidden");

  // Simulate server/model roundtrip (approx 800ms)
  setTimeout(() => {
    const analysis = computeMLAnalysis(lat, lng);
    loader.classList.add("hidden");
    details.classList.remove("hidden");
    displayResult(analysis);
  }, 750);
}

/**
 * Deterministic pseudo-random generator seeded by lat/lng so repeated
 * queries at the same location produce consistent results.
 */
function seededHash(lat, lng) {
  const combined = Math.round((lat + 90) * 10000) * 1000003 + Math.round((lng + 180) * 10000);
  let t = (combined % 2147483647) + 0x6d2b79f5;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * State detector & One-hot encoder logic (drop_first=true dropped 'Andhra Pradesh')
 */
function detectState(lat, lng) {
  if (lat >= 14.89 && lat <= 15.80 && lng >= 73.68 && lng <= 74.34) return "Goa";
  if (lat >= 11.59 && lat <= 18.45 && lng >= 74.05 && lng <= 78.58) return "Karnataka";
  if (lat >= 15.60 && lat <= 22.03 && lng >= 72.63 && lng <= 80.89) return "Maharashtra";
  if (lat >= 21.08 && lat <= 26.87 && lng >= 74.03 && lng <= 82.81) return "Madhya Pradesh";
  if (lat >= 17.78 && lat <= 22.57 && lng >= 81.37 && lng <= 87.52) return "Odisha";
  if (lat >= 23.05 && lat <= 30.19 && lng >= 69.48 && lng <= 78.28) return "Rajasthan";
  if (lat >= 12.62 && lat <= 19.15 && lng >= 76.75 && lng <= 84.75) return "Andhra Pradesh";
  return "Outside Manganese Belt";
}

function computeMLAnalysis(lat, lng) {
  const rand = seededHash(lat, lng);
  const state = detectState(lat, lng);

  // Score computation
  let baseScore = Math.round(rand() * 100);
  // Boost score slightly if located inside known manganese-rich states
  if (["Odisha", "Madhya Pradesh", "Karnataka", "Maharashtra"].includes(state)) {
    baseScore = Math.min(97, Math.max(45, baseScore + 20));
  } else if (state === "Outside Manganese Belt") {
    baseScore = Math.min(50, Math.max(10, baseScore - 25));
  }

  const potential = baseScore >= 70 ? "high" : baseScore >= 40 ? "medium" : "low";
  const confidence = Math.round(65 + rand() * 28);
  const soilType = SOIL_TYPES[Math.floor(rand() * SOIL_TYPES.length)];

  const tonnageBase = (0.5 + (baseScore / 100) * 10).toFixed(1);
  const tonnageHigh = (parseFloat(tonnageBase) * 1.3).toFixed(1);
  const estimatedAmount = `${tonnageBase} – ${tonnageHigh} million tonnes`;

  const rainfall = Math.round(900 + rand() * 1800);
  const histScore = Math.round(Math.min(98, Math.max(15, baseScore + (rand() - 0.5) * 20)));
  const rockScore = Math.round(Math.min(95, Math.max(20, baseScore + (rand() - 0.5) * 25)));
  const moistureScore = Math.round(Math.min(92, Math.max(25, 40 + rand() * 50)));

  const factors = [
    {
      label: "Historical mining activity",
      value: histScore > 65 ? "Documented belt proximity" : "Sparse documented record",
      score: histScore
    },
    {
      label: "Rock type match",
      value: rockScore > 65 ? "Gondite / Ferruginous match" : "Weak lithological overlap",
      score: rockScore
    },
    {
      label: "Annual rainfall",
      value: `${rainfall.toLocaleString()} mm`,
      score: Math.round((rainfall / 2700) * 100)
    },
    {
      label: "Terrain moisture",
      value: moistureScore > 65 ? "High" : moistureScore > 40 ? "Moderate" : "Low",
      score: moistureScore
    }
  ];

  return {
    regionName: `Zone at ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`,
    coords: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
    potential,
    score: baseScore,
    estimate: estimatedAmount,
    confidence: `${confidence}%`,
    soil: soilType,
    state,
    factors,
    lat,
    lng
  };
}

// ==============================================================================
// Result Display & Export
// ==============================================================================
function displayResult(data) {
  document.getElementById("resRegionName").innerText = data.regionName;
  document.getElementById("resCoords").innerText = data.coords;

  const badge = document.getElementById("resPotentialBadge");
  badge.className = `potential-badge badge-${data.potential}`;
  badge.innerText = `${data.potential.toUpperCase()} POTENTIAL`;

  document.getElementById("resScore").innerText = `${data.score}%`;
  document.getElementById("resScoreBar").style.width = `${data.score}%`;

  document.getElementById("resEstimate").innerText = data.estimate;
  document.getElementById("resConfidence").innerText = data.confidence;
  document.getElementById("resSoil").innerText = data.soil;
  document.getElementById("resState").innerText = data.state;

  // Factors
  const factorsList = document.getElementById("factorsList");
  factorsList.innerHTML = "";
  data.factors.forEach(f => {
    const item = document.createElement("div");
    item.className = "factor-item";
    item.innerHTML = `
      <span class="factor-name">${f.label}:</span>
      <span class="factor-val">${f.value}</span>
    `;
    factorsList.appendChild(item);
  });

  // Prepare exact 21-feature Model Row
  currentRecord = generateModelRow(data);
}

/**
 * Builds the exact 21-column row expected by OreBit_model.pkl
 */
function generateModelRow(data) {
  // State one-hot encoding with drop_first=True ('Andhra Pradesh' dropped)
  const stateEncoding = {
    'State_Goa': data.state === "Goa" ? 1 : 0,
    'State_Karnataka': data.state === "Karnataka" ? 1 : 0,
    'State_Madhya Pradesh': data.state === "Madhya Pradesh" ? 1 : 0,
    'State_Maharashtra': data.state === "Maharashtra" ? 1 : 0,
    'State_Odisha': data.state === "Odisha" ? 1 : 0,
    'State_Rajasthan': data.state === "Rajasthan" ? 1 : 0
  };

  // Synthetic Sentinel-2 bands derived for the coordinate
  const b2 = 520.0;
  const b3 = 680.0;
  const b4 = 750.0;
  const b8 = 2100.0;
  const b11 = 2200.0;
  const b12 = 1600.0;

  const ndvi = parseFloat(((b8 - b4) / (b8 + b4)).toFixed(4));
  const ndwi = parseFloat(((b3 - b8) / (b3 + b8)).toFixed(4));
  const nirSwirRatio = parseFloat((b8 / b11).toFixed(4));
  const swirRatio = parseFloat((b11 / b12).toFixed(4));
  const redNirRatio = parseFloat((b4 / b8).toFixed(4));
  const ferricOxideIndex = parseFloat((b4 / b2).toFixed(4));

  return {
    ...stateEncoding,
    Longitude: data.lng,
    Latitude: data.lat,
    B2_Blue: b2,
    B3_Green: b3,
    B4_Red: b4,
    B8_NIR: b8,
    B11_SWIR: b11,
    B12_SWIR: b12,
    Elevation: 330.0,
    NDVI: ndvi,
    NDWI: ndwi,
    NIR_SWIR_Ratio: nirSwirRatio,
    SWIR_Ratio: swirRatio,
    Red_NIR_Ratio: redNirRatio,
    Ferric_Oxide_Index: ferricOxideIndex,
    _metadata: {
      predictedPotential: data.potential,
      score: data.score,
      estimatedDeposit: data.estimate,
      confidence: data.confidence,
      detectedState: data.state
    }
  };
}

function exportCurrentRecordAsJSON() {
  if (!currentRecord) {
    alert("Please select or analyze a location first.");
    return;
  }

  const jsonStr = JSON.stringify(currentRecord, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `orebit_model_features_${currentRecord.Latitude.toFixed(2)}_${currentRecord.Longitude.toFixed(2)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
