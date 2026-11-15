# MoonWindow: Pitch Deck & 2-Minute Video Storyboard
*NASA Space Apps Challenge 2026 • Official Challenge: Lunar Landing Site Navigator*

---

## Part 1: The 2-Minute Video Demo Script (120 Seconds)

> **Pro Tip for Recording:** Keep your video strictly under 2 minutes (120s). NASA judges automatically down-score videos that run over time. Use a screen recorder (e.g. OBS Studio, Loom, or OS Screen Recorder) to record the browser while speaking clearly over a microphone.

```
0:00 ───┬─── 0:20 ───┬─── 0:50 ───┬─── 1:20 ───┬─── 1:45 ───┬─── 2:00
        │            │            │            │            │
     Problem     Change Date   Change Site   Rover Ice    Evidence &
     & Hook      (Launch Slip) (Horizon)     Traverse     Uncertainty
```

---

### Scene 1: The Polar Bottleneck (0:00 – 0:20)
* **Visual:** Browser showing the Lunar Landing Site Navigator with the 150×150 terrain map in Relief layer mode. Mouse hovers over high ridges and deep black crater interiors.
* **Voiceover:**  
  *"NASA’s Artemis and commercial CLPS missions are heading to the Moon’s South Pole, where extreme conditions collide. The Sun never climbs high in the sky—it skims the horizon at just 1.5 degrees, casting shadows across dozens of kilometers. Meanwhile, Earth wobbles on the horizon, threatening communications. Existing planning tools treat landing sites as static coordinates, forcing teams to rely on complex, slow scripts to answer basic operational questions."*

---

### Scene 2: Feature Demo — "Change Only the Date" (0:20 – 0:50)
* **Visual:** Screen captures the cursor moving down to the **"Dates, terrain and sun"** card. Move the **Mission Day** slider from Day 0 to Day 14. Show the Sun moving across the 360° horizon chart. Then, increase the **Launch Date Slip** slider from 0 to 3 days, showing the Sun dip below the red crater rim silhouette into shadow.
* **Voiceover:**  
  *"Meet MoonWindow. Our first core capability is **'Change only the date'**. At the Lunar South Pole, a site that has continuous solar power today might be frozen in complete darkness if launch delays by just 72 hours. By moving the timeline and launch slip sliders, planners can instantly watch the Sun move relative to the local crater rim. Here, slipping launch by 3 days drops our candidate site from 100% solar array power directly into a 70-hour shadow episode."*

---

### Scene 3: Feature Demo — "Change Only the Site" (0:50 – 1:20)
* **Visual:** The cursor clicks the **`[Site A]`** and **`[Site B]`** comparison buttons. Show the map with amber marker `A` on Connecting Ridge and cyan marker `B` on Malapert Massif. The 360° horizon chart immediately updates its red crater skyline, and the plain-language interpretation text updates.
* **Voiceover:**  
  *"Now we test **'Change only the site'** on the exact same mission date. Holding the date constant, we toggle between Site A on Connecting Ridge and Site B on the Malapert Massif. MoonWindow casts rays across the 150×150 elevation model to construct the true local obstacle skyline. On Site A, nearby peaks block our direct line-of-sight to Earth. But switching to Site B's 5,000-meter summit immediately clears the horizon, providing a continuous direct-to-Earth communication link."*

---

### Scene 4: Surface Traverse to Ice Access (1:20 – 1:45)
* **Visual:** Cursor clicks **"Route to nearest ice access point"**. The map draws the white Dijkstra traverse from the landing site to the boundary of the blue Permanently Shadowed Region. The bottom elevation profile displays slope, climb, descent, and amber (sunlit) vs blue (shadow) drive segments.
* **Voiceover:**  
  *"Landing is only step one. Exploration requires accessing ancient cryogenic water ice trapped in permanently shadowed craters. MoonWindow runs a Dijkstra least-cost routing engine across 8-connected neighbours, avoiding slopes over the rover limit and prioritizing sunlit terrain. The elevation profile instantly calculates climb, descent, and distance to the ice extraction zone."*

---

### Scene 5: Scientific Validity & Honest Uncertainty (1:45 – 2:00)
* **Visual:** Cursor scrolls down to the **Evidence & Uncertainty** disclaimer and the **How the screening works** technical summary. Show the project GitHub/live link.
* **Voiceover:**  
  *"MoonWindow is grounded in NASA LRO LOLA elevation data and optical libration orbital mechanics. Crucially, as responsible engineers, we do not claim a site is certified safe based on orbital data alone: sub-pixel boulders below 10 meters and regolith bearing strength require in-situ verification. MoonWindow gives mission teams the speed to screen, compare, and adapt landing windows with confidence. Thank you."*

---

## Part 2: 7-Slide Pitch Deck Structure

