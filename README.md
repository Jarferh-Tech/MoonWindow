# MoonWindow | Lunar Landing Site Navigator
**NASA Space Apps Challenge 2026**

> An intuitive, high-performance decision-support and educational application for evaluating, screening, and comparing candidate landing sites across the **Lunar South Pole (80°S–90°S)**. Visualizes Sun and Earth positions relative to local topographic crater rims, assessing solar power viability, Direct-to-Earth (DTE) communication windows, launch date slip contingencies, and Dijkstra rover routes to water-ice access points in Permanently Shadowed Regions (PSRs).

---

## 🚀 Live Demo & Getting Started

The application is completely self-contained with **zero external build steps or server dependencies required**.

```bash
# 1. Navigate to the project directory
cd /home/jaafar/Dev/MoonWindow

# 2. Run with any local server or Vite dev server:
npm run dev
# or
npx serve .
```

Visit `http://localhost:3000/` to test in real-time.

---

## ⚙️ Core Technical Mechanisms

MoonWindow operates through **six interconnected mathematical, astronomical, and computational mechanisms**:

### 1. Topographic Terrain & Micro-Relief Engine
The foundation is a $150 \times 150$ elevation grid representing a $40 \times 40\text{ km}$ area of the Lunar South Pole (cell resolution $\Delta x = \Delta y \approx 267\text{ m/pixel}$, corresponding to NASA's LRO LOLA sensor):

* **Local Landing Slope (3×3 Footprint):** Calculated using central finite differences:
  $$\frac{\partial z}{\partial x} = \frac{H(x+1, y) - H(x-1, y)}{2 \cdot \Delta x}, \quad \frac{\partial z}{\partial y} = \frac{H(x, y+1) - H(x, y-1)}{2 \cdot \Delta y}$$
  $$\theta_{\text{slope}} = \arctan\left(\sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\right)$$
* **Surface Roughness / Micro-Relief:** Evaluated via a discrete 8-neighborhood Laplacian filter measuring terrain deviation from the local plane:
  $$\text{Relief}(x, y) = \left| H(x, y) - \frac{1}{8}\sum_{q=1}^8 H(x+\Delta x_q, y+\Delta y_q) \right|$$

### 2. 360° Horizon Obstacle Masking Mechanism ($h(\theta)$)
Because the Sun and Earth sit extremely close to the horizon at the lunar poles, a crater rim several kilometers away can completely block sunlight and communications.

To compute the **true obstacle silhouette** around any candidate landing site $(x_0, y_0, H_0)$:
1. The horizon is partitioned into 72 discrete azimuth bins $\theta_b \in [0^\circ, 360^\circ]$ ($5^\circ$ angular resolution).
2. For each azimuth direction $\vec{u} = (\sin\theta, -\cos\theta)$, the engine performs **ray marching** outward across the digital elevation model up to $30\text{ km}$:
   $$h(\theta) = \max_{k} \arctan\left(\frac{H_k - H_0}{d_k}\right)$$
   where $H_k$ is the terrain height at step $k$, and $d_k$ is the horizontal distance.
3. $h(\theta)$ defines the **crater skyline barrier**. If a celestial body at azimuth $\theta$ has an elevation angle below $h(\theta)$, it is occluded by the rim.

### 3. Solar & Earth Ephemeris Mechanics

#### A. Solar Illumination & Power Flux
The Moon's axial tilt relative to the ecliptic is only $1.54^\circ$. The Sun grazes the horizon, revolving $360^\circ$ over a $29.53$-day synodic cycle:
$$\theta_{\text{sun}}(t) = \left(\frac{t \pmod{29.53059}}{29.53059}\right) \times 360^\circ$$
$$\phi_{\text{sun}}(t) = \phi_0 + 0.3^\circ \sin\left(\frac{2\pi t}{346.6}\right)$$

* **Illumination Test:**
  $$\text{Sunlit}(t) = \begin{cases} 1 & \text{if } \phi_{\text{sun}}(t) > h(\theta_{\text{sun}}(t)) \quad \text{(Solar Arrays Active)} \\ 0 & \text{if } \phi_{\text{sun}}(t) \le h(\theta_{\text{sun}}(t)) \quad \text{(Shadow Blackout)} \end{cases}$$

#### B. Direct-to-Earth (DTE) Comms & Optical Libration
Although the Moon is tidally locked to Earth, orbital eccentricity and inclination cause **optical libration**—Earth appears to oscillate in an ellipse across the polar sky ($\pm 6.68^\circ$ in latitude over a 27.21-day draconic cycle, $\pm 7.91^\circ$ in longitude over a 27.55-day anomalistic cycle):
$$\theta_{\text{earth}}(t) = 20^\circ + 7.91^\circ \sin\left(\frac{2\pi t}{27.212}\right)$$
$$\phi_{\text{earth}}(t) = 3.5^\circ + 4.5^\circ \cos\left(\frac{2\pi t}{27.212}\right)$$

* **Communication Clearance Margin:**
  $$\Delta_{\text{DTE}}(t) = \phi_{\text{earth}}(t) - h(\theta_{\text{earth}}(t))$$
  - If $\Delta_{\text{DTE}}(t) > 0^\circ \implies$ **Direct Line-of-Sight Open**.
  - If $\Delta_{\text{DTE}}(t) \le 0^\circ \implies$ **Occulted by Rim (Radio Blackout)**.

### 4. Multi-Criteria Site Suitability Model

The system evaluates candidate cells through a two-stage filter:

1. **Stage 1: Hard Operational Thresholds (Go / No-Go)**
   A cell is strictly excluded if:
   $$\text{Slope}_{3\times3} > \theta_{\max}\ (8^\circ) \quad \lor \quad \text{Sunlight} < S_{\min}\ (30\%) \quad \lor \quad \text{EarthComms} < C_{\min}\ (20\%)$$

2. **Stage 2: Weighted Composite Score (0 to 100)**
   For cells that pass hard limits:
   $$\text{Score} = 100 \times \frac{w_{\text{safe}} \cdot P_{\text{safe}} + w_{\text{power}} \cdot P_{\text{power}} + w_{\text{comms}} \cdot P_{\text{comms}} + w_{\text{res}} \cdot P_{\text{res}}}{w_{\text{safe}} + w_{\text{power}} + w_{\text{comms}} + w_{\text{res}}}$$
   - $P_{\text{safe}} = \left(1 - \frac{\text{slope}}{8^\circ}\right) \times \left(1 - \frac{\text{relief}}{20\text{m}}\right)$
   - $P_{\text{power}} = \text{Illumination Share} \in [0, 1]$
   - $P_{\text{comms}} = \text{Earth Visibility Share} \in [0, 1]$
   - $P_{\text{res}} = \exp\left(-\frac{d_{\text{ice}}}{5\text{ km}}\right)$ (exponential decay with distance to cold-trap ice)

### 5. Dijkstra Least-Cost Rover Routing to Ice Access
To explore scientific access to water ice stored inside **Permanently Shadowed Regions (PSRs)**:
1. Cells with annual illumination $< 5\%$ are identified as PSRs.
2. The outer perimeter of the PSR is extracted as the target boundary.
3. A **Dijkstra priority-queue algorithm** computes the minimum-energy traversable path from the lander to the closest ice boundary.
4. **Traversal Cost Metric between cells $i \to j$:**
   $$\text{Cost}_{ij} = d_{ij} \cdot \left[1 + 3\left(\frac{\text{slope}_{ij}}{\text{slope}_{\text{max\_rover}}}\right)^2\right] + \alpha_{\text{sun}} \cdot d_{ij} \cdot (1 - \text{illum}_j)$$
   - Penalizes steep slopes non-linearly to prevent rover tipping.
   - Applies an energy penalty $\alpha_{\text{sun}}$ for navigating in dark, cryogenic ground.

### 6. Dual-Axis Screening Model
| Axis | Question Addressed | How It Operates |
| :--- | :--- | :--- |
| **"Change only the date"** | *How resilient is this specific site to launch delays?* | Keeps the site fixed $(x_0, y_0)$ while scrubbing the 29.5-day timeline and adding a **Launch Slip Contingency** ($+0\text{d}$ to $+14\text{d}$) to test whether delayed arrival triggers an unrecoverable shadow freeze. |
| **"Change only the site"** | *Which candidate site is superior on our chosen launch date?* | Keeps the arrival date fixed while switching between **Site A** and **Site B** in the side-by-side trade-off box to compare slope, solar margin, and DTE clearance simultaneously. |

---

## ⚠️ Honest Accounting of Uncertainty (NASA Standard)
The algorithm explicitly incorporates the limitation stated on pages 2 and 18 of the NASA Space Apps guide:
* Orbital LOLA elevation models ($267\text{ m/pixel}$) are valid for **regional macro-screening** (slopes, lighting, and communication geometry).
* They **cannot certify centimeter-scale landing safety**. Boulders smaller than 10 meters, micro-craters, and surface geotechnical bearing strength require in-situ terminal hazard detection systems and high-resolution imaging cameras (LROC NAC $0.5\text{ m}$).

---

## 🛰️ User Interface Features

- **Photorealistic NASA 3D Moon Globe & 2D Cartography:**
  - **3D WebGL Moon (Three.js & OrbitControls):** Full 3D lunar sphere textured with authentic NASA LROC photographic mosaic and LOLA laser altimeter displacement map. Features realistic Earthshine, directional solar illumination tracking the 29.53-day synodic cycle, deep-space starfield, and glowing cyan $80^\circ\text{S}$ Artemis boundary ring.
  - **3D Surface Raycasting & Pulsing Reticle:** Click anywhere on the South Pole terrain ($80^\circ\text{S}–90^\circ\text{S}$) or candidate pins to select a touchdown site. Features a vertical golden laser beacon tower and an animated, pulsating landing reticle on the surface.
  - **Cinematic Camera Fly-In:** Smooth camera interpolation (lerp) smoothly transitions between the whole lunar globe in deep space and zoomed landing zones.
  - **2D Cartography View:** Instant toggle to LOLA digital elevation map with shaded relief, safety heatmaps, cartographic landmark labels, and PSR ice cold-traps.
- **Mission-Control Telemetry Cards:**
  - **Card 1: Destination Details:** Instant suitability score ($0$–$100$), `SUITABLE` / `EXCLUDED` status pill, concise criteria summary, and four telemetry metrics with status dots (Ground Slope &le; 8°, Solar Power &ge; 30%, Earth DTE &ge; 20%, Water Ice &le; 5.0 km).
  - **Artemis Safety Thresholds Checklist:** Real-time visual verification indicators confirming compliance across all four critical NASA operational constraints simultaneously.
  - **Card 2: Target Sites & Orbit Simulation:** Clean numbered callouts (`01` Connecting Ridge, `02` Malapert Massif, `03` Peak of Light, `04` Nobile VIPER), synodic month slider with quick-day jumps, and launch slip contingency (+0d to +14d).
- **Presentation Hotkeys & Telemetry Export:**
  - **Keyboard Shortcuts:** `Space` (Play/Pause Orbit), `1`–`4` (Select Candidate Sites), `M` (Toggle 3D/2D View), `F` (Focus South Pole), `G` (Full Moon Globe), `+` / `−` (Zoom), and `?` (Shortcut Help).
  - **One-Click Telemetry Briefing:** Modal with comprehensive flight parameters and one-click JSON download plus print-to-PDF flight report capability.

---

## 🏆 NASA Space Apps Rubric Alignment

1. **Relevance & Impact:** Directly addresses South Pole mission architecture constraints for Artemis and commercial lunar payload services (CLPS).
2. **Scientific Accuracy:** Uses authentic LOLA grid specifications, accurate lunar axial tilt ($1.54^\circ$), and draconic/anomalistic libration cycles.
3. **Usability & Design:** Clean, modern glassmorphic aerospace UI with tabbed ergonomics, dark mode contrast, accessible typography, and real-time canvas rendering.
4. **Honest Accounting of Uncertainty:** Transparently communicates the limitations of orbital elevation data ($267\text{m}$) and the necessity of in-situ / high-resolution imaging for sub-10m boulder hazards.
