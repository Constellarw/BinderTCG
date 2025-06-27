const express = require('express');
const Gallery = require('../models/Gallery');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/gallery
// @desc    Get gallery for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  console.log('📖 LEITURA: Rota /gallery chamada');
  console.log('📖 LEITURA: Usuário autenticado:', req.user ? req.user._id : 'Não encontrado');
  
  try {
    let gallery = await Gallery.findOne({ userId: req.user._id });
    console.log('📖 LEITURA: Galeria encontrada:', gallery ? 'SIM' : 'NÃO');
    
    // If no gallery exists, create one
    if (!gallery) {
      console.log('📖 LEITURA: Criando galeria vazia');
      gallery = new Gallery({
        userId: req.user._id,
        cards: []
      });
      await gallery.save();
    }
    
    console.log('📖 LEITURA: Total de cartas na galeria:', gallery.cards.length);
    res.json(gallery);
  } catch (error) {
    console.error('❌ LEITURA: Erro:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/gallery/cards
// @desc    Add a card to gallery
router.post('/cards', authMiddleware, async (req, res) => {
  console.log('🎴 ADIÇÃO: Rota /cards chamada');
  console.log('🎴 ADIÇÃO: Usuário autenticado:', req.user ? req.user._id : 'Não encontrado');
  console.log('🎴 ADIÇÃO: Dados recebidos:', req.body);
  
  try {
    const { card, notes = '' } = req.body;
    
    if (!card) {
      console.log('❌ ADIÇÃO: Card data não fornecido');
      return res.status(400).json({ error: 'Card data is required' });
    }

    let gallery = await Gallery.findOne({ userId: req.user._id });
    console.log('🎴 ADIÇÃO: Galeria encontrada:', gallery ? 'SIM' : 'NÃO');
    
    // If no gallery exists, create one
    if (!gallery) {
      console.log('🎴 ADIÇÃO: Criando nova galeria');
      gallery = new Gallery({
        userId: req.user._id,
        cards: []
      });
    }

    // Check if card already exists in gallery
    const existingCardIndex = gallery.cards.findIndex(item => item.card.id === card.id);
    console.log('🎴 ADIÇÃO: Carta já existe?', existingCardIndex !== -1 ? 'SIM' : 'NÃO');
    
    if (existingCardIndex === -1) {
      // Add new card
      gallery.cards.push({ card, notes });
      await gallery.save();
      console.log('✅ ADIÇÃO: Carta adicionada com sucesso:', card.name);
    } else {
      console.log('⚠️ ADIÇÃO: Carta já existe na galeria, não adicionando duplicata');
    }

    console.log('🎴 ADIÇÃO: Total de cartas na galeria:', gallery.cards.length);
    res.json(gallery);
  } catch (error) {
    console.error('❌ ADIÇÃO: Erro:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/gallery/cards/:cardId
// @desc    Remove a card from gallery
router.delete('/cards/:cardId', authMiddleware, async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ userId: req.user._id });
    
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    // Remove card from gallery
    gallery.cards = gallery.cards.filter(item => item.card.id !== req.params.cardId);

    await gallery.save();
    res.json(gallery);
  } catch (error) {
    console.error('Error removing card from gallery:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/gallery/cards/:cardId
// @desc    Update card notes in gallery
router.put('/cards/:cardId', authMiddleware, async (req, res) => {
  try {
    const { notes } = req.body;
    const gallery = await Gallery.findOne({ userId: req.user._id });
    
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    // Find and update card notes
    const cardIndex = gallery.cards.findIndex(item => item.card.id === req.params.cardId);
    
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found in gallery' });
    }

    gallery.cards[cardIndex].notes = notes || '';
    await gallery.save();
    
    res.json(gallery);
  } catch (error) {
    console.error('Error updating card notes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/gallery/share
// @desc    Share gallery and get shareable link
router.post('/share', authMiddleware, async (req, res) => {
  console.log('🔗 COMPARTILHAMENTO: Rota /share chamada');
  console.log('🔗 COMPARTILHAMENTO: Usuário autenticado:', req.user ? req.user._id : 'Não encontrado');
  
  try {
    let gallery = await Gallery.findOne({ userId: req.user._id }).populate('userId', 'name email');
    console.log('🔗 COMPARTILHAMENTO: Galeria encontrada:', gallery ? 'SIM' : 'NÃO');
    
    // Se não tem galeria, criar uma vazia
    if (!gallery) {
      console.log('🔗 COMPARTILHAMENTO: Criando galeria vazia para o usuário');
      gallery = new Gallery({
        userId: req.user._id,
        cards: []
      });
      await gallery.save();
      // Recarregar com populate
      gallery = await Gallery.findOne({ userId: req.user._id }).populate('userId', 'name email');
    }
    
    if (gallery.cards.length === 0) {
      console.log('🔗 COMPARTILHAMENTO: Galeria vazia - permitindo compartilhamento mesmo assim');
      // Permitir compartilhar galeria vazia
    }

    // Create a share token
    const shareToken = require('crypto').randomBytes(16).toString('hex');
    console.log('🔗 COMPARTILHAMENTO: Token gerado:', shareToken);
    
    // Update gallery with share settings
    gallery.isPublic = true;
    gallery.shareToken = shareToken;
    gallery.sharedAt = new Date();
    await gallery.save();

    const shareUrl = `${req.get('origin') || process.env.FRONTEND_URL}/galeria/compartilhada/${shareToken}`;
    console.log('🔗 COMPARTILHAMENTO: URL gerada:', shareUrl);
    
    res.json({
      shareUrl,
      shareToken,
      sharedAt: gallery.sharedAt
    });
    console.log('🔗 COMPARTILHAMENTO: Resposta enviada com sucesso');
  } catch (error) {
    console.error('🔗 COMPARTILHAMENTO: Erro:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/gallery/shared/:token
// @desc    Get shared gallery by token
router.get('/shared/:token', async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ 
      shareToken: req.params.token,
      isPublic: true 
    }).populate('userId', 'name email picture');
    
    if (!gallery) {
      return res.status(404).json({ error: 'Shared gallery not found' });
    }

    res.json({
      cards: gallery.cards,
      sharedBy: {
        name: gallery.userId.name,
        email: gallery.userId.email,
        picture: gallery.userId.picture
      },
      sharedAt: gallery.sharedAt,
      createdAt: gallery.createdAt
    });
  } catch (error) {
    console.error('Error fetching shared gallery:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/gallery/toggle-public
// @desc    Toggle gallery public/private status
router.put('/toggle-public', authMiddleware, async (req, res) => {
  try {
    const gallery = await Gallery.findOne({ userId: req.user._id });
    
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    gallery.isPublic = !gallery.isPublic;
    
    // If making private, remove share token
    if (!gallery.isPublic) {
      gallery.shareToken = undefined;
      gallery.sharedAt = undefined;
    }
    
    await gallery.save();
    
    res.json({
      isPublic: gallery.isPublic,
      shareToken: gallery.shareToken
    });
  } catch (error) {
    console.error('Error toggling gallery visibility:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