If presenting live to judges or submitting a PDF slide deck, use this exact 7-slide layout:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MOONWINDOW PITCH DECK                           │
├────────────┬────────────┬────────────┬────────────┬────────────┬───────┤
│ Slide 1    │ Slide 2    │ Slide 3    │ Slide 4    │ Slide 5    │ 6 & 7 │
│ Title &    │ The Polar  │ Dual-Axis  │ 360° Rim   │ Rover Route│ Science│
│ Hook       │ Problem    │ Innovation │ Horizon    │ to Ice PSR │ & Claim│
└────────────┴────────────┴────────────┴────────────┴────────────┴───────┘
```

### Slide 1: Title & Hook
* **Headline:** MoonWindow: Lunar Landing Site Navigator
* **Subtitle:** Rapid, date-resilient landing site screening for NASA Artemis and CLPS missions.
* **Visual:** High-contrast screenshot of the MoonWindow mission console showing the 150×150 lunar polar terrain map, 360° horizon skyline, and Dijkstra rover route.
* **Footer:** NASA Space Apps Challenge 2026 • Team Azare & Beyond

### Slide 2: The Polar Bottleneck
* **Headline:** The Lunar South Pole Problem: Space & Time Are Coupled
* **Key Points:**
  - **Extreme Grazing Light:** The Moon's axial tilt is only 1.54°. The Sun barely clears the horizon (+0.5° to +1.5°), casting 40-kilometer shadows.
  - **Libration Wobble:** Optical libration in latitude (±6.7°) and longitude (±7.9°) causes Earth to oscillate above and below crater rims.
  - **The Launch Slip Trap:** A 72-hour Earth launch delay changes the landing phase, turning a planned sunlit mission into a cryogenic freeze.
  - **Legacy Tool Limitations:** Command-line SPICE kernels and raw GIS tools are too slow for rapid trade-off exploration.

### Slide 3: The Innovation — Dual-Axis Screening
* **Headline:** "Change Only the Date" vs. "Change Only the Site"
* **Comparison Diagram:**
  - **Axis 1 ("Change only the date"):** Hold the site fixed, advance the mission day (0–29.5d) or launch slip (0–14d). Tests if solar arrays survive launch hold contingencies.
  - **Axis 2 ("Change only the site"):** Hold the calendar date fixed, toggle between candidate ridges (Site A vs. Site B). Compares crater rim obstruction geometry side-by-side.
* **Plain-Language Interpretation:** Automatically translates complex azimuth/elevation math into actionable mission verdicts (`Sunlit / Shadow`, `DTE Direct / Occulted`).

### Slide 4: Real-Time 360° Local Horizon Radar
* **Headline:** Seeing the Sky from the Lunar Regolith
* **Technical Highlights:**
  - Ray-casts across the digital elevation model in 72 azimuth bins (5° angular resolution) around the landing cell $(x, y)$.
  - Calculates true obstacle angle $h(\theta) = \max_k \arctan(\Delta h / d)$.
  - Renders true crater rim silhouette in real time.
  - Plots Sun and Earth disks with exact elevation margins above terrain obstacles.

### Slide 5: Surface Mobility — Rover Routes to Ice Access
* **Headline:** Connecting Safe Landings to Science Targets
* **Technical Highlights:**
  - **Resource Target:** Distance transform identifies the nearest Permanently Shadowed Region (PSR) cold traps ($T < 40\text{ K}$).
  - **Dijkstra Traverse Planner:** 8-neighbor graph search incorporating slope traversal limits ($\le 15^\circ$), steepness energy penalties, and solar illumination preferences.
  - **Elevation Profile:** Visualizes cumulative climb, descent, maximum step grade, and sunlit vs. shadowed drive segments.

### Slide 6: Scientific Validity & Honest Uncertainty
* **Headline:** Data Provenance & Responsible Claims
* **Data Sources:**
  - NASA LRO LOLA (Lunar Orbiter Laser Altimeter) DEM elevation data.
  - NASA SPICE planetary ephemeris (axial tilt $1.5427^\circ$, draconic month $27.212\text{d}$, synodic month $29.531\text{d}$).
  - Artemis III Candidate Landing Regions & VIPER target coordinates.
* **Honest Accounting of Uncertainty (Crucial for NASA Judges):**
  - Regional LOLA grids cannot resolve sub-10m boulder hazards.
  - Regolith bearing strength and geotechnical stability require ground validation.
  - Sunlight and line-of-sight are screening metrics, not proof of certified touchdown safety.

### Slide 7: Mission Impact & Next Steps
* **Headline:** Enabling Agile Planning for Artemis & Commercial Landers
* **Impact Summary:**
  - Reduces landing trade-study turnaround from hours of scripting to seconds of visual exploration.
  - Prevents fatal battery discharge from unforeseen crater rim occultation.
  - Empowers mission planners, university researchers, educators, and the public.
* **Call to Action:** Try the live demonstration at `http://localhost:3000/` or inspect the open-source codebase.

