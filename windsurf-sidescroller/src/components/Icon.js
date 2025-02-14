import React from 'react';
import { PLAYER_SIZE, PLAYER_POSITION_X } from '../constants';
import playerIcon from '../assets/player.jpg';

const Icon = ({ position }) => {
    return (
        <div style={{
            position: 'absolute',
            left: `${PLAYER_POSITION_X}px`,
            top: `${position - PLAYER_SIZE}px`,
            width: `${PLAYER_SIZE}px`,
            height: `${PLAYER_SIZE}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '4px',
            boxShadow: '0 0 10px rgba(52, 152, 219, 0.6)'
        }}>
            <img 
                src={playerIcon}
                alt="player"
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

export default Icon;
