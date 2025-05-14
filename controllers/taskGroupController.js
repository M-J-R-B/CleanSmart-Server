const TaskGroup = require('../models/TaskGroup');
const mongoose = require('mongoose');

// Get all task groups for a specific user
exports.getTaskGroupsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching task groups for user: ${userId}`);
    
    const taskGroups = await TaskGroup.find({ userId });
    console.log(`Found ${taskGroups.length} task groups`);
    
    // Transform _id to id for consistent client response
    const responseTaskGroups = taskGroups.map(taskGroup => {
      const taskGroupObj = taskGroup.toObject();
      taskGroupObj.id = taskGroupObj._id;
      delete taskGroupObj._id;
      return taskGroupObj;
    });
    
    return res.status(200).json({
      success: true,
      taskGroups: responseTaskGroups
    });
  } catch (error) {
    console.error('Error fetching task groups:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch task groups',
      error: error.message
    });
  }
};

// Create a new task group
exports.createTaskGroup = async (req, res) => {
  try {
    const { taskGroup } = req.body;
    console.log('Creating new task group:', taskGroup);
    
    // Validation is now handled by middleware
    
    // If the client provides an ID, use it for consistency
    let newTaskGroup;
    
    if (taskGroup.id) {
      // Use the client-provided ID
      newTaskGroup = new TaskGroup({
        ...taskGroup,
        _id: taskGroup.id // Set the _id to the id from client
      });
      // Remove duplicate id field
      delete newTaskGroup._doc.id;
    } else {
      // Let MongoDB generate an ID
      newTaskGroup = new TaskGroup(taskGroup);
    }
    
    await newTaskGroup.save();
    
    console.log('Task group created successfully with ID:', newTaskGroup._id);
    
    // Return the saved document with id field for consistency with client
    const responseTaskGroup = newTaskGroup.toObject();
    responseTaskGroup.id = responseTaskGroup._id;
    delete responseTaskGroup._id;
    
    return res.status(201).json({
      success: true,
      taskGroup: responseTaskGroup
    });
  } catch (error) {
    console.error('Error creating task group:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create task group',
      error: error.message
    });
  }
};

// Update task group progress
exports.updateTaskGroupProgress = async (req, res) => {
  try {
    const { taskGroupId } = req.params;
    const { progress } = req.body;
    
    // Validation is now handled by middleware
    
    console.log(`Updating progress for task group ${taskGroupId} to ${progress}`);
    
    const taskGroup = await TaskGroup.findById(taskGroupId);
    
    if (!taskGroup) {
      return res.status(404).json({
        success: false,
        message: `Task group with ID ${taskGroupId} not found`
      });
    }
    
    taskGroup.progress = progress;
    await taskGroup.save();
    
    console.log('Task group progress updated successfully');
    
    // Return the updated document with id field for consistency with client
    const responseTaskGroup = taskGroup.toObject();
    responseTaskGroup.id = responseTaskGroup._id;
    delete responseTaskGroup._id;
    
    return res.status(200).json({
      success: true,
      taskGroup: responseTaskGroup
    });
  } catch (error) {
    console.error('Error updating task group progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task group progress',
      error: error.message
    });
  }
};

// Delete a task group
exports.deleteTaskGroup = async (req, res) => {
  try {
    const { taskGroupId } = req.params;
    console.log(`Deleting task group with ID: ${taskGroupId}`);
    
    const taskGroup = await TaskGroup.findById(taskGroupId);
    
    if (!taskGroup) {
      console.log(`Task group with ID ${taskGroupId} not found`);
      return res.status(404).json({
        success: false,
        message: `Task group with ID ${taskGroupId} not found`
      });
    }
    
    // Delete the task group
    await TaskGroup.deleteOne({ _id: taskGroupId });
    
    console.log(`Task group with ID ${taskGroupId} deleted successfully`);
    
    return res.status(200).json({
      success: true,
      message: 'Task group deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task group:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task group',
      error: error.message
    });
  }
};

// Delete a task from a task group
exports.deleteTask = async (req, res) => {
  try {
    const { taskGroupId, taskIndex } = req.params;
    const index = parseInt(taskIndex);
    
    console.log(`Deleting task at index ${index} from task group ${taskGroupId}`);
    
    const taskGroup = await TaskGroup.findById(taskGroupId);
    
    if (!taskGroup) {
      console.log(`Task group with ID ${taskGroupId} not found`);
      return res.status(404).json({
        success: false,
        message: `Task group with ID ${taskGroupId} not found`
      });
    }
    
    // Check if the task index is valid
    if (!taskGroup.tasks || index < 0 || index >= taskGroup.tasks.length) {
      console.log(`Invalid task index: ${index}`);
      return res.status(400).json({
        success: false,
        message: `Invalid task index: ${index}`
      });
    }
    
    // Remove the task from the array
    taskGroup.tasks.splice(index, 1);
    
    // Save the updated task group
    await taskGroup.save();
    
    console.log(`Task at index ${index} deleted successfully from task group ${taskGroupId}`);
    
    // Return the updated document with id field for consistency with client
    const responseTaskGroup = taskGroup.toObject();
    responseTaskGroup.id = responseTaskGroup._id;
    delete responseTaskGroup._id;
    
    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      taskGroup: responseTaskGroup
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
}; 