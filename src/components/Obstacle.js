import React from 'react';

const Obstacle = ({ position }) => {
    return (
        <div style={{
            position: 'absolute',
            bottom: '0',
            left: position,
            width: '30px',
            height: '30px',
            backgroundColor: 'red'
        }} />
    );
};

export default Obstacle;
