// Dados da narrativa do jogo RPG
export const storyData = {
  player: {
    name: "Alex Morallis",
    title: "Guardião da Ordem Constitucional",
    maxHealth: 100,
    maxPower: 100,
    health: 100,
    power: 100,
    reputation: 50, // 0-100, afeta o final
    constitutionalPoints: 0, // Pontos por decisões constitucionais
  },

  chapters: {
    menu: {
      id: "menu",
      title: "Alex Morallis - Guardião da Democracia",
      subtitle: "Uma jornada pela defesa da Constituição",
      type: "menu",
      content: "Bem-vindo ao jogo onde você assume o papel de Alex Morallis, juiz da mais alta instância da República. O Brasil enfrenta uma ameaça sem precedentes: Os Uniformes, um grupo radical que tenta sabotar a democracia através de golpes e desinformação. Sua missão é proteger a Constituição e manter a ordem democrática.",
      choices: [
        { text: "Iniciar Jornada", nextChapter: "chapter1", action: "startGame" },
        { text: "Como Jogar", nextChapter: "howToPlay", action: "showHowToPlay" },
        { text: "Sobre o Jogo", nextChapter: "about", action: "showAbout" }
      ]
    },

    about: {
      id: "about",
      title: "Sobre o Jogo",
      type: "info",
      content: "Este é um jogo de narrativa interativa onde suas decisões moldam o destino da democracia. Como Alex Morallis, você enfrentará dilemas morais, batalhas simbólicas e escolhas que determinarão o futuro do Brasil. Cada decisão tem consequências que afetam sua reputação, poder e o rumo da história.",
      choices: [
        { text: "Voltar ao Menu", nextChapter: "menu", action: "backToMenu" }
      ]
    },

    howToPlay: {
      id: "howToPlay",
      title: "Como Jogar",
      type: "howToPlay",
      content: "Aprenda as regras e sistemas do jogo para defender a democracia brasileira!",
      choices: [
        { text: "Voltar ao Menu", nextChapter: "menu", action: "backToMenu" }
      ]
    },

    chapter1: {
      id: "chapter1",
      title: "Capítulo 1: A Ameaça Surge",
      type: "dialogue",
      content: "Uma manhã de segunda-feira na Suprema Corte. Você, Alex Morallis, recebe uma ligação urgente: uma manifestação hostil está se formando do lado de fora, liderada por Os Uniformes. Eles carregam cartazes com acusações de 'fraude eleitoral' e exigem sua renúncia. A situação está tensa.",
      choices: [
        { 
          text: "Confrontar diretamente os manifestantes", 
          nextChapter: "chapter1_choice1",
          action: "confront",
          effects: { reputation: -10, constitutionalPoints: -5 }
        },
        { 
          text: "Aguardar e analisar a situação", 
          nextChapter: "chapter1_choice2",
          action: "analyze",
          effects: { reputation: 5, constitutionalPoints: 5 }
        },
        { 
          text: "Chamar reforços de segurança", 
          nextChapter: "chapter1_choice3",
          action: "callReinforcements",
          effects: { reputation: 0, constitutionalPoints: 10 }
        }
      ]
    },

    chapter1_choice1: {
      id: "chapter1_choice1",
      title: "Confronto Direto",
      type: "dialogue",
      content: "Você sai para confrontar os manifestantes. A tensão aumenta rapidamente. Capitão Botanagua, líder dos Uniformes, grita acusações de corrupção. A situação fica violenta e você é atingido por uma pedra. Sua autoridade foi questionada publicamente.",
      choices: [
        { text: "Continuar", nextChapter: "chapter2", action: "continue" }
      ]
    },

    chapter1_choice2: {
      id: "chapter1_choice2",
      title: "Análise Estratégica",
      type: "dialogue",
      content: "Você decide aguardar e analisar. Observa que a manifestação é bem organizada e tem apoio midiático. Identifica que é parte de uma estratégia maior. Sua paciência permite que você entenda melhor a tática dos Uniformes.",
      choices: [
        { text: "Continuar", nextChapter: "chapter2", action: "continue" }
      ]
    },

    chapter1_choice3: {
      id: "chapter1_choice3",
      title: "Reforços Estratégicos",
      type: "dialogue",
      content: "Você chama reforços de segurança de forma discreta. A presença policial controlada dispersa a manifestação sem violência. Você demonstra autoridade sem perder a compostura. A mídia registra sua postura firme mas constitucional.",
      choices: [
        { text: "Continuar", nextChapter: "chapter2", action: "continue" }
      ]
    },

    chapter2: {
      id: "chapter2",
      title: "Capítulo 2: Escolhas Jurídicas",
      type: "dialogue",
      content: "Após o incidente, você descobre que Os Uniformes estão disseminando desinformação em massa nas redes sociais. Eles alegam fraudes eleitorais sem evidências e incitam violência. Como Guardião da Constituição, você deve decidir como agir.",
      choices: [
        { 
          text: "Determinar censura total das redes golpistas", 
          nextChapter: "chapter2_choice1",
          action: "censor",
          effects: { reputation: -15, constitutionalPoints: -10 }
        },
        { 
          text: "Preservar liberdade total de expressão", 
          nextChapter: "chapter2_choice2",
          action: "preserveFreedom",
          effects: { reputation: 10, constitutionalPoints: 15 }
        },
        { 
          text: "Equilibrar: monitorar sem censurar", 
          nextChapter: "chapter2_choice3",
          action: "balance",
          effects: { reputation: 5, constitutionalPoints: 10 }
        }
      ]
    },

    chapter2_choice1: {
      id: "chapter2_choice1",
      title: "Censura Total",
      type: "dialogue",
      content: "Você determina censura total. A medida é controversa e gera críticas internacionais. Os Uniformes usam isso como prova de 'autoritarismo'. Sua reputação sofre, mas a desinformação diminui temporariamente.",
      choices: [
        { text: "Continuar", nextChapter: "chapter3", action: "continue" }
      ]
    },

    chapter2_choice2: {
      id: "chapter2_choice2",
      title: "Liberdade Total",
      type: "dialogue",
      content: "Você preserva a liberdade total de expressão. Os Uniformes continuam disseminando desinformação, mas você demonstra compromisso com a democracia. A comunidade internacional elogia sua postura, mas a desinformação cresce.",
      choices: [
        { text: "Continuar", nextChapter: "chapter3", action: "continue" }
      ]
    },

    chapter2_choice3: {
      id: "chapter2_choice3",
      title: "Equilíbrio Constitucional",
      type: "dialogue",
      content: "Você implementa monitoramento sem censura. A estratégia é eficaz: identifica e combate desinformação sem violar direitos fundamentais. Sua abordagem equilibrada ganha respeito tanto de democratas quanto de críticos moderados.",
      choices: [
        { text: "Continuar", nextChapter: "chapter3", action: "continue" }
      ]
    },

    chapter3: {
      id: "chapter3",
      title: "Capítulo 3: A Conspiração Armada",
      type: "dialogue",
      content: "Inteligência revela planos de atentado contra o Presidente Lúcio Silva e o Vice-Presidente Geraldinho. Os Uniformes planejam um golpe armado. Você tem evidências, mas agir precipitadamente pode causar pânico. O que fazer?",
      choices: [
        { 
          text: "Interceptar imediatamente com força total", 
          nextChapter: "chapter3_choice1",
          action: "intercept",
          effects: { reputation: -5, constitutionalPoints: 5 }
        },
        { 
          text: "Investigar discretamente", 
          nextChapter: "chapter3_choice2",
          action: "investigate",
          effects: { reputation: 10, constitutionalPoints: 15 }
        },
        { 
          text: "Subestimar a ameaça", 
          nextChapter: "chapter3_choice3",
          action: "underestimate",
          effects: { reputation: -20, constitutionalPoints: -15 }
        }
      ]
    },

    chapter3_choice1: {
      id: "chapter3_choice1",
      title: "Interceptação Imediata",
      type: "dialogue",
      content: "Você ordena interceptação imediata. A operação é bem-sucedida, mas causa pânico público. Os Uniformes usam isso para acusar 'perseguição política'. Alguns inocentes são afetados, mas os líderes do golpe são presos.",
      choices: [
        { text: "Continuar", nextChapter: "chapter4", action: "continue" }
      ]
    },

    chapter3_choice2: {
      id: "chapter3_choice2",
      title: "Investigação Discreta",
      type: "dialogue",
      content: "Você conduz investigação discreta e eficiente. Consegue evidências sólidas sem causar pânico. A operação é executada com precisão cirúrgica, prendendo apenas os culpados. Sua estratégia é elogiada pela comunidade jurídica.",
      choices: [
        { text: "Continuar", nextChapter: "chapter4", action: "continue" }
      ]
    },

    chapter3_choice3: {
      id: "chapter3_choice3",
      title: "Subestimação Perigosa",
      type: "dialogue",
      content: "Você subestima a ameaça. Os Uniformes conseguem executar parte do plano. O Vice-Presidente Geraldinho é ferido em um atentado. Sua inação é criticada publicamente. A confiança na democracia diminui significativamente.",
      choices: [
        { text: "Continuar", nextChapter: "chapter4", action: "continue" }
      ]
    },

    chapter4: {
      id: "chapter4",
      title: "Capítulo 4: Batalha Simbólica",
      type: "battle",
      content: "Os Uniformes lançam um ataque final. Capitão Botanagua lidera uma tentativa de invasão da Suprema Corte. É hora de enfrentar o mal diretamente. Sua Constituição e sua coragem serão testadas.",
      enemy: {
        name: "Capitão Botanagua",
        health: 80,
        maxHealth: 80,
        attacks: [
          { name: "Desinformação", damage: 15, description: "Ataque de mentiras e manipulação" },
          { name: "Violência", damage: 20, description: "Ataque direto e brutal" },
          { name: "Golpe de Estado", damage: 25, description: "Ataque final devastador" }
        ]
      },
      choices: [
        { text: "Iniciar Batalha", nextChapter: "chapter4_battle", action: "startBattle" }
      ]
    },

    chapter4_battle: {
      id: "chapter4_battle",
      title: "Batalha Final",
      type: "battle",
      content: "A batalha está em andamento. Use suas habilidades constitucionais para derrotar Capitão Botanagua e salvar a democracia!",
      choices: [
        { text: "Atacar", action: "attack" },
        { text: "Defender", action: "defend" },
        { text: "Poder Supremo", action: "supremePower" }
      ]
    },

    chapter5: {
      id: "chapter5",
      title: "Capítulo 5: O Julgamento",
      type: "dialogue",
      content: "Após a batalha, Capitão Botanagua está preso. Agora você deve decidir seu destino. Como Guardião da Constituição, sua decisão será histórica.",
      choices: [
        { 
          text: "Julgamento rigoroso com pena máxima", 
          nextChapter: "chapter5_choice1",
          action: "harshSentence",
          effects: { reputation: -10, constitutionalPoints: 5 }
        },
        { 
          text: "Julgamento justo com pena proporcional", 
          nextChapter: "chapter5_choice2",
          action: "fairSentence",
          effects: { reputation: 15, constitutionalPoints: 20 }
        },
        { 
          text: "Anistia em troca de informações", 
          nextChapter: "chapter5_choice3",
          action: "amnesty",
          effects: { reputation: 5, constitutionalPoints: 10 }
        }
      ]
    },

    chapter5_choice1: {
      id: "chapter5_choice1",
      title: "Pena Máxima",
      type: "dialogue",
      content: "Você aplica a pena máxima. A decisão é controversa e divide a opinião pública. Alguns elogiam sua firmeza, outros criticam o rigor. A democracia é preservada, mas com cicatrizes.",
      choices: [
        { text: "Continuar", nextChapter: "chapter6", action: "continue" }
      ]
    },

    chapter5_choice2: {
      id: "chapter5_choice2",
      title: "Justiça Equilibrada",
      type: "dialogue",
      content: "Você aplica justiça equilibrada. A decisão é elogiada pela comunidade internacional. Demonstra que a democracia pode ser firme sem ser cruel. Sua reputação como guardião da Constituição é consolidada.",
      choices: [
        { text: "Continuar", nextChapter: "chapter6", action: "continue" }
      ]
    },

    chapter5_choice3: {
      id: "chapter5_choice3",
      title: "Anistia Estratégica",
      type: "dialogue",
      content: "Você oferece anistia em troca de informações. A estratégia revela mais conspiradores e fortalece o sistema. Alguns criticam a 'impunidade', mas a eficácia é reconhecida.",
      choices: [
        { text: "Continuar", nextChapter: "chapter6", action: "continue" }
      ]
    },

    chapter6: {
      id: "chapter6",
      title: "Capítulo 6: O Destino da Democracia",
      type: "dialogue",
      content: "Chegou o momento final. Suas decisões ao longo da jornada determinarão o futuro do Brasil. A democracia será restaurada ou o golpe será concretizado?",
      choices: [
        { text: "Ver Final", nextChapter: "final", action: "showFinal" }
      ]
    },

    final: {
      id: "final",
      title: "O Final da Jornada",
      type: "final",
      content: "Baseado em suas escolhas, aqui está o destino da democracia brasileira...",
      choices: [
        { text: "Jogar Novamente", nextChapter: "menu", action: "restart" },
        { text: "Ver Estatísticas", nextChapter: "stats", action: "showStats" }
      ]
    },

    stats: {
      id: "stats",
      title: "Suas Estatísticas",
      type: "stats",
      content: "Aqui estão suas estatísticas finais:",
      choices: [
        { text: "Voltar ao Menu", nextChapter: "menu", action: "backToMenu" }
      ]
    }
  }
};

