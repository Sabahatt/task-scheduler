import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Typography,
  Alert,
} from "@mui/material";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { getAllMembers, getSuggestedMembers } from "@/services/MemberService";
import { assignTask } from "@/services/TaskService";
import { ISuggestions } from "@/models/types/Suggestions";
import { IMember } from "@/models/types/Member";
import { toast } from "react-toastify";

interface AssignModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  taskId: string;
  onClose: () => void;
}

const AssignModal: FC<AssignModalProps> = ({
  open,
  taskId,
  onClose,
  setOpen,
}) => {
  const [allMembers, setAllMembers] = useState<IMember[]>([]);
  const [suggestedMembers, setSuggestedMembers] = useState<ISuggestions[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningData, setWarningData] = useState(null);

  useEffect(() => {
    if (open) {
      fetchData();
      resetState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const resetState = () => {
    setShowWarning(false);
    setWarningData(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allRes, suggestedRes] = await Promise.all([
        getAllMembers(),
        getSuggestedMembers(taskId),
      ]);
      setAllMembers(allRes.data.data);
      setSuggestedMembers(suggestedRes.data.data);
    } catch (err) {
      console.error("Error loading members", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (memberId: string, force = false) => {
    setAssigning(true);
    try {
      const res = await assignTask(taskId, memberId, force);
      const { success, warning, message } = res.data;

      if (!success && warning) {
        setWarningData(res.data.data);
        setShowWarning(true);
        return;
      }

      toast.success(message);
      setOpen(false);
    } catch (err) {
      console.error("Assignment failed", err);
      alert("Failed to assign task.");
    } finally {
      setAssigning(false);
    }
  };

  const handleForceAssign = () => {
    if (warningData) {
      handleAssign(warningData.member._id, true);
      setShowWarning(false);
    }
  };

  const renderMemberCard = (
    member: IMember,
    extra?: ISuggestions,
    isSuggested = false,
    highlight = false
  ) => {
    const capacityUsed = extra
      ? Math.floor(
          (extra.currentLoad / (extra.currentLoad + extra.remainingCapacity)) *
            100
        )
      : null;

    return (
      <Paper
        key={member._id}
        className={`p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer ${
          highlight ? "border-blue-500 border" : ""
        }`}
        onClick={() => handleAssign(member._id)}
      >
        <Box className="flex justify-between items-center mb-1">
          <Typography variant="subtitle1">{member.memberName}</Typography>
          {highlight && (
            <Chip label="Best Match" color="primary" size="small" />
          )}
          {member.isOverloaded && (
            <Chip
              label="Overloaded"
              color="error"
              size="small"
              className="mt-1"
            />
          )}
        </Box>
        <Typography variant="body2" color="textSecondary">
          Available Hours/Day: {member.availableHours}
        </Typography>

        {!isSuggested && member.taskCount !== undefined && (
          <Typography variant="body2" color="textSecondary">
            Assigned Tasks: {member.taskCount}
          </Typography>
        )}

        {extra && (
          <>
            <Typography variant="body2">
              Current Load: {extra.currentLoad} hrs
            </Typography>
            <Typography variant="body2" className="mb-1">
              Remaining Capacity: {extra.remainingCapacity} hrs
            </Typography>
            <LinearProgress
              variant="determinate"
              value={capacityUsed ?? 0}
              sx={{ height: 6, borderRadius: 4 }}
            />
          </>
        )}
      </Paper>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Assign Task to Member</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box className="flex justify-center items-center py-12">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suggested Members */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Suggested Members
              </Typography>
              {suggestedMembers.length ? (
                suggestedMembers.map((sug, idx) =>
                  renderMemberCard(sug.member, sug, true, idx === 0)
                )
              ) : (
                <Alert severity="info">
                  No suitable members found who can take this task within the
                  deadline.
                </Alert>
              )}
            </Box>

            {/* All Members */}
            <Box>
              <Typography variant="h6" gutterBottom>
                All Members
              </Typography>
              {allMembers.map((member) => renderMemberCard(member))}
            </Box>
          </Box>
        )}

        {/* Success Message */}
        {/* {assignSuccess && (
          <Alert severity="success" className="mt-4">
            {assignSuccess}
          </Alert>
        )} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={assigning}>
          Close
        </Button>
      </DialogActions>

      {/* Overload Warning Dialog */}
      <Dialog open={showWarning} onClose={() => setShowWarning(false)}>
        <DialogTitle>⚠ Overload Warning</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Assigning this task will overload{" "}
            <strong>{warningData?.member?.memberName}</strong>.
          </Typography>
          <Box className="mt-2">
            <Typography variant="body2">
              <strong>Available Hours/Day:</strong>{" "}
              {warningData?.availableHours}
            </Typography>
            <Typography variant="body2">
              <strong>Currently Assigned:</strong>{" "}
              {warningData?.totalHoursAssigned} hrs
            </Typography>
            <Typography variant="body2">
              <strong>This Task Requires:</strong>{" "}
              {warningData?.task?.estimatedHours} hrs
            </Typography>
          </Box>
          <Typography variant="body2" color="error" className="mt-2">
            This assignment would exceed the member’s capacity.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWarning(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleForceAssign}
            disabled={assigning}
          >
            Assign Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AssignModal;
