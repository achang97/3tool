import { useCreateToolMutation } from '@app/redux/services/tools';
import { parseApiError } from '@app/utils/api';
import { LoadingButton } from '@mui/lab';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from 'react';

type CreateToolDialogProps = {
  onClose: () => void;
  isOpen: boolean;
};

const FORM_ID = 'create-tool-form';

export const CreateToolDialog = ({ onClose, isOpen }: CreateToolDialogProps) => {
  const [name, setName] = useState('');

  const [createTool, { isLoading, error }] = useCreateToolMutation();
  const { push } = useRouter();

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleCreateTool = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const newTool = await createTool({ name }).unwrap();

        onClose();
        setName('');
        push(`/editor/${newTool._id}`);
      } catch {
        // Do nothing
      }
    },
    [createTool, name, onClose, push]
  );

  const errorMessage = useMemo(() => {
    return error && parseApiError(error);
  }, [error]);

  return (
    <Dialog onClose={onClose} open={isOpen} fullWidth data-testid="create-tool-dialog">
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
            error={!!errorMessage}
            helperText={errorMessage}
            inputProps={{
              'data-testid': 'create-tool-dialog-input',
            }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton type="submit" form={FORM_ID} loading={isLoading} disabled={!name} fullWidth>
          Create tool
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
