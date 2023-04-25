export type ActionResult = {
  data: unknown;
  error?: string;
  runtime?: number;
};

export const ACTION_RESULT_TEMPLATE: ActionResult = {
  data: undefined,
  error: undefined,
};
