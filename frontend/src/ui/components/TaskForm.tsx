import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

type Props = {
  onSubmit: (form: TaskFormValues) => void;
  defaultValues?: Partial<TaskFormValues>;
  loading?: boolean;
  isEditMode?: boolean;
};

export type TaskFormValues = {
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  estimatedHours: number;
  deadline: string; // ISO string
  //   status: "Pending" | "In Progress" | "Completed";
};

const priorities = ["Low", "Medium", "High"] as const;
// const statuses = ["Pending", "In Progress", "Completed"] as const;

// Explicitly make fields required in yup schema to match TaskFormValues
const schema: yup.ObjectSchema<TaskFormValues> = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 10 characters")
    .max(50, "Title must be at most 50 characters"),
  description: yup.string().max(1000, "Max 1000 characters").optional(),
  priority: yup
    .mixed<TaskFormValues["priority"]>()
    .oneOf(priorities)
    .required("Priority is required"),
  estimatedHours: yup
    .number()
    .required("Estimated hours are required")
    .min(1, "Must be at least 1")
    .test(
      "positive",
      "Estimated hours cannot be negative",
      (value) => value >= 0
    ),
  deadline: yup
    .string()
    .required("Deadline is required")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Deadline must be in ISO date format (YYYY-MM-DD)"
    )
    .test("is-future-date", "Deadline cannot be in the past", (value) => {
      if (!value) return false;
      return new Date(value) >= new Date(); // Ensure the deadline is not in the past
    }),
  //   status: yup
  //     .mixed<TaskFormValues["status"]>()
  //     .oneOf(statuses)
  //     .required("Status is required"),
});

const TaskForm = ({
  onSubmit,
  defaultValues = {},
  loading,
  isEditMode,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      estimatedHours: 1,
      deadline: "",
      //   status: "Pending",
      ...defaultValues,
    },
  });
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isEditMode) {
      const parsed = {
        ...defaultValues,
        deadline: defaultValues.deadline?.split("T")[0],
      };
      reset(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              error={!!errors.title}
              helperText={errors.title?.message}
              required
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        {/* Estimated Hours */}
        <Controller
          name="estimatedHours"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Estimated Hours"
              type="number"
              error={!!errors.estimatedHours}
              helperText={errors.estimatedHours?.message}
              InputProps={{ inputProps: { min: 1 } }}
              required
            />
          )}
        />

        {/* Deadline */}
        <Controller
          name="deadline"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Deadline"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.deadline}
              helperText={errors.deadline?.message}
              InputProps={{ inputProps: { min: today } }}
              required
            />
          )}
        />

        {/* Priority */}
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Priority"
              select
              error={!!errors.priority}
              helperText={errors.priority?.message}
              required
            >
              {priorities.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        {/* Status */}
        {/* <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Status"
              select
              error={!!errors.status}
              helperText={errors.status?.message}
              required
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          )}
        /> */}

        {/* Submit Button */}
        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Submit"}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default TaskForm;
