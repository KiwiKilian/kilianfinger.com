import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const styleImprovements = ({ target }) => {
  target.setPaintProperty('Grenzen_Staatsgrenze', 'line-width', 1);
  target.setPaintProperty('Grenzen_Staatsgrenze', 'line-color', '#cccccc');
  target.setPaintProperty('Grenzen_Landesgrenze', 'line-color', '#cccccc');

  target.setPaintProperty('Name_Staat', 'text-color', 'rgb(51,51,51)');
  target.setPaintProperty('Name_Bundesland', 'text-color', 'rgb(51,51,51)');
};

const mapOverview = new maplibregl.Map({
  container: 'map-overview',
  style: 'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_top.json',
  cooperativeGestures: true,
  bounds: [5.8, 47.2, 15.1, 55.1],
});

mapOverview.once('load', styleImprovements);

const mapCologne = new maplibregl.Map({
  container: 'map-cologne',
  style: 'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_top.json',
  cooperativeGestures: true,
  center: [6.958138, 50.941303],
  zoom: 16,
  bearing: 45,
  pitch: 60,
});

mapCologne.once('load', styleImprovements);
