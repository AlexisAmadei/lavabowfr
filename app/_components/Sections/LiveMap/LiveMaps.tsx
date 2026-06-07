'use client';

import Section from "@/components/Design/Section";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from "react";
import lavaMapData from '@/assets/map/lava-map';

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

    map.on('load', () => {
      map.addSource('lava-venues', {
        type: 'geojson',
        data: lavaMapData,
      });

      map.addLayer({
        id: 'lava-venues-circles',
        type: 'circle',
        source: 'lava-venues',
        paint: {
          'circle-radius': 8,
          'circle-color': '#ff4400',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.9,
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 12,
      });

      map.on('mouseenter', 'lava-venues-circles', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const feature = e.features?.[0];
        if (!feature) return;
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
        const label = feature.properties?.label ?? '';
        popup.setLngLat(coords).setHTML(`<span style="font-size:13px">${label}</span>`).addTo(map);
      });

      map.on('mouseleave', 'lava-venues-circles', () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <Section title="Lava Map">
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '480px', borderRadius: '8px', overflow: 'hidden' }}
      />
    </Section>
  );
}
