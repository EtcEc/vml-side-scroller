import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Obstacle from './Obstacle';

const Game = () => {
    const [iconPosition, setIconPosition] = useState(100);
    const [obstacles, setObstacles] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.code === 'Space' && !gameOver) {
                jump();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        const obstacleInterval = setInterval(() => {
            if (!gameOver) {
                setScore((prevScore) => prevScore + 1);
                addObstacle();
            }
        }, 1000);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            clearInterval(obstacleInterval);
        };
    }, [gameOver]);

    const jump = () => {
        setIconPosition((prevPosition) => prevPosition - 50);
        setTimeout(() => {
            setIconPosition((prevPosition) => prevPosition + 50);
        }, 500);
    };

    const addObstacle = () => {
        const newObstacle = { id: Date.now(), position: 500 }; // Example position
        setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);
    };

    return (
        <div className="game-container">
            <h1>Score: {score}</h1>
            <Icon position={iconPosition} />
            {obstacles.map((obstacle) => (
                <Obstacle key={obstacle.id} position={obstacle.position} />
            ))}
            {gameOver && <h2>Game Over</h2>}
        </div>
    );
};

export default Game;
