import { useCreateToolMutation } from '@app/redux/services/tools';
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
  useState,
} from 'react';

type CreateToolDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const CreateToolDialog = ({ onClose, open }: CreateToolDialogProps) => {
  const [name, setName] = useState('');

  const [createTool, { data: newTool, isLoading }] = useCreateToolMutation();
  const { push } = useRouter();

  useEffect(() => {
    if (newTool) {
      push(`/editor/${newTool.id}`);
    }
  }, [newTool, push]);

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

  return (
    <Dialog onClose={onClose} open={open} fullWidth>
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
              inputProps={{
                'data-testid': 'create-tool-dialog-input',
              }}
            />
            <LoadingButton
              type="submit"
              loading={isLoading}
              sx={{ marginTop: 1 }}
              disabled={!name}
            >
              Create tool
            </LoadingButton>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};
