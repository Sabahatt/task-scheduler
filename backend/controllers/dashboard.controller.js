import Task from '../models/task.model.js';

export const getDashboardSummary = async (req, res) => {
    const today = new Date();
    const startOfToday = new Date(today.toDateString());
    const twoDaysLater = new Date(startOfToday);
    twoDaysLater.setDate(startOfToday.getDate() + 2);
  
    const allTasks = await Task.find();
  
    const summary = {
      totalTasks: allTasks.length,
      completed: [],
      inProgress: [],
      pending: [],
      overdue: [],
      dueSoon: []
    };
  
    allTasks.forEach(task => {
      const deadline = new Date(task.deadline);
      const isComplete = task.status === 'Completed';
      const isInProgress = task.status === 'In Progress';
      const isPending = task.status === 'Pending';
      const isOverdue = !isComplete && deadline < startOfToday;
      const isDueSoon = !isComplete && deadline >= startOfToday && deadline <= twoDaysLater;
  
      if (isComplete) summary.completed.push(task);
      if (isInProgress) summary.inProgress.push(task);
      if (isPending) summary.pending.push(task);
      if (isOverdue) summary.overdue.push(task);
      if (isDueSoon) summary.dueSoon.push(task);
    });
  
    res.status(200).json({
      success: true,
      data: {
        totalTasks: summary.totalTasks,
        completedCount: summary.completed.length,
        inProgressCount: summary.inProgress.length,
        pendingCount: summary.pending.length,
        overdueCount: summary.overdue.length,
        dueSoonCount: summary.dueSoon.length,
        completedTasks: summary.completed,
        inProgressTasks: summary.inProgress,
        pendingTasks: summary.pending,
        overdueTasks: summary.overdue,
        dueSoonTasks: summary.dueSoon
      }
    });
  };
  