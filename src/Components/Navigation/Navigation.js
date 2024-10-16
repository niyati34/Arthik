import React from 'react';
import { Link } from 'react-router-dom';

// Enhanced Navigation for scalability (Oct 16, 2024)
const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Features', path: '/features' },
    { name: 'Budget', path: '/budget' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Income', path: '/income' },
    { name: 'Goal Setter', path: '/goal-setter' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
];

function Navigation({ active, setActive }) {
    return (
        <nav className="navigation">
            <ul>
                {navLinks.map((link, idx) => (
                    <li key={link.name} className={active === idx + 1 ? 'active' : ''}>
                        <Link to={link.path} onClick={() => setActive(idx + 1)}>{link.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

    width: 374px;
    height: auto; /* Allow height to adjust based on content */
    background: #000; /* Solid black background */
    border: 2px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem; /* Adjusted gap */
    box-shadow: 0px 10px 30px rgba(0, 255, 171, 0.5);
`;

const UserSection = styled.div`
    height: 60px; /* Adjust height */
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
        width: 60px; /* Adjusted width */
        height: 60px; /* Adjusted height */
        border-radius: 50%;
        object-fit: cover;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid #00ffab;
        padding: 0.1rem;
        box-shadow: 0px 0px 20px rgba(0, 255, 171, 0.8);
    }

    h2 {
        color: #ffffff; /* Change to white for visibility */
        margin: 0; /* Remove default margin */
    }

    p {
        color: rgba(255, 255, 255, 0.5);
        margin: 0; /* Remove default margin */
    }
`;

const MenuList = styled.ul`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Adjusted gap */
`;

const MenuItem = styled.li`
    cursor: pointer;
    position: relative;

    .item-box {
        display: grid;
        grid-template-columns: 40px auto;
        align-items: center;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
        padding: 0.8rem; /* Decreased padding */
        border-radius: 10px;
        transition: background 0.3s ease;
        animation: ${glowAnimation} 2s infinite alternate; /* Slower glow effect */
        
        &:hover {
            background: rgba(0, 255, 171, 0.1);
        }

        span {
            font-size: 1.1rem; /* Slightly decreased font size */
            color: ${props => (props.isActive ? '#00ffab' : 'inherit')};
            text-shadow: ${props => (props.isActive ? '0px 0px 12px #00ffab' : 'none')};
        }
    }

    ${props => props.isActive && `
        .item-box {
            box-shadow: 0 0 20px #00ffab, 0 0 30px #00ffab;
            border: 2px solid #00ffab;
        }
    `}
`;

const BottomNav = styled.div`
    li {
        cursor: pointer;
        color: #ff6f00;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.3s ease-in-out;
        padding-left: 1rem;

        &:hover {
            color: #00ffab;
            text-shadow: 0px 0px 10px #00ffab;
        }

        i {
            font-size: 1.5rem;
        }
    }
`;

