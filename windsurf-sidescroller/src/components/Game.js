import React, { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';
import Obstacle from './Obstacle';
import Boss from './Boss';
import obst0 from '../assets/obst0.png';
import obst1 from '../assets/obst1.jpg';
import obst2 from '../assets/obst2.png';
import { 
    GROUND_LEVEL, 
    JUMP_HEIGHT, 
    JUMP_SPEED,
    OBSTACLE_SPEED,
    OBSTACLE_WIDTH,
    OBSTACLE_HEIGHT,
    PLAYER_SIZE,
    MIN_OBSTACLE_SPACING,
    MAX_OBSTACLE_SPACING,
    PLAYER_POSITION_X
} from '../constants';

const OBSTACLE_ICONS = [obst0, obst1, obst2];
const OBSTACLES_BEFORE_BOSS = 15;

const Game = () => {
    const [position, setPosition] = useState(GROUND_LEVEL);
    const [isJumping, setIsJumping] = useState(false);
    const [jumpProgress, setJumpProgress] = useState(0);
    const [score, setScore] = useState(0);
    const [obstacles, setObstacles] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [nextSpawnDistance, setNextSpawnDistance] = useState(MIN_OBSTACLE_SPACING);
    const [bossPosition, setBossPosition] = useState(null);
    const [diedToBoss, setDiedToBoss] = useState(false);

    const getRandomSpacing = () => {
        return MIN_OBSTACLE_SPACING + Math.random() * (MAX_OBSTACLE_SPACING - MIN_OBSTACLE_SPACING);
    };

    const getRandomIcon = () => {
        const randomIndex = Math.floor(Math.random() * OBSTACLE_ICONS.length);
        return OBSTACLE_ICONS[randomIndex];
    };

    const resetGame = useCallback(() => {
        setPosition(GROUND_LEVEL);
        setIsJumping(false);
        setJumpProgress(0);
        setScore(0);
        setObstacles([]);
        setGameOver(false);
        setNextSpawnDistance(getRandomSpacing());
        setBossPosition(null);
        setDiedToBoss(false);
    }, []);

    const jump = useCallback(() => {
        if (!isJumping && !gameOver) {
            setIsJumping(true);
            setJumpProgress(0);
        }
    }, [isJumping, gameOver]);

    // Handle jumping physics
    useEffect(() => {
        if (!isJumping) return;

        const jumpInterval = setInterval(() => {
            setJumpProgress(progress => {
                const newProgress = progress + JUMP_SPEED;
                
                if (newProgress >= 100) {
                    setIsJumping(false);
                    setPosition(GROUND_LEVEL);
                    return 0;
                }
                
                // Parabolic motion using sin function
                const jumpPhase = (newProgress / 100) * Math.PI;
                const height = Math.sin(jumpPhase) * JUMP_HEIGHT;
                const newPosition = GROUND_LEVEL - height;
                setPosition(newPosition);
                
                return newProgress;
            });
        }, 16);

        return () => clearInterval(jumpInterval);
    }, [isJumping]);

    // Check for collisions and score
    useEffect(() => {
        if (gameOver) return;

        const playerRect = {
            left: PLAYER_POSITION_X,
            right: PLAYER_POSITION_X + PLAYER_SIZE,
            top: position - PLAYER_SIZE,
            bottom: position
        };

        // Check regular obstacles
        obstacles.forEach(obstacle => {
            const obstacleRect = {
                left: obstacle.position,
                right: obstacle.position + OBSTACLE_WIDTH,
                top: GROUND_LEVEL - OBSTACLE_HEIGHT,
                bottom: GROUND_LEVEL
            };

            // Check collision
            const hasCollision = !(playerRect.right < obstacleRect.left || 
                                 playerRect.left > obstacleRect.right || 
                                 playerRect.bottom < obstacleRect.top || 
                                 playerRect.top > obstacleRect.bottom);

            if (hasCollision) {
                setGameOver(true);
            }

            // Check if obstacle was just cleared
            if (!obstacle.cleared && playerRect.left > obstacleRect.right) {
                obstacle.cleared = true;
                const newScore = score + 1;
                setScore(newScore);
                
                // Spawn boss after clearing 5 obstacles
                if (newScore === OBSTACLES_BEFORE_BOSS && bossPosition === null) {
                    setBossPosition(window.innerWidth);
                }
            }
        });

        // Check boss collision if it exists
        if (bossPosition !== null) {
            const bossRect = {
                left: bossPosition,
                right: bossPosition + 200,
                top: GROUND_LEVEL - (GROUND_LEVEL - 50),
                bottom: GROUND_LEVEL
            };

            const hasBossCollision = !(playerRect.right < bossRect.left || 
                                     playerRect.left > bossRect.right || 
                                     playerRect.bottom < bossRect.top || 
                                     playerRect.top > bossRect.bottom);

            if (hasBossCollision) {
                setDiedToBoss(true);
                setGameOver(true);
            }
        }
    }, [position, obstacles, gameOver, score, bossPosition]);

    // Main game loop
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                jump();
            } else if (event.code === 'Enter' && gameOver) {
                event.preventDefault();
                resetGame();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        const gameLoop = setInterval(() => {
            if (!gameOver) {
                // Move and clean up obstacles
                setObstacles(prev => 
                    prev
                        .map(obstacle => ({
                            ...obstacle,
                            position: obstacle.position - OBSTACLE_SPEED,
                            cleared: obstacle.cleared
                        }))
                        .filter(obstacle => obstacle.position > -OBSTACLE_WIDTH)
                );

                // Move boss if it exists
                if (bossPosition !== null) {
                    setBossPosition(prev => {
                        if (prev <= -200) return null; // Remove boss when it's off screen
                        return prev - OBSTACLE_SPEED;
                    });
                }

                // Only spawn new obstacles if boss hasn't appeared yet
                if (bossPosition === null) {
                    const lastObstacle = obstacles[obstacles.length - 1];
                    const lastObstaclePosition = lastObstacle ? lastObstacle.position : -Infinity;
                    
                    if (!lastObstacle || window.innerWidth - lastObstaclePosition >= nextSpawnDistance) {
                        const newObstacle = {
                            id: Date.now(),
                            position: window.innerWidth,
                            iconSrc: getRandomIcon(),
                            cleared: false
                        };
                        setObstacles(prev => [...prev, newObstacle]);
                        setNextSpawnDistance(getRandomSpacing());
                    }
                }
            }
        }, 20);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            clearInterval(gameLoop);
        };
    }, [jump, gameOver, obstacles, nextSpawnDistance, resetGame, bossPosition]);

    return (
        <div className="game-container">
            <h1>Score: {score}</h1>
            {gameOver && (
                <div className="game-over">
                    <h2 style={{ fontSize: '2.5em', marginBottom: '0.2em' }}>Game Over</h2>
                    {diedToBoss && <h3 style={{ fontSize: '2em', marginTop: '0', color: '#e74c3c' }}>AGI got you in the end!</h3>}
                    <p>Final Score: {score}</p>
                    <p>Press ENTER to restart</p>
                </div>
            )}
            <Icon position={position} />
            {obstacles.map(obstacle => (
                <Obstacle 
                    key={obstacle.id} 
                    position={obstacle.position}
                    iconSrc={obstacle.iconSrc}
                />
            ))}
            {bossPosition !== null && <Boss position={bossPosition} />}
        </div>
    );
};

export default Game;
