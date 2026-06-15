import type { FeatureCollection } from 'geojson';

const lavaMap: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.369697, 48.850315] }, properties: { label: 'Supersonic' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.37455, 48.85361] }, properties: { label: 'La Mécanique Ondulatoire' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.341392, 48.870089] }, properties: { label: 'Truskel' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.347859, 48.859118] }, properties: { label: 'Le Klub' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.505964, 49.039387] }, properties: { label: "Brasserie d'Orville" } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.328663, 48.895721] }, properties: { label: 'Le Hasard Ludique' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.40921, 48.877796] }, properties: { label: 'Cirque Électrique' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.3756, 48.85375] }, properties: { label: 'Les Disquaires' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.3744, 48.86684] }, properties: { label: "L'Alimentation Générale" } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [-0.069914, 51.545681] }, properties: { label: 'The Victoria Dalston' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.353644, 48.887904] }, properties: { label: 'Olympic Café - Télévision' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.294151, 48.908413] }, properties: { label: 'Parc Robinson' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.285777, 48.912199] }, properties: { label: 'Le Chez Nous' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.37378, 48.87114] }, properties: { label: 'La Java' } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [2.28958, 48.910915] }, properties: { label: "Live in Asnieres" } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [3.04593, 50.765082] }, properties: { label: 'Les Briques Rouges 2024' } },
  ],
};

export default lavaMap;
