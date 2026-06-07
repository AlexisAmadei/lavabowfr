'use client';

import Section from "@/components/Design/Section";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from "react";
import lavaMapData from '@/assets/map/lava-map';
import logoSrc from '@/assets/icons/logo.svg';

export default function LiveMaps() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    mapRef.current = new mapboxgl.Map({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.35, 48.87],
      zoom: 10,
    });

    const map = mapRef.current;
    const markers: mapboxgl.Marker[] = [];

    map.on('load', () => {
      for (const feature of lavaMapData.features) {
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        const label = feature.properties?.label ?? '';

        const el = document.createElement('div');
        el.style.cssText = 'width:20px;height:20px;cursor:pointer;';
        const img = document.createElement('img');
        img.src = typeof logoSrc === 'string' ? logoSrc : (logoSrc as { src: string }).src;
        img.style.cssText = 'width:100%;height:100%;';
        el.appendChild(img);

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 16,
        }).setHTML(`<div style="background:#1a1a2e;color:#fff;font-family:sans-serif;font-size:12px;padding:6px 10px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.4);">${label}</div>`);

        el.addEventListener('mouseenter', () => popup.addTo(map));
        el.addEventListener('mouseleave', () => popup.remove());

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(coords)
          .setPopup(popup)
          .addTo(map);

        markers.push(marker);
      }
    });

    return () => {
      markers.forEach(m => m.remove());
      mapRef.current?.remove();
    };
  }, []);

  return (
    <Section id='map' title="Lava Live Map">
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '480px', borderRadius: '8px', overflow: 'hidden' }}
      />
    </Section>
  );
}
