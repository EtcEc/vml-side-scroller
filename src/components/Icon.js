import React from 'react';

const Icon = ({ position }) => {
    return (
        <div style={{
            position: 'absolute',
            bottom: position,
            left: '50px',
            width: '50px',
            height: '50px',
            backgroundColor: 'blue'
        }} />
    );
};

export default Icon;
