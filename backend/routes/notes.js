const express = require('express');
const Note = require('../models/Note');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.use(authenticateToken);

router.get('/:projectId', async (req, res) => {
  try {
    const notes = await Note.find({ projectId: req.params.projectId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, projectId } = req.body;
    const note = new Note({
      title,
      content,
      projectId,
      createdBy: req.user.id
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);
    
    if (!note) return res.status(404).json({ error: 'Note not found' });
    
    note.title = title || note.title;
    note.content = content || note.content;
    note.updatedAt = new Date();
    
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;