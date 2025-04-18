import {
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

type Props = {
  onSubmit: (form: MemberFormValues) => void;
  defaultValues?: Partial<MemberFormValues>;
  loading?: boolean;
  isEditMode?: boolean;
};

export type MemberFormValues = {
  memberName: string;
  availableHours?: number;
};

// Explicitly make fields required in yup schema to match TaskFormValues
const schema: yup.ObjectSchema<MemberFormValues> = yup.object({
  memberName: yup
    .string()
    .required("Member Name is required")
    .min(5, "Name must be at least 10 characters")
    .max(50, "Title must be at most 50 characters"),
  availableHours: yup
    .number()
    .required("Estimated hours are required")
    .min(1, "Must be at least 1")
    .test(
      "positive",
      "Estimated hours cannot be negative",
      (value) => value >= 0
    ),
});

const MemberForm = ({
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
  } = useForm<MemberFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      memberName: "",
      availableHours: 1,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const parsed = {
        ...defaultValues,
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
          name="memberName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Member Name"
              error={!!errors.memberName}
              helperText={errors.memberName?.message}
              required
            />
          )}
        />

        {/* Available Hours */}
        <Controller
          name="availableHours"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Available Hours"
              type="number"
              error={!!errors.availableHours}
              helperText={errors.availableHours?.message}
              InputProps={{ inputProps: { min: 1 } }}
              required
            />
          )}
        />

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

export default MemberForm;
