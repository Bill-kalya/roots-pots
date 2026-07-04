import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-roots-green/20 to-roots-cream">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200)'
          }}
        />
        
        <div className="relative z-10 text-center px-4">
          <div className="bg-white/80 backdrop-blur-glass rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl border border-white/20">
            <h1 className="text-5xl md:text-6xl font-bold text-roots-green mb-4">
              Roots & Pots
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              🌿 Where every table tells a story
            </p>
            <p className="text-gray-600 mb-8">
              Choose your perfect spot in our garden restaurant
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/explore"
                className="bg-roots-green text-white px-8 py-3 rounded-full hover:bg-roots-green/90 transition shadow-lg"
              >
                Explore Restaurant
              </Link>
              <Link
                to="/directions"
                className="bg-roots-gold text-white px-8 py-3 rounded-full hover:bg-roots-gold/90 transition shadow-lg"
              >
                Get Directions
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="font-bold text-roots-green">Interactive Floor Plan</h3>
            <p className="text-gray-600 text-sm">See the restaurant layout and choose your ideal table</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <div className="text-4xl mb-3">🕒</div>
            <h3 className="font-bold text-roots-green">Real-time Availability</h3>
            <p className="text-gray-600 text-sm">Live updates show which tables are free right now</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="font-bold text-roots-green">Easy Navigation</h3>
            <p className="text-gray-600 text-sm">Get directions to Roots & Pots with one click</p>
          </div>
        </div>
      </div>
    </div>
  );
};