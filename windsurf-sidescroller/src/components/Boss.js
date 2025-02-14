import React from 'react';
import { GROUND_LEVEL } from '../constants';

const BOSS_WIDTH = 200;
const BOSS_HEIGHT = GROUND_LEVEL - 50;

const Boss = ({ position }) => {
    return (
        <div style={{
            position: 'absolute',
            left: `${position}px`,
            top: `${GROUND_LEVEL - BOSS_HEIGHT}px`,
            width: `${BOSS_WIDTH}px`,
            height: `${BOSS_HEIGHT}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5,
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 0 20px rgba(231, 76, 60, 0.8)'
        }}>
            <img 
                src={require('../assets/agi.jpg')}
                alt="boss"
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

export default Boss;
