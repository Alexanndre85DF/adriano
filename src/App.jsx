import React, { useState, useEffect } from 'react';
import { Shield, Sword, Heart, Zap, Crown, Flag } from 'lucide-react';
import DialogueBox from './components/DialogueBox';
import Battle from './components/Battle';
import StatusBar from './components/StatusBar';
import { storyData, calculateFinal } from './data/story';

function App() {
  const [currentChapter, setCurrentChapter] = useState('menu');
  const [player, setPlayer] = useState(storyData.player);
  const [battleState, setBattleState] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [finalResult, setFinalResult] = useState(null);

  // Função para aplicar efeitos das escolhas
  const applyChoiceEffects = (effects) => {
    if (!effects) return;
    
    setPlayer(prev => ({
      ...prev,
      reputation: Math.max(0, Math.min(100, prev.reputation + (effects.reputation || 0))),
      constitutionalPoints: Math.max(0, Math.min(100, prev.constitutionalPoints + (effects.constitutionalPoints || 0)))
    }));
  };

  // Função para lidar com escolhas do jogador
  const handleChoice = (choice) => {
    // Aplicar efeitos se existirem
    if (choice.effects) {
      applyChoiceEffects(choice.effects);
    }

    // Adicionar à história
    setGameHistory(prev => [...prev, {
      chapter: currentChapter,
      choice: choice.text,
      timestamp: new Date().toISOString()
    }]);

    // Se for uma batalha
    if (choice.action === 'startBattle') {
      const chapter = storyData.chapters[currentChapter];
      setBattleState({
        enemy: chapter.enemy,
        player: player,
        isActive: true
      });
      setCurrentChapter('chapter4_battle');
      return;
    }

    // Se for ação de batalha
    if (['attack', 'defend', 'supremePower'].includes(choice.action)) {
      return; // Será tratado pelo componente Battle
    }

    // Se for para mostrar o final
    if (choice.action === 'showFinal') {
      const final = calculateFinal(player);
      setFinalResult(final);
      setCurrentChapter('final');
      return;
    }

    // Se for para reiniciar
    if (choice.action === 'restart') {
      setPlayer(storyData.player);
      setCurrentChapter('menu');
      setBattleState(null);
      setGameHistory([]);
      setFinalResult(null);
      return;
    }

    // Navegar para o próximo capítulo
    if (choice.nextChapter) {
      setCurrentChapter(choice.nextChapter);
    }
  };

  // Função para lidar com resultado da batalha
  const handleBattleResult = (result) => {
    setBattleState(null);
    if (result === 'victory') {
      setCurrentChapter('chapter5');
    } else {
      // Em caso de derrota, aplicar penalidades
      setPlayer(prev => ({
        ...prev,
        health: Math.max(0, prev.health - 30),
        reputation: Math.max(0, prev.reputation - 20)
      }));
      setCurrentChapter('chapter5');
    }
  };

  // Função para atualizar estatísticas do jogador
  const updatePlayerStats = (newStats) => {
    setPlayer(prev => ({ ...prev, ...newStats }));
  };

  // Obter dados do capítulo atual
  const getCurrentChapterData = () => {
    if (currentChapter === 'final' && finalResult) {
      return {
        ...storyData.chapters.final,
        title: finalResult.title,
        content: finalResult.content
      };
    }
    return storyData.chapters[currentChapter] || storyData.chapters.menu;
  };

  const currentChapterData = getCurrentChapterData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brasil-green to-dark-green">
      {/* Header com título */}
      <header className="text-center py-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-brasil-yellow" />
          <h1 className="text-3xl font-bold text-brasil-yellow">
            Alex Morallis
          </h1>
          <Crown className="w-8 h-8 text-brasil-yellow" />
        </div>
        <p className="text-white/80 text-lg">
          Guardião da Ordem Constitucional
        </p>
      </header>

      {/* Container principal */}
      <main className="container mx-auto px-4 max-w-4xl">
        {/* Barra de status */}
        {currentChapter !== 'menu' && currentChapter !== 'about' && (
          <StatusBar 
            player={player} 
            onUpdateStats={updatePlayerStats}
          />
        )}

        {/* Conteúdo principal */}
        <div className="mt-6">
          {battleState && battleState.isActive ? (
            <Battle 
              battleState={battleState}
              onBattleResult={handleBattleResult}
              onUpdatePlayer={updatePlayerStats}
            />
          ) : (
            <DialogueBox 
              chapterData={currentChapterData}
              onChoice={handleChoice}
              player={player}
              gameHistory={gameHistory}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-white/60 text-sm">
          <div className="flex items-center justify-center gap-2">
            <Flag className="w-4 h-4" />
            <span>Democracia Brasileira - 2025</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App; 