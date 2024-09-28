import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useWindowSize } from '../../utils/useWindowSize';

function Orb() {
    const { width, height } = useWindowSize();
    
    const [moveOrbAnimation, setMoveOrbAnimation] = useState(keyframes`
        0% {
            transform: translate(0, 0);
        }
        50% {
            transform: translate(${width}px, ${height / 2}px);
        }
        100% {
            transform: translate(0, 0);
        }
    `);

    useEffect(() => {
        // Update animation when width or height changes
        const updatedAnimation = keyframes`
            0% {
                transform: translate(0, 0);
            }
            50% {
                transform: translate(${width}px, ${height / 2}px);
            }
            100% {
                transform: translate(0, 0);
            }
        `;
        setMoveOrbAnimation(updatedAnimation);
    }, [width, height]);

    const OrbStyled = styled.div`
        width: 70vh;
        height: 70vh;
        position: absolute;
        border-radius: 50%;
        margin-left: -35vh; /* Center the orb */
        margin-top: -35vh; /* Center the orb */
        background: linear-gradient(180deg, #F56692 0%, #F2994A 100%);
        filter: blur(400px);
        animation: ${moveOrbAnimation} 15s alternate linear infinite;
    `;

    return <OrbStyled />;
}

export default Orb;
