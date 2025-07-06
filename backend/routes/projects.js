const express = require('express');
const Project = require('../models/Project');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = new Project({
      title,
      description,
      owner: req.user.id,
      members: [req.user.id]
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    if (project.owner !== req.user.id && !project.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.owner !== req.user.id) return res.status(403).json({ error: 'Access denied' });
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.updatedAt = new Date();
    
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;