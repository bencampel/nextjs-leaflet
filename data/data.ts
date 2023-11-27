import departamentos_data from './DEPARTAMENTOS_PY_CNPV2022.json';
import distritos_data from './DISTRITOS_PY_CNPV2022.json';

const departamentos: any = departamentos_data;
const distritos: any =  distritos_data;


// agregando riesgos random
for (const dist of distritos?.features) {
  dist.properties.risk = Math.random();
}

// agregando riesgos acumuldos por departamento
for (const depa of departamentos?.features) {
  const risks = distritos?.features
    .filter((feat: any) => feat.properties.DPTO === depa.properties.DPTO)
    .map((feat: any) => feat.properties.risk);
  depa.properties.risk = risks.reduce((a: number, b: number) => a + b, 0) / risks.length;
}

export {distritos, departamentos};