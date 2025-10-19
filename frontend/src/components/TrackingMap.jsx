import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

function TrackingMap() {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: 18.1096, lng: -77.2975 }, // Jamaica
        destination: { lat: 18.5, lng: -77.8 },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") setDirections(result);
      }
    );
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap center={{ lat: 18.1096, lng: -77.2975 }} zoom={8} mapContainerStyle={{ width: "100%", height: "100vh" }}>
        <Marker position={{ lat: 18.1096, lng: -77.2975 }} />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
}
export default TrackingMap;
