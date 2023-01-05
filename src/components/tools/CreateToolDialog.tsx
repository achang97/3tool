import { useCreateToolMutation } from '@app/redux/services/tools';
import { parseApiError } from '@app/utils/api';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type CreateToolDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const CreateToolDialog = ({ onClose, open }: CreateToolDialogProps) => {
  const [name, setName] = useState('');

  const [createTool, { data: newTool, isLoading, error }] =
    useCreateToolMutation();
  const { push } = useRouter();

  useEffect(() => {
    if (newTool) {
      onClose();
      setName('');
      push(`/editor/${newTool.id}`);
    }
  }, [newTool, onClose, push]);

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleCreateTool = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      createTool({ name });
    },
    [createTool, name]
  );

  const errorMessage = useMemo(() => {
    return error && parseApiError(error);
  }, [error]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      data-testid="create-tool-dialog"
    >
      <DialogTitle>Create new tool</DialogTitle>
      <DialogContent>
        <form onSubmit={handleCreateTool}>
          <Box sx={{ display: 'flex', flexDirection: 'column', paddingY: 1 }}>
            <TextField
              variant="outlined"
              label="Tool name"
              value={name}
              onChange={handleNameChange}
              required
              error={!!errorMessage}
              helperText={errorMessage}
              inputProps={{
                'data-testid': 'create-tool-dialog-input',
              }}
            />
            <LoadingButton
              type="submit"
              loading={isLoading}
              sx={{ marginTop: 1 }}
              disabled={!name || isLoading}
            >
              Create tool
            </LoadingButton>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
