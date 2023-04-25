export type ActionResult = {
  data: unknown;
  error?: string;
  runtime?: number;
  isLoading?: boolean;
};

export const ACTION_RESULT_TEMPLATE: ActionResult = {
  data: undefined,
  error: undefined,
  runtime: 0,
  isLoading: false,
};
