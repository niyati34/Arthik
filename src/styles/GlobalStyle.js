import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }

    body {
        font-family: 'Inter', sans-serif; /* A modern, clean font */
        min-height: 100vh;
        background: linear-gradient(135deg, #fafbfc 0%, #f1f5f9 100%);
        position: relative;
        overflow: hidden;

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
        color: #334155; /* A consistent heading color */
    }
`;
