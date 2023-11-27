import dynamic from 'next/dynamic'
import { useMemo } from 'react'


export default function Home() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
      { 
        loading: () => <p className='w-full h-[500px] flex justify-center items-center'>Cargando mapa...</p>,
        ssr: false
      }
  ), [])

  return <div><Map /></div>
}
