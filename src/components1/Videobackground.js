import React from "react";
import "./Videobackground.css"; // Ensure this file exists

const VideoBackground = () => {
  return (
    <div className="video-container">
      <video className="video-background" autoPlay muted loop>
        <source src="videobg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;
