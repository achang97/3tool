import { SerializedError } from '@reduxjs/toolkit';

export type ApiResponse<DataType = {}> =
  | {
      data: DataType;
    }
  | {
      error: ApiError | SerializedError;
    };

export type ApiError = {
  status: number;
  data: {
    message: string;
  } | null;
};
