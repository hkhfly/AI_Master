import React from 'react';
import { Marquee } from './ui/Marquee';
import { Card, CardContent } from './ui/Card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar';
import { TESTIMONIALS } from '../data/testimonialsData';

function TestimonialCard({ avatar, body, tag }) {
  return (
    <Card className="w-60 mx-2" style={{ width: '240px', margin: '0 8px' }}>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Avatar>
            <AvatarImage src={avatar} alt="User" />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>{tag}</span>
          </div>
        </div>
        <p style={{ fontSize: '13px', lineHeight: '1.4', color: 'rgba(255,255,255,0.9)' }}>{body}</p>
      </CardContent>
    </Card>
  );
}

export default function DiscoverView() {
  // Split testimonials into 4 chunks
  const chunk1 = TESTIMONIALS.slice(0, 5);
  const chunk2 = TESTIMONIALS.slice(5, 10);
  const chunk3 = TESTIMONIALS.slice(10, 15);
  const chunk4 = TESTIMONIALS.slice(15, 19);

  return (
    <div style={{ 
      position: 'relative', 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'hidden',
      perspective: '600px', /* Adjusted for mobile */
      background: '#0f172a' 
    }}>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          transform: 'rotateX(20deg) rotateY(-10deg) rotateZ(20deg) scale(1.1)',
          height: '150vh', 
          flexDirection: 'row',
          marginLeft: '-140px' /* Center visual balance */
        }}
      >
        <Marquee vertical pauseOnHover repeat={4} style={{ '--duration': '40s' }}>
          {chunk1.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={4} style={{ '--duration': '50s' }}>
           {chunk2.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </Marquee>
        <Marquee vertical pauseOnHover repeat={4} style={{ '--duration': '45s' }}>
           {chunk3.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={4} style={{ '--duration': '55s' }}>
           {chunk4.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </Marquee>
      </div>

      {/* Gradient Overlays for smooth fade */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '150px', background: 'linear-gradient(to bottom, #0f172a, transparent)', pointerEvents: 'none', zIndex: 10 }}></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '150px', background: 'linear-gradient(to top, #0f172a, transparent)', pointerEvents: 'none', zIndex: 10 }}></div>
      
      {/* Title Overlay */}
      <div style={{ position: 'absolute', top: 60, left: 20, zIndex: 20 }}>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>发现灵感</h2>
      </div>
    </div>
  );
}
