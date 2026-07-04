import { useEffect, useState } from 'react';
import { Restaurant } from '../../types';

interface DirectionsWidgetProps {
  restaurant: Restaurant;
  userLocation?: { lat: number; lng: number };
  onRouteCalculated?: (distance: string, duration: string) => void;
}

export const DirectionsWidget: React.FC<DirectionsWidgetProps> = ({
  restaurant,
  userLocation,
  onRouteCalculated
}) => {
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  // Simulate getting directions
  const calculateRoute = async () => {
    // In a real app, you'd use Google Maps API, Mapbox, or OpenStreetMap
    // This is a simulation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const simulatedDistance = (Math.random() * 5 + 1).toFixed(1);
    const simulatedDuration = (Math.random() * 20 + 5).toFixed(0);
    
    setDistance(`${simulatedDistance} km`);
    setDuration(`${simulatedDuration} min`);
    onRouteCalculated?.(`${simulatedDistance} km`, `${simulatedDuration} min`);
  };

  useEffect(() => {
    if (userLocation) {
      calculateRoute();
    }
  }, [userLocation]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`;
    window.open(url, '_blank');
  };

  const openInWaze = () => {
    const url = `https://www.waze.com/ul?ll=${restaurant.latitude},${restaurant.longitude}&navigate=yes`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">📍</div>
        <div>
          <h3 className="font-semibold text-gray-800">{restaurant.name}</h3>
          <p className="text-sm text-gray-600">{restaurant.address}</p>
        </div>
      </div>

      {userLocation ? (
        <>
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Distance:</span>
              <span className="font-semibold">{distance || 'Calculating...'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Duration:</span>
              <span className="font-semibold">{duration || 'Calculating...'}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={openInGoogleMaps}
              className="flex-1 bg-roots-green text-white px-4 py-2 rounded-lg 
                       hover:bg-roots-green/90 transition flex items-center justify-center gap-2"
            >
              <span>🗺️</span>
              Google Maps
            </button>
            <button
              onClick={openInWaze}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg 
                       hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              <span>🧭</span>
              Waze
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm mb-2">
            Enable location to get directions
          </p>
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    // In a real app, you'd update the userLocation state
                    console.log('Location:', position.coords);
                  },
                  (error) => {
                    console.error('Error getting location:', error);
                  }
                );
              }
            }}
            className="text-roots-green font-medium text-sm hover:underline"
          >
            Share my location
          </button>
        </div>
      )}
    </div>
  );
};