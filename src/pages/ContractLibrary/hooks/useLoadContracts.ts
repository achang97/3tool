import { ethers } from 'ethers';
import { useEffect } from 'react';
import { updateContracts } from 'redux/features/contractsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { loadContractEtherscan, loadContractRaw } from 'utils/contracts';

export const useLoadContracts = () => {
  const { configs } = useAppSelector((state) => state.contracts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadContracts = async () => {
      const loadedContracts = await Promise.all(
        configs.map(({ address, abi, network }) => {
          if (abi) {
            return loadContractRaw(
              address,
              abi,
              network,
              ethers.getDefaultProvider(network)
            );
          }

          return loadContractEtherscan(
            address,
            network,
            ethers.getDefaultProvider(network)
          );
        })
      );

      dispatch(updateContracts(loadedContracts));
    };

    loadContracts();
  }, [configs, dispatch]);
};
