import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import {
  Box,
  Button,
  Typography,
  Tooltip,
  Paper,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/WarningAmber";
import { getAllMembers } from "@/services/MemberService"; 
import { IMember } from "@/models/types/Member";
import { ITask } from "@/models/types/Task";

dayjs.extend(weekday);

const priorityColorMap: Record<string, string> = {
  High: "#d32f2f",
  Medium: "#fbc02d",
  Low: "#388e3c",
};

interface TaskSpan extends ITask {
    span: string[];
    spanStart: string;
    spanEnd: string;
    rowIndex: number;
    memberId: string;
  }

export const TimelineView: React.FC = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [members, setMembers] = useState<IMember[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getAllMembers();
        setMembers(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };

    fetchMembers();
  }, []);

  const getWorkWeek = (offset: number) => {
    // Start from the Monday of the current week, adjusted by offset
    const today = dayjs();
    const monday = today.startOf("week").add(1, "day").add(offset * 7, "day"); // startOf("week") is Sunday
    return Array.from({ length: 5 }).map((_, i) => {
      const d = monday.add(i, "day");
      return {
        key: d.format("YYYY-MM-DD"),
        label: d.format("ddd, DD MMM"),
      };
    });
  };
  
  const calculateTaskSpans = () => {
    const taskSpans: TaskSpan[] = [];
  
    const currentWeekKeys = getWorkWeek(weekOffset).map((w) => w.key);
  
    members.forEach((member) => {
      const availability = member.availableHours ?? 8;
  
      const rows: { start: string; end: string }[] = [];
  
      member.assignedTasks.forEach((task: ITask) => {
        const totalDays = Math.ceil(task.estimatedHours / availability);
        const fullSpan: string[] = [];
  
        let date = task.startDate ? dayjs(task.startDate) : dayjs(task.deadline);
  
        while (fullSpan.length < totalDays) {
          if (date.day() >= 1 && date.day() <= 5) {
            fullSpan.push(date.format("YYYY-MM-DD"));
          }
          date = date.add(1, "day");
        }
  
        const visibleSpan = fullSpan.filter((d) => currentWeekKeys.includes(d));
        if (visibleSpan.length === 0) return; // Don't render tasks outside this week
  
        let rowIndex = 0;
        while (true) {
          const overlap =
            rows[rowIndex] &&
            !(
              dayjs(visibleSpan[visibleSpan.length - 1]).isBefore(rows[rowIndex].start) ||
              dayjs(visibleSpan[0]).isAfter(rows[rowIndex].end)
            );
          if (!overlap) break;
          rowIndex++;
        }
  
        rows[rowIndex] = {
          start: visibleSpan[0],
          end: visibleSpan[visibleSpan.length - 1],
        };
  
        taskSpans.push({
          ...task,
          span: visibleSpan,
          spanStart: visibleSpan[0],
          spanEnd: visibleSpan[visibleSpan.length - 1],
          rowIndex,
          memberId: member._id,
        });
      });
    });
  
    return taskSpans;
  };
  

  const workWeek = getWorkWeek(weekOffset);
  const scheduledTasks = calculateTaskSpans();

  const taskMap: Record<string, Record<string, typeof scheduledTasks[0][]>> = {};
  scheduledTasks.forEach((task) => {
    if (!taskMap[task.memberId]) taskMap[task.memberId] = {};
    task.span.forEach((date) => {
      if (!taskMap[task.memberId][date]) taskMap[task.memberId][date] = [];
      taskMap[task.memberId][date].push(task);
    });
  });

  return (
    <div className="container px-4 mx-auto">
      <Box className="mb-6 flex justify-between items-center">
        <Button variant="outlined" onClick={() => setWeekOffset(weekOffset - 1)}>
          ← Prev
        </Button>
        <Typography variant="h6">
          Week of {dayjs().weekday(1).add(weekOffset * 7, "day").format("DD MMM YYYY")}
        </Typography>
        <Button variant="outlined" onClick={() => setWeekOffset(weekOffset + 1)}>
          Next →
        </Button>
      </Box>

      <Paper elevation={1} className="overflow-x-auto rounded-md border-gray-200">
        {/* Header */}
        <Box className="flex bg-gray-50 text-gray-600 font-medium text-sm">
          <Box className="min-w-[200px] px-4 py-3">Team Member</Box>
          {workWeek.map((day) => (
            <Box key={day.key} className="min-w-[120px] px-4 py-3 text-center">
              {day.label}
            </Box>
          ))}
        </Box>

        {/* Member Rows */}
        <div  className="max-h-[70vh] overflow-y-auto">
        {members.map((member) => (
          <Box key={member._id} className="flex items-stretch hover:bg-gray-50 transition">
            <Box className="min-w-[200px] p-4 bg-white" sx={{
              backgroundColor: member.isOverloaded ? "#ffe5e5" : "transparent",
            }}>
              <Typography variant="subtitle2" className="font-semibold flex items-center gap-1">
                {member.memberName}
                {member.isOverloaded && (
                  <Tooltip title="Overloaded">
                    <WarningIcon color="warning" />
                  </Tooltip>
                )}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {member.availableHours ?? 8}h/day
              </Typography>
            </Box>

            {workWeek.map((day) => {
              const dayTasks = taskMap[member._id]?.[day.key] ?? [];
              return (
                <Box key={day.key} className="min-w-[120px] p-2 relative h-[60px]">
                  {dayTasks.map((task) =>
                    task.span[0] === day.key ? (
                      <Tooltip
                        key={task._id}
                        title={
                          <Box>
                            <Typography fontWeight="bold" fontSize={10}>{task.title}</Typography>
                            <Typography variant="caption">
                              {task.estimatedHours} hrs — {task.priority}
                            </Typography>
                          </Box>
                        }
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: 4 + (task.rowIndex ?? 0) * 40,
                            left: 4,
                            height: 36,
                            minWidth: `${task.span.length * 120 - 8}px`,
                            backgroundColor: priorityColorMap[task.priority] || "#999",
                            color: "white",
                            borderRadius: "4px",
                            padding: "2px 8px",
                            fontSize: "11px",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                          }}
                        >
                          <Typography variant="caption" sx={{ fontSize: "10px", opacity: 0.85 }}>
                            {task.priority}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: "12px", fontWeight: 500 }}>
                            {task.title}
                          </Typography>
                        </Box>
                      </Tooltip>
                    ) : null
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
        </div>
      </Paper>
    </div>
  );
};
