// src/config.js — always use this, never hardcode localhost

export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';
// Score color helper — used everywhere
export const scoreColor = (score) => {
if (!score) return '#6b7280';
if (score >= 65) return '#00ff88';
if (score >= 45) return '#ffd60a';
return '#ff3b3b';
};