// Função para calcular o final baseado nas estatísticas do jogador
export const calculateFinal = (player) => {
  const { reputation, constitutionalPoints } = player;
  
  if (reputation >= 70 && constitutionalPoints >= 60) {
    return {
      title: "Democracia Restaurada - Final Perfeito",
      content: "Parabéns! Você conseguiu proteger a democracia com excelência. Suas decisões equilibradas, respeito à Constituição e estratégia eficaz resultaram em um Brasil mais forte e democrático. Alex Morallis é reconhecido como o maior guardião da ordem constitucional da história. A democracia brasileira emerge mais robusta do que nunca.",
      ending: "perfect"
    };
  } else if (reputation >= 50 && constitutionalPoints >= 40) {
    return {
      title: "Democracia Preservada - Final Bom",
      content: "Bom trabalho! Você conseguiu preservar a democracia, apesar de alguns erros. O Brasil mantém sua estabilidade democrática, embora com algumas cicatrizes. Alex Morallis é respeitado como um guardião competente da Constituição.",
      ending: "good"
    };
  } else if (reputation >= 30 && constitutionalPoints >= 20) {
    return {
      title: "Democracia Instável - Final Regular",
      content: "Você conseguiu evitar o pior, mas a democracia ficou instável. Suas decisões controversas deixaram marcas profundas. O Brasil sobrevive, mas com tensões políticas significativas. Alex Morallis é visto como uma figura polêmica.",
      ending: "regular"
    };
  } else {
    return {
      title: "Golpe Bem-Sucedido - Final Ruim",
      content: "Infelizmente, suas decisões levaram ao sucesso do golpe. Os Uniformes conseguiram tomar o poder. A democracia brasileira foi derrubada. Alex Morallis é visto como um fracasso na proteção da Constituição. O Brasil entra em um período sombrio.",
      ending: "bad"
    };
  }
}; 