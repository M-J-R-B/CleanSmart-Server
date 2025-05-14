const express = require('express');
const router = express.Router();
const taskGroupController = require('../controllers/taskGroupController');
const validation = require('../middleware/validation');

// DELETE /api/tasks/:taskGroupId/:taskIndex - Delete a task
router.delete('/:taskGroupId/:taskIndex', validation.validateTaskDeletion, taskGroupController.deleteTask);

module.exports = router; 