# NASA Space Apps Challenge 2026: Official Submission Packet
**Project Name:** MoonWindow: Lunar Landing Site Navigator  
**Challenge:** Lunar Landing Site Navigator (Idea 04: MoonWindow)  
**Team Location:** Azare, Northern Nigeria & Global  
**Submission Deadline:** Sunday, 15 November 2026 at 11:59 p.m. local time  

---

## 1. Official Space Apps Portal Fields (Ready to Copy & Paste)

### Project Title
```text
MoonWindow: Lunar Landing Site Navigator
```

### Short Description / Tagline (Under 200 characters)
```text
An intuitive tool for evaluating lunar south pole landing sites across both location and time, visualizing Sun and Earth positions against the local 360° crater horizon.
```

### Detailed Project Description (Project Story)

#### The Problem & Insight
Missions to the Moon’s South Pole (including NASA Artemis III, VIPER, and commercial CLPS landers) face extreme, coupled environmental constraints:
1. **Low Grazing Solar Illumination:** Due to the Moon's axial tilt of only $1.54^\circ$, the Sun circles near the horizon (+0.5° to +1.5°), casting shadows that stretch for 40 kilometers.
2. **Earth Libration & Direct-to-Earth (DTE) Line of Sight:** Because the Moon's orbit is eccentric and inclined, Earth oscillates by $\pm 6.7^\circ$ in latitude and $\pm 7.9^\circ$ in longitude over a 27.3-day cycle. A lander on the wrong side of a ridge faces complete communication blackouts unless relay satellites are overhead.
3. **The Launch Slip Trap:** Missions rarely launch on the exact planned hour. A 72-hour Earth launch delay changes the landing phase, potentially shifting a lander from a 120-hour sunlight window into an 80-hour cryogenic blackout.

Existing orbital tools (like command-line SPICE scripts or raw GIS rasters) treat landing sites as static coordinates, making rapid, date-flexible trade-off exploration difficult for mission planners, educators, and the public.

#### Our Solution: MoonWindow
MoonWindow is an intuitive, browser-based mission decision-support application built around two core evaluation paradigms:
* **"Change Only the Date":** Planners can hold a candidate site fixed and slide the mission timeline across the 29.5-day synodic month, or test **launch date slips (+1 to +14 days)** to verify if solar array generation and communication survive unexpected delays.
* **"Change Only the Site":** Planners can hold a target date constant and toggle between candidate sites (e.g., Site A on Connecting Ridge vs. Site B on Malapert Massif). MoonWindow computes the **360° local crater rim skyline** $h(\theta)$ from digital elevation data and plots the exact clearance margins of the Sun and Earth above surrounding peaks.
* **Plain-Language Interpretation:** Automatically translates complex celestial angles into operational assessments: *"Sun at +1.5° is clear of the +0.4° crater rim (100% solar power); Earth at +8.0° clears terrain with +6.8° margin (DTE communication open)."*
* **Surface Traverse to Ice Access:** Includes a Dijkstra least-cost routing engine that calculates safe, traversable rover paths from the touchdown point to the boundary of the nearest Permanently Shadowed Region (PSR) ice deposit, complete with slope checks and an elevation profile.

#### Technical Architecture & Core Mechanisms
We engineered MoonWindow using clean, high-performance HTML5 Canvas, Three.js WebGL rendering, modern JavaScript, and astronomical orbital mechanics:
1. **Interactive 3D Moon Globe:** Photorealistic WebGL lunar sphere powered by Three.js and OrbitControls, textured with authentic NASA LROC photographic mosaic and LOLA laser altimeter displacement map. Features realistic Earthshine, dynamic synodic directional sunlight, deep-space starfield, illuminated cyan $80^\circ\text{S}$ Artemis boundary ring, and 3D surface raycasting with an animated landing beacon and pulsating target reticle.
2. **Digital Elevation Grid:** Built on a 150 × 150 cell digital elevation model ($40 \times 40\text{ km}$ area, $267\text{ m/cell}$ resolution derived from NASA LOLA altimetry).
3. **Local Slope & Laplacian Relief:** Computes landing slope via finite differences and surface micro-relief via discrete 8-neighborhood Laplacian operators.
4. **Ephemeris Physics Engine:** Models the Moon's draconic year ($346.62\text{d}$), anomalistic month ($27.55\text{d}$), synodic month ($29.53\text{d}$), and optical libration vectors.
5. **Multi-Criteria Telemetry:** Two-stage evaluation filtering cells by hard limits (slope $\le 8^\circ$, sun $\ge 30\%$, comms $\ge 20\%$, ice proximity $\le 5\text{ km}$) with live Artemis Safety Threshold verification pills.
6. **Decision Support & Exporter:** Keyboard presentation hotkeys (`Space`, `1-4`, `M`, `F`, `G`, `+/-`) and one-click JSON telemetry briefing export with printable flight report capability.

