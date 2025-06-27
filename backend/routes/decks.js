const express = require('express');
const Deck = require('../models/Deck');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/decks
// @desc    Get all decks for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const decks = await Deck.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/decks/:id
// @desc    Get a specific deck
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const deck = await Deck.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    
    res.json(deck);
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/decks
// @desc    Create a new deck
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, iconId = null } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Deck name is required' });
    }

    const deck = new Deck({
      userId: req.user._id,
      name: name.trim(),
      iconId,
      cards: []
    });

    await deck.save();
    res.status(201).json(deck);
  } catch (error) {
    console.error('Error creating deck:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/decks/:id
// @desc    Update a deck
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const deck = await Deck.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    const { name, iconId, cards, isPublic } = req.body;
    
    if (name !== undefined) deck.name = name.trim();
    if (iconId !== undefined) deck.iconId = iconId;
    if (isPublic !== undefined) deck.isPublic = isPublic;
    
    if (cards !== undefined) {
      // Função para ordenar cartas (igual à do frontend e rota de adicionar carta)
      const sortCards = (cards) => {
        return [...cards].sort((a, b) => {
          const cardA = a.card;
          const cardB = b.card;
          
          // Definir prioridades por tipo
          const getTypePriority = (supertype) => {
            switch (supertype) {
              case 'Pokémon': return 1;
              case 'Trainer': return 2;
              case 'Energy': return 3;
              default: return 4;
            }
          };
          
          const priorityA = getTypePriority(cardA.supertype);
          const priorityB = getTypePriority(cardB.supertype);
          
          // Primeiro critério: tipo
          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }
          
          // Segundo critério: quantidade (maior primeiro)
          if (a.quantity !== b.quantity) {
            return b.quantity - a.quantity;
          }
          
          // Terceiro critério: nome alfabético
          return cardA.name.localeCompare(cardB.name);
        });
      };
      
      // Aplicar ordenação automática nas cartas
      deck.cards = sortCards(cards);
      console.log('📋 DECK: Cartas reordenadas automaticamente na atualização');
    }

    await deck.save();
    res.json(deck);
  } catch (error) {
    console.error('Error updating deck:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/decks/:id
// @desc    Delete a deck
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deck = await Deck.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    
    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/decks/:id/cards
// @desc    Add a card to a deck
router.post('/:id/cards', authMiddleware, async (req, res) => {
  console.log('🎴 DECK: Rota /cards chamada para deck:', req.params.id);
  console.log('🎴 DECK: Usuário autenticado:', req.user ? req.user._id : 'Não encontrado');
  console.log('🎴 DECK: Dados recebidos:', req.body);
  
  try {
    const deck = await Deck.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    console.log('🎴 DECK: Deck encontrado:', deck ? 'SIM' : 'NÃO');
    
    if (!deck) {
      console.log('❌ DECK: Deck não encontrado');
      return res.status(404).json({ error: 'Deck not found' });
    }

    const { card, quantity = 1 } = req.body;
    
    if (!card) {
      console.log('❌ DECK: Card data não fornecido');
      return res.status(400).json({ error: 'Card data is required' });
    }

    // Check if card already exists in deck
    const existingCardIndex = deck.cards.findIndex(item => item.card.id === card.id);
    console.log('🎴 DECK: Carta já existe?', existingCardIndex !== -1 ? 'SIM' : 'NÃO');
    
    if (existingCardIndex >= 0) {
      // Update quantity
      const oldQuantity = deck.cards[existingCardIndex].quantity;
      deck.cards[existingCardIndex].quantity = Math.min(4, deck.cards[existingCardIndex].quantity + quantity);
      console.log(`✅ DECK: Quantidade atualizada de ${oldQuantity} para ${deck.cards[existingCardIndex].quantity}`);
    } else {
      // Add new card
      deck.cards.push({ card, quantity: Math.min(4, quantity) });
      console.log('✅ DECK: Nova carta adicionada:', card.name);
    }

    // Função para ordenar cartas seguindo as regras:
    // 1. Por tipo: Pokémon > Trainer > Energy
    // 2. Por quantidade: 4 > 3 > 2 > 1
    // 3. Por nome (alfabética) como critério final
    const sortCards = (cards) => {
      return [...cards].sort((a, b) => {
        const cardA = a.card;
        const cardB = b.card;
        
        // Definir prioridades por tipo
        const getTypePriority = (supertype) => {
          switch (supertype) {
            case 'Pokémon': return 1;
            case 'Trainer': return 2;
            case 'Energy': return 3;
            default: return 4;
          }
        };
        
        const priorityA = getTypePriority(cardA.supertype);
        const priorityB = getTypePriority(cardB.supertype);
        
        // Primeiro critério: tipo
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        // Segundo critério: quantidade (maior primeiro)
        if (a.quantity !== b.quantity) {
          return b.quantity - a.quantity;
        }
        
        // Terceiro critério: nome alfabético
        return cardA.name.localeCompare(cardB.name);
      });
    };

    // Aplicar ordenação automática
    deck.cards = sortCards(deck.cards);
    console.log('📋 DECK: Cartas reordenadas automaticamente');

    await deck.save();
    console.log('🎴 DECK: Total de cartas no deck:', deck.cards.length);
    res.json(deck);
  } catch (error) {
    console.error('❌ DECK: Erro:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/decks/:id/cards/:cardId
// @desc    Remove a card from a deck
router.delete('/:id/cards/:cardId', authMiddleware, async (req, res) => {
  try {
    const deck = await Deck.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }

    // Remove card from deck
    deck.cards = deck.cards.filter(item => item.card.id !== req.params.cardId);

    await deck.save();
    res.json(deck);
  } catch (error) {
    console.error('Error removing card from deck:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
