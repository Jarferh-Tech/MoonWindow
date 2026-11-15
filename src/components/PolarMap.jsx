import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { 
  Globe2, 
  Layers, 
  MapPin, 
  Sun, 
  Radio, 
  RotateCw,
  Compass,
  Eye
} from 'lucide-react';

export default function PolarMap({ 
  sites, 
  selectedSite, 
  onSelectSite, 
  currentConditions 
}) {
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
  const canvas2dRef = useRef(null);
  const mount3dRef = useRef(null);

  const { subSolar, subEarth } = currentConditions;

  // Major South Pole Craters for cartographic rendering
  const CRATERS = [
    { name: 'Shackleton', lat: -89.9, lon: 0.0, radiusKm: 21, isPsr: true },
    { name: 'de Gerlache', lat: -88.5, lon: 272.0, radiusKm: 32, isPsr: true },
    { name: 'Sverdrup', lat: -88.3, lon: 152.0, radiusKm: 35, isPsr: true },
    { name: 'Shoemaker', lat: -88.1, lon: 45.0, radiusKm: 50, isPsr: true },
    { name: 'Faustini', lat: -87.3, lon: 77.0, radiusKm: 39, isPsr: true },
    { name: 'Haworth', lat: -87.4, lon: 355.0, radiusKm: 35, isPsr: true },
    { name: 'Nobile', lat: -85.2, lon: 53.5, radiusKm: 73, isPsr: true },
    { name: 'Malapert', lat: -84.9, lon: 12.9, radiusKm: 69, isPsr: false },
    { name: 'Amundsen', lat: -84.5, lon: 82.8, radiusKm: 101, isPsr: true }
  ];

  // ================= 2D POLAR STEREOGRAPHIC RENDERER =================
  useEffect(() => {
    if (viewMode !== '2d') return;
    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const mapRadius = Math.min(cx, cy) - 25;

    // Pole is at -90°, boundary is at -80° (10 degrees of latitude span)
    const latSpan = 10; // -80 to -90

    const projectTo2D = (lat, lon) => {
      // Polar stereographic projection: distance from pole r = R * (90 - |lat|) / latSpan
      const distDeg = 90 - Math.abs(lat);
      const r = (distDeg / latSpan) * mapRadius;
      // Longitude: 0° is Facing Earth (pointing downwards), 90° East (right), 180° Far Side (up), 270° West (left)
      const rad = (lon + 90) * (Math.PI / 180);
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
      };
    };

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Dark lunar regolith background disk
    const diskGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, mapRadius);
    diskGrad.addColorStop(0, '#111827');
    diskGrad.addColorStop(0.7, '#0b0f19');
    diskGrad.addColorStop(1, '#030712');
    ctx.fillStyle = diskGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, mapRadius, 0, Math.PI * 2);
    ctx.fill();

    // Concentric latitude rings (-88°, -86°, -84°, -82°, -80°)
    const latRings = [-88, -86, -84, -82, -80];
    latRings.forEach(lat => {
      const distDeg = 90 - Math.abs(lat);
      const r = (distDeg / latSpan) * mapRadius;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = lat === -80 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = lat === -80 ? 1.5 : 1;
      ctx.stroke();

      // Latitude label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.font = '9px monospace';
      ctx.fillText(`${Math.abs(lat)}°S`, cx + 4, cy - r + 10);
    });

    // Longitude Spokes (0° Earth, 90° E, 180° Far-side, 270° W)
    const lonSpokes = [
      { lon: 0, label: '0° (Sub-Earth)' },
      { lon: 90, label: '90° E' },
      { lon: 180, label: '180° (Far Side)' },
      { lon: 270, label: '270° W' }
    ];

    lonSpokes.forEach(spoke => {
      const rad = (spoke.lon + 90) * (Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + mapRadius * Math.cos(rad), cy + mapRadius * Math.sin(rad));
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer label
      const lx = cx + (mapRadius + 14) * Math.cos(rad);
      const ly = cy + (mapRadius + 14) * Math.sin(rad);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(spoke.label, lx, ly);
    });

    // Draw Major South Pole Craters & Permanently Shadowed Regions (PSRs)
    CRATERS.forEach(crater => {
      const pos = projectTo2D(crater.lat, crater.lon);
      // Rough pixel scale: 1 degree latitude ~ 30.3 km
      const kmPerPixel = (latSpan * 30.3) / mapRadius;
      const pixelRadius = Math.max(3, crater.radiusKm / kmPerPixel);

      // Crater floor / PSR shading
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pixelRadius, 0, Math.PI * 2);
      if (crater.isPsr) {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.25)'; // PSR cold trap purple
        ctx.fill();
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.6)';
      } else {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      }
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Crater Name
      ctx.fillStyle = 'rgba(203, 213, 225, 0.6)';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(crater.name, pos.x, pos.y - pixelRadius - 3);
    });

    // Draw Grazing Sunlight Vector (Yellow Arrow from Subsolar Longitude)
    if (subSolar) {
      const sunRad = (subSolar.lon + 90) * (Math.PI / 180);
      const sunArrowLen = mapRadius * 0.9;
      const arrowTipX = cx;
      const arrowTipY = cy;
      const arrowStartX = cx + sunArrowLen * Math.cos(sunRad);
      const arrowStartY = cy + sunArrowLen * Math.sin(sunRad);

      ctx.beginPath();
      ctx.moveTo(arrowStartX, arrowStartY);
      ctx.lineTo(arrowTipX, arrowTipY);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Sun icon indicator at map edge
      ctx.beginPath();
      ctx.arc(arrowStartX, arrowStartY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('☀', arrowStartX, arrowStartY);
    }

    // Draw Candidate Landing Sites Pins
    sites.forEach(site => {
      const pos = projectTo2D(site.lat, site.lon);
      const isSelected = selectedSite?.id === site.id;

      if (isSelected) {
        // Glowing animated pulse ring
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 11, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isSelected ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
      ctx.fill();

      // Label
      ctx.fillStyle = isSelected ? '#7dd3fc' : '#94a3b8';
      ctx.font = isSelected ? 'bold 10px monospace' : '9px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(site.shortName, pos.x + 8, pos.y);
    });

  }, [viewMode, sites, selectedSite, subSolar]);

  // ================= 3D INTERACTIVE THREE.JS LUNAR GLOBE =================
  useEffect(() => {
    if (viewMode !== '3d') return;
    const container = mount3dRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Position camera looking directly down towards south pole
    camera.position.set(0, -6, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lunar Sphere with bumpy elevation texture simulation
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    
    // Procedural lunar surface shader/material
    const material = new THREE.MeshStandardMaterial({
      color: 0x8a929e,
      roughness: 0.85,
      metalness: 0.1,
      wireframe: false
    });

    const moonMesh = new THREE.Mesh(geometry, material);
    moonMesh.rotation.x = Math.PI / 2; // Rotate so south pole faces camera
    scene.add(moonMesh);

    // Directional Sunlight (Simulating low polar grazing angle)
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    // Set position according to subsolar longitude and grazing latitude
    const sunLonRad = ((subSolar?.lon || 0) * Math.PI) / 180;
    sunLight.position.set(Math.cos(sunLonRad) * 10, Math.sin(sunLonRad) * 10, 0.2);
    scene.add(sunLight);

    // Ambient Earthshine / Deep space light
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.3);
    scene.add(ambientLight);

    // Add marker for Selected Landing Site
    if (selectedSite) {
      const sitePhi = (90 + selectedSite.lat) * (Math.PI / 180);
      const siteTheta = (selectedSite.lon * Math.PI) / 180;
      const markerR = 2.02;
      const mx = markerR * Math.sin(sitePhi) * Math.cos(siteTheta);
      const my = markerR * Math.sin(sitePhi) * Math.sin(siteTheta);
      const mz = -markerR * Math.cos(sitePhi);

      const markerGeo = new THREE.ConeGeometry(0.08, 0.25, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.set(mx, my, mz);
      markerMesh.rotation.x = Math.PI;
      scene.add(markerMesh);
    }

    let animationId;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      moonMesh.rotation.z += deltaX * 0.008;
      moonMesh.rotation.x += deltaY * 0.008;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isDragging) {
        moonMesh.rotation.z += 0.001; // subtle rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [viewMode, selectedSite, subSolar]);

  return (
    <div className="nasa-panel rounded-xl p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">South Pole Cartography (80°S - 90°S)</span>
          <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            LUNAR SOUTH POLE NAVIGATOR MAP
          </h3>
        </div>

        {/* 2D / 3D Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
          <button
            onClick={() => setViewMode('2d')}
            className={`px-2.5 py-1 rounded transition-all ${
              viewMode === '2d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2D Polar Grid
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-2.5 py-1 rounded transition-all ${
              viewMode === '3d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3D Globe View
          </button>
        </div>
      </div>

      {/* Map View Canvas Container */}
      <div className="relative flex items-center justify-center min-h-[380px]">
        {viewMode === '2d' ? (
          <canvas
            ref={canvas2dRef}
            width={440}
            height={440}
            className="max-w-full h-auto drop-shadow-2xl cursor-crosshair"
            onClick={(e) => {
              const rect = e.target.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const clickY = e.clientY - rect.top;
              // Check proximity to sites
              const scaleX = 440 / rect.width;
              const scaleY = 440 / rect.height;
              const canvasX = clickX * scaleX;
              const canvasY = clickY * scaleY;

              const cx = 220;
              const cy = 220;
              const mapRadius = 195;
              const latSpan = 10;

              for (const site of sites) {
                const distDeg = 90 - Math.abs(site.lat);
                const r = (distDeg / latSpan) * mapRadius;
                const rad = (site.lon + 90) * (Math.PI / 180);
                const sx = cx + r * Math.cos(rad);
                const sy = cy + r * Math.sin(rad);

                const d = Math.hypot(canvasX - sx, canvasY - sy);
                if (d < 16) {
                  onSelectSite(site);
                  break;
                }
              }
            }}
          />
        ) : (
          <div ref={mount3dRef} className="w-full h-[400px] flex items-center justify-center cursor-grab active:cursor-grabbing" />
        )}
      </div>

      {/* Map Legend & Telemetry Readout */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/50 border border-indigo-400"></span>
            PSR Water Ice Trap
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            Candidate Site Pin
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            Sub-Solar Vector
          </span>
        </div>

        <div className="text-[11px] text-slate-500">
          Click site pin to inspect • Stereographic Projection
        </div>
      </div>
    </div>
  );
}

