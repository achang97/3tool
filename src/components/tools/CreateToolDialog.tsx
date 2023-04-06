import { useCreateToolMutation } from '@app/redux/services/tools';
import { isSuccessfulApiResponse, parseApiError } from '@app/utils/api';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';

type CreateToolDialogProps = {
  onClose: () => void;
  isOpen: boolean;
};

const FORM_ID = 'create-tool-form';

export const CreateToolDialog = ({
  onClose,
  isOpen,
}: CreateToolDialogProps) => {
  const [name, setName] = useState('');

  const [createTool, { isLoading, error }] = useCreateToolMutation();
  const { push } = useRouter();

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleCreateTool = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const response = await createTool({ name });

      if (!isSuccessfulApiResponse(response)) {
        return;
      }

      onClose();
      setName('');
      push(`/editor/${response.data._id}`);
    },
    [createTool, name, onClose, push]
  );

  const errorMessage = useMemo(() => {
    return error && parseApiError(error);
  }, [error]);

  return (
    <Dialog
      onClose={onClose}
      open={isOpen}
      fullWidth
      data-testid="create-tool-dialog"
    >
      <DialogTitle>Create new tool</DialogTitle>
      <DialogContent>
        <form id={FORM_ID} onSubmit={handleCreateTool}>
          <TextField
            variant="outlined"
            placeholder="Enter tool name"
            label="Tool name"
            value={name}
            onChange={handleNameChange}
            fullWidth
            required
            error={!!errorMessage}
            helperText={errorMessage}
            inputProps={{
              'data-testid': 'create-tool-dialog-input',
            }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          type="submit"
          form={FORM_ID}
          loading={isLoading}
          fullWidth
          disabled={!name || isLoading}
        >
          Create tool
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
