import React from 'react';
import { GROUND_LEVEL, OBSTACLE_WIDTH, OBSTACLE_HEIGHT } from '../constants';

const Obstacle = ({ position, iconSrc }) => {
    return (
        <div style={{
            position: 'absolute',
            left: `${position}px`,
            top: `${GROUND_LEVEL - OBSTACLE_HEIGHT}px`,
            width: `${OBSTACLE_WIDTH}px`,
            height: `${OBSTACLE_HEIGHT}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5,
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 0 10px rgba(231, 76, 60, 0.6)'
        }}>
            <img 
                src={iconSrc} 
                alt="obstacle"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    imageRendering: 'pixelated'
                }}
            />
        </div>
    );
};

export default Obstacle;