---

## 2. NASA Data, Resources & Tools Used

| NASA Resource | Role in Solution |
| :--- | :--- |
| **NASA LRO LOLA (Lunar Orbiter Laser Altimeter)** | Digital Elevation Models (DEMs) used for topography, slope calculations, local relief, and 360° crater rim obstacle masks. |
| **NASA SPICE / NAIF Ephemeris Standards** | Astronomical constants for lunar obliquity ($1.5427^\circ$), libration in latitude ($\pm 6.68^\circ$), libration in longitude ($\pm 7.91^\circ$), and synodic solar periods. |
| **NASA Artemis Candidate Landing Regions** | Geographical coordinates and mission parameters for prime south pole candidate sites (Connecting Ridge, Malapert Massif, Peak of Eternal Light, Nobile VIPER). |
| **NASA VIPER Landing Site Data** | Coordinates and terrain constraints for the VIPER volatiles rover target near Nobile Crater. |

---

## 3. Honest Account of Uncertainty & Limitations
*(Directly addressing the instructions on Pages 2, 6, and 18 of the Space Apps Planning Guide: "Explain where the evidence comes from and what remains uncertain. Do not describe a site as safe or mission-ready based on sunlight and communication alone.")*

1. **Macro vs. Micro Topography:** MoonWindow utilizes regional digital elevation models ($267\text{ m/cell}$). It cannot resolve sub-pixel boulder fields (< 10 meters) or steep local micro-craters that could overturn a lander.
2. **Soil Mechanics & Geotechnical Bearing:** Confirmation of regolith bearing strength requires in-situ surface penetration data or high-resolution radar sounders.
3. **Screening vs. Flight Certification:** MoonWindow is designed as an agile, rapid **screening and decision-support tool**. A site that scores 95/100 and passes all illumination/DTE criteria is a strong candidate for further study, not certified flight-ready.
4. **Relay Satellite Alternatives:** In our model, terrain blocking Earth cuts off Direct-to-Earth (DTE) communication. However, missions equipped with lunar relay orbiters (e.g. Lunar Pathfinder or Gateway) could maintain contact even during terrain occultation.

---

## 4. Alignment with the 5 Official Judging Criteria

### 1. Impact
* Enables flight planners and science teams to eliminate non-viable landing dates in seconds rather than days.
* Prevents mission-critical failures where a slight launch delay causes unexpected solar starvation or communication blackouts.
* Empowers university research teams, educators, and the public to participate in lunar mission architecture.

### 2. Creativity
* Introduces the **dual-axis "Change only the date" vs. "Change only the site"** exploration framework.
* Replaces static tables with an interactive 360° local crater rim skyline radar that lets users view the sky from the lander's perspective.
* Couples macro-landing site selection with micro-scale Dijkstra rover routing to nearby cryogenic ice traps.

### 3. Validity
* Grounded in real lunar topographic data and peer-reviewed celestial mechanics models.
* Accounts for the true physical curvature and elevation gradient of surrounding crater rims.
* Explicitly states resolution limits and in-situ uncertainties rather than overpromising safety.

### 4. Relevance
* Directly fulfills the challenge requirements for the Lunar South Pole (80°S–90°S).
* Focuses on the primary mission enablers for Artemis: sunlight for power and Earth line-of-sight for direct communications.

### 5. Presentation
* Delivered as a responsive, polished, dark-themed mission console.
* Fully usable by mission engineers, university students, and the general public.
* Seamless web deployment: run locally with `npm run dev` or view via any web hosting platform.
* Accompanied by a 6-page publication-quality technical whitepaper PDF: `MoonWindow_Technical_Documentation.pdf`.

---

## 5. Deliverables & Demonstration Checklist

- [x] **Working Web Application:** `index.html` (Vite dev/build in `dist/`).
- [x] **Compiled Technical Whitepaper PDF:** `MoonWindow_Technical_Documentation.pdf` (6-page publication-grade PDF).
- [x] **Pitch Deck & 2-Minute Video Script:** `PITCH_DECK_AND_VIDEO_SCRIPT.md` (7 slides + 120-second narration).
- [x] **Comprehensive Project Documentation:** `README.md` with full physical ephemeris formulas.
- [x] **Interactive Demos:** "Play Orbit" animation, 360° horizon mask canvas, Site A vs. Site B comparison tile, and Dijkstra rover traversal profile.
