import styled from "styled-components";
import { media } from "../../styles/theme";

export const MainLayout = styled.div`
  padding: 2rem;
  height: 100%;
  display: flex;
  gap: 2rem;

  ${media.medium`
        padding: 1.5rem;
        gap: 1.5rem;
    `}

  ${media.small`
        padding: 1rem;
        gap: 1rem;
        flex-direction: column;
    `}
`;

export const InnerLayout = styled.div`
  padding: 2rem 1.5rem;
  width: 100%;

  ${media.medium`
        padding: 1.5rem 1rem;
    `}

  ${media.small`
        padding: 1rem 0.5rem;
    `}
`;
