import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonStyled = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  display: inline-block;
  
  &.skeleton-text {
    height: 1em;
    margin-bottom: 0.5em;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &.skeleton-title {
    height: 1.5em;
    margin-bottom: 0.75em;
  }
  
  &.skeleton-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  &.skeleton-button {
    height: 36px;
    border-radius: 6px;
  }
  
  &.skeleton-card {
    height: 120px;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  &.skeleton-input {
    height: 40px;
    border-radius: 6px;
    margin-bottom: 1rem;
  }
  
  &.skeleton-circle {
    width: ${props => props.size || 20}px;
    height: ${props => props.size || 20}px;
    border-radius: 50%;
  }
  
  &.skeleton-rectangle {
    width: ${props => props.width || '100%'};
    height: ${props => props.height || '20px'};
    border-radius: 4px;
  }
`;

const Skeleton = ({ type = 'text', className = '', ...props }) => {
  return (
    <SkeletonStyled 
      className={`skeleton-${type} ${className}`} 
      {...props}
    />
  );
};

// Predefined skeleton layouts
export const SkeletonCard = () => (
  <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
    <Skeleton type="title" style={{ width: '60%' }} />
    <Skeleton type="text" style={{ width: '100%' }} />
    <Skeleton type="text" style={{ width: '80%' }} />
    <Skeleton type="text" style={{ width: '40%' }} />
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
          <Skeleton type="circle" size={32} style={{ marginRight: '0.75rem' }} />
          <div style={{ flex: 1 }}>
            <Skeleton type="text" style={{ width: '70%', marginBottom: '0.5rem' }} />
            <Skeleton type="text" style={{ width: '50%' }} />
          </div>
        </div>
        <Skeleton type="text" style={{ width: '100%' }} />
      </div>
    ))}
  </div>
);

export const SkeletonForm = () => (
  <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
    <Skeleton type="title" style={{ width: '50%', marginBottom: '1.5rem' }} />
    <Skeleton type="input" style={{ width: '100%' }} />
    <Skeleton type="input" style={{ width: '100%' }} />
    <Skeleton type="input" style={{ width: '100%' }} />
    <Skeleton type="button" style={{ width: '100%', marginTop: '1rem' }} />
  </div>
);

export default Skeleton;
