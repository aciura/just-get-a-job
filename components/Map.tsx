import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import styles from '../styles/Home.module.scss'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Link from 'next/link'
import { JobOffer } from '../services/JobOffer'
// Compiler: Please ignore this TS error
delete L.Icon.Default.prototype._getIconUrl

// Known issue with Leaflet & webpack: https://github.com/PaulLeCam/react-leaflet/issues/453
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export interface Position {
  latitude: number
  longitude: number
}

const getGeolocation = (setPosition) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation:', position)
        const { latitude, longitude } = position.coords
        setPosition({ latitude, longitude })
      },
      (error) => {
        console.log('Geolocation error:', error)
        setPosition({ latitude: 52.76, longitude: 17.4 })
      },
    )
  }
}

const Map = ({
  jobOffers,
  className,
  center = null,
  zoomLevel = 6,
}: {
  jobOffers: JobOffer[]
  className: string
  center?: Position
  zoomLevel?: number
}) => {
  const [mapCenter, setCenter] = React.useState(
    center ?? {
      latitude: 52.76,
      longitude: 17.4,
    },
  )
  React.useEffect(() => {
    if (!center) getGeolocation(setCenter)
    else setCenter(center)
  }, [])

  console.log('Map', mapCenter)
  return (
    <MapContainer
      className={className}
      center={[mapCenter.latitude, mapCenter.longitude]}
      zoom={zoomLevel}
      scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {jobOffers.map((offer) => (
        <Marker key={offer.id} position={[offer.latitude, offer.longitude]}>
          <Popup>
            <>
              <Link href={`/offer/${offer.id}`}>
                <a>{offer.title}</a>
              </Link>
              <br />
              {offer.company_name}
              <br />
              {offer.salary_from}-{offer.salary_to}
            </>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Map
