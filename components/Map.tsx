'use client'

import L from 'leaflet';
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

import { departamentos, distritos} from '../data/data';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Legend from './Legend';


export default function MyMap() {
  const map = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const [layerData, setLayerData] = useState<any>({name: departamentos?.name, features: departamentos?.features});

  const info: any = useMemo(() => new L.Control(), []);

  const setDistritos = useCallback((feature: any) => {
    const depa_dists = distritos?.features.filter((feat: any) => feat.properties.DPTO === feature.properties.DPTO);
    setLayerData({name: distritos?.name, features: depa_dists});
  }, []);

  const getFeatureInfo = useCallback((props: any) => {
    if(layerData.name === 'DEPARTAMENTOS'){
      return `<ul>
                <li className='mb-1'><strong>${props?.DPTO_DESC}</strong></li>
                <li>Departamento numero: ${props?.DPTO}</li>
                <li><strong>Riesgo: ${(props?.risk * 100)?.toLocaleString()}%</strong></li>
              </ul>`;
    }
    return `<ul>
              <li className='mb-1'><strong>${props?.DIST_DESC_}</strong></li>
              <li>Distrito Numero:${props?.DISTRITO}</li>
              <li>Departamento: ${props?.DPTO_DESC}</li>
              <li>Departamento numero: ${props?.DPTO}</li>
              <li className='mb-1'>Clave: ${props?.CLAVE}</li>
              <li><strong>Riesgo: ${(props?.risk * 100)?.toLocaleString()}%</strong></li>
            </ul>`;
  }, [layerData.name])

  const getColor = useCallback((risk: number) => {
    if(risk <= 0.3) return '#44FB27'
    if(risk <= 0.6) return '#F6F915'
    return '#FD2300'
  }, []);
  
  const style = useCallback((feature: any) => {
    return {
        fillColor: getColor(feature.properties.risk),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
  }, [getColor]);

  const highlightFeature = useCallback((e: any) => {
    const layer = e.target;
  
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
  
    layer.bringToFront();

    info.update(layer.feature.properties);
  }, [info]);

  const resetHighlight = useCallback((e: any) => {
    layerRef.current.resetStyle(e.target);
    info.update();
  }, [info]);

  const zoomToFeature = useCallback((e: any) => {
    map.current.fitBounds(e.target.getBounds());
  }, [])

  const handleClick = useCallback((e: any) => {
    if(layerData.name === 'DEPARTAMENTOS'){
      setDistritos(e.target.feature);
    }else{
      zoomToFeature(e);
    }
  }, [layerData.name, setDistritos, zoomToFeature])

  const onEachFeature = useCallback((feature: any, layer: any) => {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: handleClick
    });
  }, [highlightFeature, resetHighlight, handleClick])

  info.onAdd = useCallback(function(this:any, map: any){
      this._div = L.DomUtil.create('div', 'distrito-info'); // create a div with a class "info"
      this.update();
      return this._div;
  }, []);

  // method that we will use to update the control based on feature properties passed
  info.update = useCallback(function (this:any, props: any) {
      this._div.innerHTML = props 
        ? getFeatureInfo(props)
        : `<strong>Riesgo de abandono escolar</strong>
          <p>Pase el cursor sobre cada distrito para obtener más detalles.</p>`; 
  }, [getFeatureInfo]);

  // init map
  useEffect(() => {
    if(!map.current){
      map.current = L.map('map', { center: [-23.558954, -58.171019], zoom: 6 });
      info.addTo(map.current);
    }
  }, [info, style, onEachFeature])

  // set layer data
  useEffect(() => {
    if(map.current){
      if(layerRef.current){
        map.current.removeLayer(layerRef.current);
      }
      layerRef.current = L.geoJSON(layerData.features, {
        style: style,
        onEachFeature: onEachFeature
      }).addTo(map.current);

      map.current.fitBounds(layerRef.current.getBounds());
    }
  }, [layerData, onEachFeature, style])

  return (
    <>
      <div className='relative'>
        <div id="map" className='h-[450px]'></div>
        <Legend />
      </div>
      <button 
        type="button" 
        className="mt-5 w-full flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700"
        disabled={layerData.name === 'DEPARTAMENTOS'} 
        onClick={() => setLayerData({name: departamentos?.name, features: departamentos.features})}
      >
        <svg className="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
        </svg>
        <span>Volver</span>
      </button>
    </>
  );
}
