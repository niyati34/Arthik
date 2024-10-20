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

// Enhanced Navigation for scalability (Oct 16, 2024)
import React from 'react';
import { Link } from 'react-router-dom';

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
        <nav className="navigation" aria-label="Main Navigation">
            <ul>
                {navLinks.map((link, idx) => (
                    <li key={link.name} className={active === idx + 1 ? 'active' : ''}>
                        <Link to={link.path} onClick={() => setActive(idx + 1)} aria-current={active === idx + 1 ? 'page' : undefined}>{link.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navigation;

// Removed invalid CSS and syntax errors

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

