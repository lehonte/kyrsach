import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function HoverVideoSimple() {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  if (['/login', '/register'].includes(location.pathname)) return null;

  return (
    <div
      className="hover-video-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src="/images/static.png"
        alt=""
        className="static-image"
        style={{ display: isHovered ? 'none' : 'block' }}
      />

      {isHovered && (
        <video
          key="hover-video"
          autoPlay
          muted
          loop
          playsInline
          className="hover-video"
          style={{ display: 'block' }}
        >
          <source src="/images/hover.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}

export default HoverVideoSimple;