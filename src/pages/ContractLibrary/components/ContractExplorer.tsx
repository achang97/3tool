import React, { memo, useCallback, useMemo, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useAppSelector } from 'redux/hooks';
import { useContract, useProvider, useSigner } from 'wagmi';
import { ContractConfig } from 'types';
import { CHAINS_BY_ID } from 'utils/constants';
import { Contract } from './Contract';

export const ContractExplorer = memo(() => {
  const { configs } = useAppSelector((state) => state.contracts);

  const [selectedConfig, setSelectedConfig] = useState<ContractConfig>(
    configs?.[0]
  );

  const { data: signer } = useSigner({ chainId: selectedConfig?.chainId });
  const provider = useProvider({ chainId: selectedConfig?.chainId });

  const signerOrProvider = useMemo(
    () => signer || provider,
    [signer, provider]
  );

  const contract = useContract({
    ...selectedConfig,
    signerOrProvider,
  });

  const handleSelectContract = useCallback(
    (e: React.SyntheticEvent, config: ContractConfig) => {
      setSelectedConfig(config);
    },
    []
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ borderRight: 1, borderColor: 'divider', flex: 1 }}>
        {configs.length === 0 && 'No contracts'}
        <Tabs
          value={selectedConfig}
          onChange={handleSelectContract}
          orientation="vertical"
        >
          {configs.map((config) => (
            <Tab key={config.address} label={config.address} value={config} />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ flex: 3 }}>
        {contract ? (
          <Contract
            contract={contract}
            blockExplorerUrl={
              CHAINS_BY_ID[selectedConfig.chainId].blockExplorers?.etherscan
                ?.url
            }
          />
        ) : (
          'No contract selected'
        )}
      </Box>
    </Box>
  );
});
