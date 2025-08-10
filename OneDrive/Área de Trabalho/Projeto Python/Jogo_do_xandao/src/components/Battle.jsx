import React, { useState, useEffect } from 'react';
import { Sword, Shield, Zap, Skull, Heart, Target } from 'lucide-react';

const Battle = ({ battleState, onBattleResult, onUpdatePlayer }) => {
  const [player, setPlayer] = useState(battleState.player);
  const [enemy, setEnemy] = useState(battleState.enemy);
  const [battleLog, setBattleLog] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Função para adicionar log de batalha
  const addBattleLog = (message, type = 'info') => {
    setBattleLog(prev => [...prev, { message, type, timestamp: Date.now() }]);
  };

  // Função para ataque do jogador
  const handlePlayerAttack = () => {
    if (!isPlayerTurn || isAnimating) return;

    setIsAnimating(true);
    const damage = Math.floor(Math.random() * 20) + 10; // 10-30 de dano
    const newEnemyHealth = Math.max(0, enemy.health - damage);
    
    setEnemy(prev => ({ ...prev, health: newEnemyHealth }));
    addBattleLog(`Alex Morallis ataca com a Constituição! Causa ${damage} de dano.`, 'player');
    
    setTimeout(() => {
      setIsAnimating(false);
      if (newEnemyHealth <= 0) {
        handleVictory();
      } else {
        setIsPlayerTurn(false);
        setTimeout(handleEnemyTurn, 1000);
      }
    }, 500);
  };

  // Função para defesa do jogador
  const handlePlayerDefend = () => {
    if (!isPlayerTurn || isAnimating) return;

    setIsAnimating(true);
    const heal = Math.floor(Math.random() * 15) + 5; // 5-20 de cura
    const newPlayerHealth = Math.min(player.maxHealth, player.health + heal);
    
    setPlayer(prev => ({ ...prev, health: newPlayerHealth }));
    addBattleLog(`Alex Morallis se defende com a Lei! Recupera ${heal} de vida.`, 'player');
    
    setTimeout(() => {
      setIsAnimating(false);
      setIsPlayerTurn(false);
      setTimeout(handleEnemyTurn, 1000);
    }, 500);
  };

  // Função para poder supremo do jogador
  const handlePlayerSupremePower = () => {
    if (!isPlayerTurn || isAnimating || player.power < 30) return;

    setIsAnimating(true);
    const damage = Math.floor(Math.random() * 30) + 20; // 20-50 de dano
    const newEnemyHealth = Math.max(0, enemy.health - damage);
    const newPlayerPower = Math.max(0, player.power - 30);
    
    setEnemy(prev => ({ ...prev, health: newEnemyHealth }));
    setPlayer(prev => ({ ...prev, power: newPlayerPower }));
    addBattleLog(`Alex Morallis usa Poder Supremo da Justiça! Causa ${damage} de dano devastador!`, 'supreme');
    
    setTimeout(() => {
      setIsAnimating(false);
      if (newEnemyHealth <= 0) {
        handleVictory();
      } else {
        setIsPlayerTurn(false);
        setTimeout(handleEnemyTurn, 1000);
      }
    }, 500);
  };

  // Função para turno do inimigo
  const handleEnemyTurn = () => {
    if (gameOver) return;

    setIsAnimating(true);
    const attackIndex = Math.floor(Math.random() * enemy.attacks.length);
    const attack = enemy.attacks[attackIndex];
    const damage = Math.floor(Math.random() * 10) + attack.damage - 5; // Variação no dano
    
    const newPlayerHealth = Math.max(0, player.health - damage);
    setPlayer(prev => ({ ...prev, health: newPlayerHealth }));
    
    addBattleLog(`${enemy.name} usa ${attack.name}! ${attack.description} Causa ${damage} de dano.`, 'enemy');
    
    setTimeout(() => {
      setIsAnimating(false);
      if (newPlayerHealth <= 0) {
        handleDefeat();
      } else {
        setIsPlayerTurn(true);
      }
    }, 500);
  };

  // Função para vitória
  const handleVictory = () => {
    addBattleLog('Alex Morallis derrota General Bólvar! A democracia está salva!', 'victory');
    setGameOver(true);
    setTimeout(() => {
      onUpdatePlayer(player);
      onBattleResult('victory');
    }, 2000);
  };

  // Função para derrota
  const handleDefeat = () => {
    addBattleLog('Alex Morallis foi derrotado! A democracia está em perigo...', 'defeat');
    setGameOver(true);
    setTimeout(() => {
      onUpdatePlayer(player);
      onBattleResult('defeat');
    }, 2000);
  };

  // Efeito para iniciar a batalha
  useEffect(() => {
    addBattleLog('A batalha final começou! Capitão Botanagua vs Alex Morallis!', 'battle-start');
  }, []);

  return (
    <div className="battle-container">
      {/* Título da batalha */}
             <div className="text-center mb-6">
         <h2 className="text-3xl font-bold text-brasil-yellow mb-2">Batalha Final</h2>
         <p className="text-white/80">Alex Morallis vs Capitão Botanagua</p>
       </div>

      {/* Status dos combatentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Jogador */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-brasil-green" />
            <h3 className="text-xl font-bold text-brasil-green">Alex Morallis</h3>
          </div>
          
          {/* Barra de vida */}
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Vida</span>
              <span className="font-semibold">{player.health}/{player.maxHealth}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-green-500 transition-all duration-300"
                style={{ width: `${Math.max(0, (player.health / player.maxHealth) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Barra de poder */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Poder</span>
              <span className="font-semibold">{player.power}/{player.maxPower}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-brasil-yellow transition-all duration-300"
                style={{ width: `${Math.max(0, (player.power / player.maxPower) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Inimigo */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Skull className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-bold text-red-500">{enemy.name}</h3>
          </div>
          
          {/* Barra de vida do inimigo */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Vida</span>
              <span className="font-semibold">{enemy.health}/{enemy.maxHealth}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-red-500 transition-all duration-300"
                style={{ width: `${Math.max(0, (enemy.health / enemy.maxHealth) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações do jogador */}
      {!gameOver && isPlayerTurn && !isAnimating && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handlePlayerAttack}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Sword className="w-5 h-5" />
            Atacar
          </button>
          
          <button
            onClick={handlePlayerDefend}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Defender
          </button>
          
          <button
            onClick={handlePlayerSupremePower}
            disabled={player.power < 30}
            className={`flex items-center justify-center gap-2 ${
              player.power >= 30 
                ? 'bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl' 
                : 'bg-gray-600 text-gray-400 font-semibold py-3 px-6 rounded-lg cursor-not-allowed'
            }`}
          >
            <Zap className="w-5 h-5" />
            Poder Supremo
          </button>
        </div>
      )}

      {/* Indicador de turno */}
      {!gameOver && (
        <div className="text-center mb-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            isPlayerTurn 
              ? 'bg-brasil-green text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {isPlayerTurn ? (
              <>
                <Target className="w-4 h-4" />
                <span>Sua vez</span>
              </>
            ) : (
              <>
                <Skull className="w-4 h-4" />
                <span>Vez do inimigo</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Log de batalha */}
      <div className="card max-h-48 overflow-y-auto">
        <h4 className="text-lg font-semibold text-brasil-yellow mb-3">Log de Batalha</h4>
        <div className="space-y-2">
          {battleLog.slice(-8).map((log, index) => (
            <div 
              key={index} 
              className={`text-sm p-2 rounded ${
                log.type === 'player' ? 'bg-brasil-green/20 text-green-300' :
                log.type === 'enemy' ? 'bg-red-500/20 text-red-300' :
                log.type === 'supreme' ? 'bg-brasil-yellow/20 text-yellow-300' :
                log.type === 'victory' ? 'bg-green-600/20 text-green-300' :
                log.type === 'defeat' ? 'bg-red-600/20 text-red-300' :
                'bg-white/10 text-white/80'
              }`}
            >
              {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Battle; 