import { Resource } from '@app/types';
import {
  Box,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ConfigureContractForm } from './ConfigureContractForm';

enum ToggleType {
  SmartContract = 'smartContract',
  Blockchain = 'blockchain',
}

type ConfigureResourceFormProps = {
  formId: string;
  onSubmit: (resource: Pick<Resource, 'type' | 'name' | 'metadata'>) => void;
};

export const ConfigureResourceForm = ({
  formId,
  onSubmit,
}: ConfigureResourceFormProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ marginBottom: 2 }}>
        <InputLabel shrink>Resource type</InputLabel>
        <ToggleButtonGroup
          color="primary"
          exclusive
          fullWidth
          size="small"
          value={ToggleType.SmartContract}
        >
          <ToggleButton value={ToggleType.SmartContract}>
            Smart contract
          </ToggleButton>
          <ToggleButton value={ToggleType.Blockchain} disabled>
            Blockchain API (Coming Soon)
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ConfigureContractForm formId={formId} onSubmit={onSubmit} />
    </Box>
  );
};
