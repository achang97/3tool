import { Action, SmartContractBaseData, SmartContractBaseDataFunction } from '@app/types';
import { filterAbiFunctions, getAbiFieldType } from '@app/utils/abi';
import {
  SendTransactionResult,
  prepareWriteContract,
  readContract,
  readContracts,
  writeContract,
  fetchSigner,
  PrepareWriteContractConfig,
} from '@wagmi/core';
import { Abi, AbiType } from 'abitype';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useSigner } from 'wagmi';
import { useEnqueueSnackbar } from '@app/hooks/useEnqueueSnackbar';
import { getTransactionUrl } from '@app/utils/contracts';
import { useSwitchNetwork } from '@app/hooks/useSwitchNetwork';
import _ from 'lodash';
import { LoopResult, useActionLoop } from './useActionLoop';
import { useEvalDynamicValue } from './useEvalDynamicValue';
import { useActionSmartContract } from './useActionSmartContract';
import { ViewTransactionsButton } from '../common/ViewTransactionsButton';

type PreparedWriteContractConfig = PrepareWriteContractConfig<
  readonly unknown[] | Abi,
  string,
  number,
  ethers.Signer
>;
type WriteContractResult = SendTransactionResult & { blockExplorerUrl: string };

export const useActionSmartContractExecute = () => {
  const getSmartContractData = useActionSmartContract();
  const { data: signer } = useSigner();
  const loop = useActionLoop();
  const evalDynamicValue = useEvalDynamicValue();
  const enqueueSnackbar = useEnqueueSnackbar();
  const switchNetwork = useSwitchNetwork();

  const getWagmiConfig = useCallback(
    (
      type: 'read' | 'write',
      data: SmartContractBaseData,
      smartContractFunction: SmartContractBaseDataFunction,
      element: unknown
    ) => {
      const { chainId, address, abi } = getSmartContractData(data, {
        element,
      });
      const abiFunctions = filterAbiFunctions(abi, type);

      const selectedFunction = abiFunctions.find(
        (currFunction) => currFunction.name === smartContractFunction?.name
      );
      const functionArgs = selectedFunction?.inputs.map((input, i) =>
        evalDynamicValue(smartContractFunction.args[i], getAbiFieldType(input.type as AbiType), {
          element,
        })
      );

      return {
        // NOTE: This isn't very clean, as address can be undefined. However, in that case, the result
        // should just be a failed wagmi call.
        address: address as `0x${string}`,
        chainId,
        abi,
        functionName: smartContractFunction.name,
        args: functionArgs,
      };
    },
    [evalDynamicValue, getSmartContractData]
  );

  const prepareAndWriteContract = useCallback(
    async (config: PreparedWriteContractConfig): Promise<WriteContractResult> => {
      const preparedConfig = await prepareWriteContract(config);
      // @ts-ignore preparedConfig has unknown as AbiParameter type
      const writeResult = await writeContract(preparedConfig);
      return {
        ...writeResult,
        blockExplorerUrl: config.chainId ? getTransactionUrl(config.chainId, writeResult.hash) : '',
      };
    },
    []
  );

  const waitForWriteReceipt = useCallback(async (result: WriteContractResult) => {
    try {
      const txReceipt = await result.wait();
      return {
        ...txReceipt,
        blockExplorerUrl: result.blockExplorerUrl,
      };
    } catch (e) {
      // NOTE: Hacky "fix" to a MM issue: https://github.com/MetaMask/metamask-extension/issues/13375#issuecomment-1485926962.
      // We return a partial object that contains the hash and URL without waiting for MM to register block inclusion, as it
      // will be stuck in a Pending state until the extension is refreshed.
      if (e instanceof Error && 'reason' in e && e.reason === 'underlying network changed') {
        return {
          transactionHash: result.hash,
          blockExplorerUrl: result.blockExplorerUrl,
        };
      }
      throw e;
    }
  }, []);

  const readSmartContract = useCallback(
    async (data: Action['data']['smartContractRead']) => {
      if (!data) {
        return undefined;
      }

      return loop(data, async (element) => {
        const config = data.functions.map((smartContractFunction) => ({
          ...getWagmiConfig('read', data, smartContractFunction, element),
          signer,
        }));

        return data.functions.length === 1
          ? readContract(config[0])
          : readContracts({ contracts: config });
      });
    },
    [loop, getWagmiConfig, signer]
  );

  const writeSmartContract = useCallback(
    async (name: string, data: Action['data']['smartContractWrite']) => {
      if (!data) {
        return undefined;
      }

      if (!signer) {
        enqueueSnackbar(`${name} failed. Please connect your wallet and try again.`, {
          variant: 'error',
        });
        return undefined;
      }

      const writeFunction = data.functions[0];
      const writeConfigs = await loop<PreparedWriteContractConfig>(data, async (element) => {
        const config: Parameters<typeof prepareWriteContract>[0] = getWagmiConfig(
          'write',
          data,
          writeFunction,
          element
        );

        if (writeFunction.payableAmount) {
          const evalPayableAmount = evalDynamicValue(writeFunction.payableAmount, 'number', {
            element,
          });
          config.overrides = {
            value: ethers.utils.parseEther(evalPayableAmount?.toString() ?? ''),
          };
        }

        return config;
      });

      const isLoop = Array.isArray(writeConfigs);
      let writeResults: LoopResult<WriteContractResult> = [];
      let txUrls: string[];

      if (isLoop) {
        const groupedConfigs = Object.entries(_.groupBy(writeConfigs, 'data.chainId'));
        for (let i = 0; i < groupedConfigs.length; i++) {
          /* eslint-disable no-await-in-loop */
          const [chainId, configs] = groupedConfigs[i];
          await switchNetwork(parseInt(chainId, 10));
          const results = await Promise.all(
            configs.map(async (config) => ({
              element: config.element,
              data: await prepareAndWriteContract({
                ...config.data,
                signer: await fetchSigner({ chainId: config.data.chainId }),
              }),
            }))
          );
          writeResults.push(...results);
          /* eslint-enable no-await-in-loop */
        }
        txUrls = writeResults.map((writeResult) => writeResult.data.blockExplorerUrl);
      } else {
        if (writeConfigs.chainId) {
          await switchNetwork(writeConfigs.chainId);
        }
        writeConfigs.signer = await fetchSigner({ chainId: writeConfigs.chainId });
        writeResults = await prepareAndWriteContract(writeConfigs);
        txUrls = [writeResults.blockExplorerUrl];
      }

      enqueueSnackbar(`${name} pending on-chain confirmation`, {
        variant: 'warning',
        persist: true,
        action: <ViewTransactionsButton urls={txUrls} />,
      });

      if (Array.isArray(writeResults)) {
        return Promise.all(
          writeResults.map(async (result) => ({
            ...result,
            data: await waitForWriteReceipt(result.data),
          }))
        );
      }
      return waitForWriteReceipt(writeResults);
    },
    [
      signer,
      loop,
      enqueueSnackbar,
      waitForWriteReceipt,
      getWagmiConfig,
      evalDynamicValue,
      switchNetwork,
      prepareAndWriteContract,
    ]
  );

  return { readSmartContract, writeSmartContract };
};
