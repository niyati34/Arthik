import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }

    html {
        font-size: 16px;
        scroll-behavior: smooth;
        
        @media (max-width: 768px) {
            font-size: 14px;
        }
        
        @media (max-width: 480px) {
            font-size: 13px;
        }
    }

    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        min-height: 100vh;
        background: linear-gradient(135deg, #fafbfc 0%, #f1f5f9 100%);
        position: relative;
        overflow-x: hidden;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: 1.6;
        color: #0f172a;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
                circle at 10% 90%,
                rgba(51, 153, 137, 0.03) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at 90% 10%,
                rgba(125, 226, 209, 0.03) 0%,
                transparent 50%
            );
            pointer-events: none;
        }
    }

    h1, h2, h3, h4, h5, h6 {
        color: #334155;
        font-weight: 600;
        line-height: 1.2;
        margin-bottom: 0.5em;
        
        @media (max-width: 768px) {
            line-height: 1.3;
        }
    }

    h1 {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        
        @media (max-width: 768px) {
            font-size: clamp(1.25rem, 5vw, 2rem);
        }
    }

    h2 {
        font-size: clamp(1.25rem, 3.5vw, 2rem);
        
        @media (max-width: 768px) {
            font-size: clamp(1.125rem, 4vw, 1.75rem);
        }
    }

    h3 {
        font-size: clamp(1.125rem, 3vw, 1.5rem);
        
        @media (max-width: 768px) {
            font-size: clamp(1rem, 3.5vw, 1.375rem);
        }
    }

    p {
        margin-bottom: 1rem;
        color: #64748b;
        
        @media (max-width: 768px) {
            margin-bottom: 0.875rem;
        }
    }

    a {
        color: #10b981;
        text-decoration: none;
        transition: color 0.2s ease;
        
        &:hover {
            color: #059669;
        }
        
        &:focus {
            outline: 2px solid #10b981;
            outline-offset: 2px;
        }
    }

    button {
        font-family: inherit;
        cursor: pointer;
        border: none;
        background: none;
        transition: all 0.2s ease;
        
        &:focus {
            outline: 2px solid #10b981;
            outline-offset: 2px;
        }
        
        &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }
    }

    input, textarea, select {
        font-family: inherit;
        font-size: 1rem;
        
        &:focus {
            outline: 2px solid #10b981;
            outline-offset: 2px;
        }
        
        @media (max-width: 768px) {
            font-size: 16px; /* Prevents zoom on iOS */
        }
    }

    /* Responsive container */
    .container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        
        @media (max-width: 768px) {
            padding: 0 0.75rem;
        }
        
        @media (max-width: 480px) {
            padding: 0 0.5rem;
        }
    }

    /* Responsive grid system */
    .grid {
        display: grid;
        gap: 1.5rem;
        
        &.grid-2 {
            grid-template-columns: repeat(2, 1fr);
            
            @media (max-width: 768px) {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
        }
        
        &.grid-3 {
            grid-template-columns: repeat(3, 1fr);
            
            @media (max-width: 1024px) {
                grid-template-columns: repeat(2, 1fr);
            }
            
            @media (max-width: 768px) {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
        }
        
        &.grid-4 {
            grid-template-columns: repeat(4, 1fr);
            
            @media (max-width: 1200px) {
                grid-template-columns: repeat(3, 1fr);
            }
            
            @media (max-width: 768px) {
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
            }
            
            @media (max-width: 480px) {
                grid-template-columns: 1fr;
            }
        }
    }

    /* Responsive flexbox utilities */
    .flex {
        display: flex;
        
        &.flex-col {
            flex-direction: column;
        }
        
        &.flex-wrap {
            flex-wrap: wrap;
        }
        
        &.items-center {
            align-items: center;
        }
        
        &.justify-center {
            justify-content: center;
        }
        
        &.justify-between {
            justify-content: space-between;
        }
        
        @media (max-width: 768px) {
            &.mobile-col {
                flex-direction: column;
            }
            
            &.mobile-center {
                align-items: center;
                justify-content: center;
            }
        }
    }

    /* Responsive spacing utilities */
    .p-1 { padding: 0.25rem; }
    .p-2 { padding: 0.5rem; }
    .p-3 { padding: 0.75rem; }
    .p-4 { padding: 1rem; }
    .p-5 { padding: 1.25rem; }
    .p-6 { padding: 1.5rem; }
    
    .m-1 { margin: 0.25rem; }
    .m-2 { margin: 0.5rem; }
    .m-3 { margin: 0.75rem; }
    .m-4 { margin: 1rem; }
    .m-5 { margin: 1.25rem; }
    .m-6 { margin: 1.5rem; }
    
    @media (max-width: 768px) {
        .mobile-p-2 { padding: 0.5rem; }
        .mobile-p-3 { padding: 0.75rem; }
        .mobile-p-4 { padding: 1rem; }
        
        .mobile-m-2 { margin: 0.5rem; }
        .mobile-m-3 { margin: 0.75rem; }
        .mobile-m-4 { margin: 1rem; }
    }

    /* Responsive text utilities */
    .text-sm { font-size: 0.875rem; }
    .text-base { font-size: 1rem; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    
    @media (max-width: 768px) {
        .mobile-text-sm { font-size: 0.875rem; }
        .mobile-text-base { font-size: 1rem; }
        .mobile-text-lg { font-size: 1.125rem; }
    }

    /* Responsive visibility utilities */
    .hidden { display: none; }
    .block { display: block; }
    .inline-block { display: inline-block; }
    
    @media (max-width: 768px) {
        .mobile-hidden { display: none; }
        .mobile-block { display: block; }
    }
    
    @media (min-width: 769px) {
        .desktop-hidden { display: none; }
        .desktop-block { display: block; }
    }

    /* Touch-friendly button sizes for mobile */
    @media (max-width: 768px) {
        button, .btn {
            min-height: 44px;
            min-width: 44px;
        }
        
        input, select, textarea {
            min-height: 44px;
        }
    }

    /* Improved scrolling for mobile */
    @media (max-width: 768px) {
        .scroll-container {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
        }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        body {
            background: #ffffff;
            color: #000000;
        }
        
        button, input, select, textarea {
            border: 2px solid #000000;
        }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
