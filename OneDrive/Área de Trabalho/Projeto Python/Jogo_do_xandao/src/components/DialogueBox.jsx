import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronRight, BookOpen, Trophy, BarChart3, Gamepad2, Heart, Zap, Star, Shield, Sword } from 'lucide-react';

const DialogueBox = ({ chapterData, onChoice, player, gameHistory }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  // Efeito de digitação para o texto
  useEffect(() => {
    if (!chapterData?.content) return;

    setIsTyping(true);
    setDisplayedText('');
    setShowChoices(false);

    let index = 0;
    const interval = setInterval(() => {
      if (index < chapterData.content.length) {
        setDisplayedText(chapterData.content.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        setShowChoices(true);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [chapterData?.content]);

  // Função para lidar com clique nas escolhas
  const handleChoiceClick = (choice) => {
    setShowChoices(false);
    onChoice(choice);
  };

  // Renderizar conteúdo baseado no tipo
  const renderContent = () => {
    if (!chapterData) return null;

    switch (chapterData.type) {
      case 'menu':
        return (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-brasil-yellow mb-4">
                {chapterData.title}
              </h2>
              {chapterData.subtitle && (
                <p className="text-xl text-white/80 mb-6">{chapterData.subtitle}</p>
              )}
            </div>
            <div className="dialogue-box max-w-2xl mx-auto">
              <p className="text-lg leading-relaxed">{displayedText}</p>
              {isTyping && <span className="animate-pulse">|</span>}
            </div>
          </div>
        );

             case 'info':
         return (
           <div className="dialogue-box max-w-3xl mx-auto">
             <div className="flex items-center gap-3 mb-4">
               <BookOpen className="w-6 h-6 text-brasil-yellow" />
               <h2 className="text-2xl font-bold text-brasil-yellow">{chapterData.title}</h2>
             </div>
             <p className="text-lg leading-relaxed">{displayedText}</p>
             {isTyping && <span className="animate-pulse">|</span>}
           </div>
         );

       case 'howToPlay':
         return (
           <div className="dialogue-box max-w-4xl mx-auto">
             <div className="flex items-center gap-3 mb-6">
               <Gamepad2 className="w-6 h-6 text-brasil-yellow" />
               <h2 className="text-2xl font-bold text-brasil-yellow">{chapterData.title}</h2>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Sistema de Status */}
               <div className="card">
                 <div className="flex items-center gap-2 mb-4">
                   <BarChart3 className="w-5 h-5 text-brasil-yellow" />
                   <h3 className="text-lg font-semibold text-brasil-yellow">Sistema de Status</h3>
                 </div>
                 <div className="space-y-3">
                   <div className="flex items-center gap-2">
                     <Heart className="w-4 h-4 text-red-400" />
                     <span className="text-sm"><strong>Vida:</strong> Afetada por batalhas. Se chegar a 0, você perde.</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Zap className="w-4 h-4 text-brasil-yellow" />
                     <span className="text-sm"><strong>Poder:</strong> Consumido por habilidades especiais como "Poder Supremo".</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Star className="w-4 h-4 text-brasil-yellow" />
                     <span className="text-sm"><strong>Reputação:</strong> Afetada por decisões políticas (0-100).</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Shield className="w-4 h-4 text-brasil-green" />
                     <span className="text-sm"><strong>Pontos Constitucionais:</strong> Medem respeito à democracia (0-100).</span>
                   </div>
                 </div>
               </div>

               {/* Sistema de Batalha */}
               <div className="card">
                 <div className="flex items-center gap-2 mb-4">
                   <Sword className="w-5 h-5 text-brasil-yellow" />
                   <h3 className="text-lg font-semibold text-brasil-yellow">Sistema de Batalha</h3>
                 </div>
                 <div className="space-y-3">
                   <div className="text-sm">
                     <strong>Atacar:</strong> Causa 10-30 de dano ao inimigo.
                   </div>
                   <div className="text-sm">
                     <strong>Defender:</strong> Recupera 5-20 de vida.
                   </div>
                   <div className="text-sm">
                     <strong>Poder Supremo:</strong> Causa 20-50 de dano, mas consome 30 de poder.
                   </div>
                                       <div className="text-sm text-white/70">
                      <em>Batalha por turnos contra Capitão Botanagua no Capítulo 4.</em>
                    </div>
                 </div>
               </div>

               {/* Sistema de Decisões */}
               <div className="card">
                 <div className="flex items-center gap-2 mb-4">
                   <MessageSquare className="w-5 h-5 text-brasil-yellow" />
                   <h3 className="text-lg font-semibold text-brasil-yellow">Sistema de Decisões</h3>
                 </div>
                 <div className="space-y-3">
                   <div className="text-sm">
                     <strong>Decisões Constitucionais:</strong> Aumentam pontos de constituição.
                   </div>
                   <div className="text-sm">
                     <strong>Decisões Controversas:</strong> Podem diminuir reputação.
                   </div>
                   <div className="text-sm">
                     <strong>Decisões Equilibradas:</strong> Mantêm estabilidade.
                   </div>
                   <div className="text-sm text-white/70">
                     <em>Cada escolha tem consequências que afetam o final.</em>
                   </div>
                 </div>
               </div>

               {/* Finais Possíveis */}
               <div className="card">
                 <div className="flex items-center gap-2 mb-4">
                   <Trophy className="w-5 h-5 text-brasil-yellow" />
                   <h3 className="text-lg font-semibold text-brasil-yellow">Finais Possíveis</h3>
                 </div>
                 <div className="space-y-2 text-sm">
                   <div><strong>Final Perfeito:</strong> Reputação ≥70 e Constituição ≥60</div>
                   <div><strong>Final Bom:</strong> Reputação ≥50 e Constituição ≥40</div>
                   <div><strong>Final Regular:</strong> Reputação ≥30 e Constituição ≥20</div>
                   <div><strong>Final Ruim:</strong> Valores abaixo dos mínimos</div>
                 </div>
               </div>
             </div>

             {/* Contexto da História */}
             <div className="card mt-6">
               <h3 className="text-lg font-semibold text-brasil-yellow mb-3">Contexto da História</h3>
               <div className="space-y-3 text-sm leading-relaxed">
                 <p>
                   <strong>Alex Morallis:</strong> Juiz da mais alta instância da República, Guardião da Ordem Constitucional. 
                   Sua missão é proteger a democracia brasileira contra ameaças internas.
                 </p>
                                   <p>
                    <strong>Os Uniformes:</strong> Grupo radical liderado por Capitão Botanagua que tenta sabotar a democracia 
                    através de golpes e desinformação. Eles alegam fraudes eleitorais sem evidências.
                  </p>
                  <p>
                    <strong>Presidente Lúcio Silva:</strong> Líder democraticamente eleito que está sob ameaça de atentado.
                  </p>
                  <p>
                    <strong>Vice-Presidente Geraldinho:</strong> Também corre risco de morte pelo grupo extremista.
                  </p>
                 <p className="text-white/70">
                   <em>Este é um jogo de ficção inspirado simbolicamente em eventos políticos brasileiros.</em>
                 </p>
               </div>
             </div>
           </div>
         );

      case 'stats':
        return (
          <div className="dialogue-box max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-brasil-yellow" />
              <h2 className="text-2xl font-bold text-brasil-yellow">{chapterData.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-brasil-yellow mb-3">Estatísticas do Jogador</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Reputação:</span>
                    <span className="font-semibold">{player.reputation}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pontos Constitucionais:</span>
                    <span className="font-semibold">{player.constitutionalPoints}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vida:</span>
                    <span className="font-semibold">{player.health}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Poder:</span>
                    <span className="font-semibold">{player.power}/100</span>
                  </div>
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-brasil-yellow mb-3">Histórico de Decisões</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {gameHistory.slice(-5).map((entry, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-semibold">{entry.choice}</div>
                      <div className="text-white/60 text-xs">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'final':
        return (
          <div className="dialogue-box max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-brasil-yellow" />
              <h2 className="text-2xl font-bold text-brasil-yellow">{chapterData.title}</h2>
            </div>
            <p className="text-lg leading-relaxed">{displayedText}</p>
            {isTyping && <span className="animate-pulse">|</span>}
          </div>
        );

      default:
        return (
          <div className="dialogue-box max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-brasil-yellow" />
              <h2 className="text-2xl font-bold text-brasil-yellow">{chapterData.title}</h2>
            </div>
            <p className="text-lg leading-relaxed">{displayedText}</p>
            {isTyping && <span className="animate-pulse">|</span>}
          </div>
        );
    }
  };

  // Renderizar escolhas
  const renderChoices = () => {
    if (!showChoices || !chapterData?.choices) return null;

    // Estilo centralizado para todos os botões
    const buttonContainerClass = "mt-8 flex flex-col items-center space-y-4 max-w-md mx-auto";
    const buttonClass = "w-full max-w-xs btn-primary text-center flex items-center justify-center group";

    return (
      <div className={buttonContainerClass}>
        {chapterData.choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleChoiceClick(choice)}
            className={buttonClass}
          >
            <span>{choice.text}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderContent()}
      {renderChoices()}
    </div>
  );
};

export default DialogueBox; 