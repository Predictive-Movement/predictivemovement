import React, { useState } from 'react'
import ReactMapGL from 'react-map-gl'
import cars from '../store/cars'

interface MapProps {
  socket: SocketIOClient.Socket
}

const Map: React.FC<MapProps> = ({ socket }) => {
  const [mapState, setMapState] = useState({
    viewport: {
      latitude: 61.8294925,
      longitude: 16.0565493,
      zoom: 8,
    },
  })
  return (
    <div>
      <ReactMapGL
        width="100%"
        height="100vh"
        {...mapState.viewport}
        onViewportChange={viewport => setMapState({ viewport })}
      />
    </div>
  )
}

export default Map
