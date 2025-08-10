import React from 'react';
import { Heart, Zap, Star, Shield } from 'lucide-react';

const StatusBar = ({ player, onUpdateStats }) => {
  // Função para calcular a cor da barra baseada no valor
  const getBarColor = (value, maxValue) => {
    const percentage = (value / maxValue) * 100;
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Função para calcular a largura da barra
  const getBarWidth = (value, maxValue) => {
    return Math.max(0, Math.min(100, (value / maxValue) * 100));
  };

  return (
    <div className="status-bar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vida */}
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-red-400" />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Vida</span>
              <span className="font-semibold">{player.health}/{player.maxHealth}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getBarColor(player.health, player.maxHealth)}`}
                style={{ width: `${getBarWidth(player.health, player.maxHealth)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Poder */}
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-brasil-yellow" />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Poder</span>
              <span className="font-semibold">{player.power}/{player.maxPower}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getBarColor(player.power, player.maxPower)}`}
                style={{ width: `${getBarWidth(player.power, player.maxPower)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Reputação */}
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-brasil-yellow" />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Reputação</span>
              <span className="font-semibold">{player.reputation}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getBarColor(player.reputation, 100)}`}
                style={{ width: `${getBarWidth(player.reputation, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pontos Constitucionais */}
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-brasil-green" />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span>Constituição</span>
              <span className="font-semibold">{player.constitutionalPoints}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getBarColor(player.constitutionalPoints, 100)}`}
                style={{ width: `${getBarWidth(player.constitutionalPoints, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-white/80">Alex Morallis</span>
            <span className="text-brasil-yellow font-semibold">•</span>
            <span className="text-white/80">Guardião da Ordem Constitucional</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60">Capítulo atual</span>
            <span className="text-brasil-yellow font-semibold">
              {player.reputation >= 70 ? 'Final Perfeito' : 
               player.reputation >= 50 ? 'Final Bom' : 
               player.reputation >= 30 ? 'Final Regular' : 'Final Ruim'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar; 