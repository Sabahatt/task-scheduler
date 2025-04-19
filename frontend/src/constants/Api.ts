import Env from "@/envs/env";

export default {
  BASE_URL: Env.BASE_URL,
  API_URL: `${Env.BASE_URL}api/v1/`,

  TASKS: "tasks",
  MEMBERS: "members",
  ASSIGNMENT: "assignment",
  UNASSIGN: "unassign",
  SUGGESTIONS: "suggestions",
  DASHBOARD: "summary",
};
