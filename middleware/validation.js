// Middleware for validating task group requests

/**
 * Validates TaskGroup creation request
 */
exports.validateTaskGroup = (req, res, next) => {
  const { taskGroup } = req.body;

  if (!taskGroup) {
    return res.status(400).json({
      success: false,
      message: 'Task group data is required'
    });
  }

  if (!taskGroup.userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID is required'
    });
  }

  if (!taskGroup.areaName) {
    return res.status(400).json({
      success: false,
      message: 'Area name is required'
    });
  }

  if (taskGroup.tasks && !Array.isArray(taskGroup.tasks)) {
    return res.status(400).json({
      success: false,
      message: 'Tasks must be an array'
    });
  }

  if (taskGroup.progress !== undefined && (isNaN(taskGroup.progress) || taskGroup.progress < 0 || taskGroup.progress > 100)) {
    return res.status(400).json({
      success: false,
      message: 'Progress must be a number between 0 and 100'
    });
  }

  // If client is providing an 'id' (not '_id'), let it pass through
  // The controller will handle transforming 'id' to '_id'
  
  next();
};

/**
 * Validates progress update request
 */
exports.validateProgressUpdate = (req, res, next) => {
  const { progress } = req.body;

  if (progress === undefined || progress === null) {
    return res.status(400).json({
      success: false,
      message: 'Progress value is required'
    });
  }

  if (isNaN(progress) || progress < 0 || progress > 100) {
    return res.status(400).json({
      success: false,
      message: 'Progress must be a number between 0 and 100'
    });
  }

  next();
};

/**
 * Validates task group ID format for delete operation
 */
exports.validateTaskGroupId = (req, res, next) => {
  const { taskGroupId } = req.params;

  if (!taskGroupId) {
    return res.status(400).json({
      success: false,
      message: 'Task group ID is required'
    });
  }

  // No specific format validation needed as we're using string IDs
  // We're simply checking that the ID exists in the params
  
  next();
};

/**
 * Validates task deletion parameters
 */
exports.validateTaskDeletion = (req, res, next) => {
  const { taskGroupId, taskIndex } = req.params;

  if (!taskGroupId) {
    return res.status(400).json({
      success: false,
      message: 'Task group ID is required'
    });
  }

  if (taskIndex === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Task index is required'
    });
  }

  // Validate that the task index is a number
  if (isNaN(parseInt(taskIndex))) {
    return res.status(400).json({
      success: false,
      message: 'Task index must be a number'
    });
  }

  next();
}; 