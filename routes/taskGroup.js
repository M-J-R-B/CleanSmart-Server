const express = require('express');
const router = express.Router();
const taskGroupController = require('../controllers/taskGroupController');
const validation = require('../middleware/validation');

// GET /api/taskGroups/:userId - Get all task groups for a specific user
router.get('/:userId', taskGroupController.getTaskGroupsByUserId);

// POST /api/taskGroups - Create a new task group
router.post('/', validation.validateTaskGroup, taskGroupController.createTaskGroup);

// PUT /api/taskGroups/:taskGroupId - Update task group progress
router.put('/:taskGroupId', validation.validateProgressUpdate, taskGroupController.updateTaskGroupProgress);

// DELETE /api/taskGroups/:taskGroupId - Delete a task group
router.delete('/:taskGroupId', validation.validateTaskGroupId, taskGroupController.deleteTaskGroup);

// DELETE /api/taskGroups/:taskGroupId/tasks/:taskIndex - Delete a task from a task group
router.delete('/:taskGroupId/tasks/:taskIndex', validation.validateTaskDeletion, taskGroupController.deleteTask);

module.exports = router; 