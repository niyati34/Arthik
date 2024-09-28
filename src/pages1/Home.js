import React from 'react';
import './Home.css';
import videoSrc from '../assets1/videobg3.mp4'; // Adjust the path as needed
import piggyImg from '../assets1/piggy1.png'; // Replace with the actual filename of your animated PNG

const Home = () => {
    return (
        <div className="home-container">
            <div className="video-container">
                <video className="video-background" autoPlay loop muted>
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="main-content">
                <div className="text-section">
                    <h1>Track. Control. Grow.</h1>
                    <p>Track expenses, set budgets, and gain insights <br></br>to improve your financial health effortlessly.</p>
                    <button className="hero-button">Get Started</button>
                </div>
                <div className="image-section">
                    <img className="right-image" src={piggyImg} alt="Animated Piggy" />
                </div>
            </div>
        </div>
    );
};

export default Home;
