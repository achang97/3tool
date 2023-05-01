import { Action, SmartContractBaseData, SmartContractBaseDataFunction } from '@app/types';
import { filterAbiFunctions, getAbiFieldType } from '@app/utils/abi';
import {
  SendTransactionResult,
  prepareWriteContract,
  readContract,
  readContracts,
  writeContract,
} from '@wagmi/core';
import { AbiType } from 'abitype';
import { ethers } from 'ethers';
import { useCallback } from 'react';
import { useSigner } from 'wagmi';
import { useEnqueueSnackbar } from '@app/hooks/useEnqueueSnackbar';
import { getTransactionUrl } from '@app/utils/contracts';
import { useActionLoop } from './useActionLoop';
import { useEvalDynamicValue } from './useEvalDynamicValue';
import { useActionSmartContract } from './useActionSmartContract';
import { ViewTransactionsButton } from '../common/ViewTransactionsButton';

export const useActionSmartContractExecute = () => {
  const getSmartContractData = useActionSmartContract();
  const { data: signer } = useSigner();
  const loop = useActionLoop();
  const evalDynamicValue = useEvalDynamicValue();
  const enqueueSnackbar = useEnqueueSnackbar();

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
        signer,
      };
    },
    [evalDynamicValue, getSmartContractData, signer]
  );

  const readSmartContract = useCallback(
    async (data: Action['data']['smartContractRead']) => {
      if (!data) {
        return undefined;
      }

      return loop(data, async (element) => {
        const config = data.functions.map((smartContractFunction) =>
          getWagmiConfig('read', data, smartContractFunction, element)
        );

        return data.functions.length === 1
          ? readContract(config[0])
          : readContracts({ contracts: config });
      });
    },
    [loop, getWagmiConfig]
  );

  const waitForWriteReceipt = useCallback(
    async (
      result: SendTransactionResult & {
        blockExplorerUrl: string;
      }
    ) => {
      const txReceipt = await result.wait();
      return {
        ...txReceipt,
        blockExplorerUrl: result.blockExplorerUrl,
      };
    },
    []
  );

  const writeSmartContract = useCallback(
    async (name: string, data: Action['data']['smartContractWrite']) => {
      if (!data) {
        return undefined;
      }

      const writeFunction = data.functions[0];
      const writeResults = await loop<SendTransactionResult & { blockExplorerUrl: string }>(
        data,
        async (element) => {
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

          const preparedConfig = await prepareWriteContract(config);
          // @ts-ignore preparedConfig has unknown as AbiParameter type
          const writeResult = await writeContract(preparedConfig);
          return {
            ...writeResult,
            blockExplorerUrl: config.chainId
              ? getTransactionUrl(config.chainId, writeResult.hash)
              : '',
          };
        }
      );

      const isLoop = Array.isArray(writeResults);
      const txUrls = isLoop
        ? writeResults.map((writeResult) => writeResult.data.blockExplorerUrl)
        : [writeResults.blockExplorerUrl];
      enqueueSnackbar(`${name} pending on-chain confirmation`, {
        variant: 'warning',
        persist: true,
        action: <ViewTransactionsButton urls={txUrls} />,
      });

      if (!isLoop) {
        return waitForWriteReceipt(writeResults);
      }
      return Promise.all(
        writeResults.map(async (result) => ({
          ...result,
          data: await waitForWriteReceipt(result.data),
        }))
      );
    },
    [loop, enqueueSnackbar, waitForWriteReceipt, getWagmiConfig, evalDynamicValue]
  );

  return { readSmartContract, writeSmartContract };
};
