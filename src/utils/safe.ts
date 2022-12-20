import { ethers } from 'ethers';
import { fetchSigner, getNetwork } from '@wagmi/core';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import Safe from '@safe-global/safe-core-sdk';
import {
  EthAdapter,
  SafeTransaction,
  SafeTransactionDataPartial,
} from '@safe-global/safe-core-sdk-types';
import SafeServiceClient, {
  SafeMultisigTransactionResponse,
} from '@safe-global/safe-service-client';

const getSigner = async (): Promise<ethers.Signer> => {
  const safeOwner = await fetchSigner();

  // eslint-disable-next-line no-underscore-dangle
  if (!safeOwner?._isSigner) {
    throw new Error('Invalid signer');
  }

  return safeOwner;
};

const getEthAdapter = async (signer: ethers.Signer): Promise<EthersAdapter> => {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  return ethAdapter;
};

const getSafeService = (ethAdapter: EthAdapter): SafeServiceClient => {
  const { chain } = getNetwork();

  const safeService = new SafeServiceClient({
    txServiceUrl: `https://safe-transaction-${chain?.network}.safe.global`,
    ethAdapter,
  });

  return safeService;
};

const getSafe = async (
  safeAddress: string,
  ethAdapter: EthAdapter
): Promise<Safe> => {
  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress,
  });

  return safeSdk;
};

const executeTransaction = async (
  safeSdk: Safe,
  safeTransaction: SafeTransaction | SafeMultisigTransactionResponse
): Promise<ethers.ContractReceipt | undefined> => {
  const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
  const receipt = await executeTxResponse.transactionResponse?.wait();
  return receipt;
};

export const confirmAndExecuteTransaction = async (
  safeAddress: string,
  safeTransactionHash: string
): Promise<ethers.ContractReceipt | undefined> => {
  const signer = await getSigner();
  const ethAdapter = await getEthAdapter(signer);

  const safeSdk = await getSafe(safeAddress, ethAdapter);
  const safeService = getSafeService(ethAdapter);

  const threshold = await safeSdk.getThreshold();
  const transaction = await safeService.getTransaction(safeTransactionHash);
  const numConfirmations = transaction?.confirmations?.length || 0;

  if (numConfirmations >= threshold - 1) {
    // Execute the transaction
    const receipt = executeTransaction(safeSdk, transaction);
    return receipt;
  }

  // Sign the transaction
  const senderSignature = await safeSdk.signTransactionHash(
    safeTransactionHash
  );

  // Confirm the transaction
  await safeService.confirmTransaction(
    safeTransactionHash,
    senderSignature.data
  );

  return undefined;
};

export const createSafeTransaction = async (
  safeAddress: string,
  data: SafeTransactionDataPartial
): Promise<{
  transaction: SafeTransaction;
  transactionHash: string;
  receipt?: ethers.ContractReceipt;
}> => {
  const signer = await getSigner();
  const ethAdapter = await getEthAdapter(signer);

  const safeSdk = await getSafe(safeAddress, ethAdapter);
  const safeService = getSafeService(ethAdapter);

  // Create a SafeTransaction
  const safeTransaction = await safeSdk.createTransaction({
    safeTransactionData: data,
  });
  const safeTransactionHash = await safeSdk.getTransactionHash(safeTransaction);

  let receipt: ethers.ContractReceipt | undefined;
  const threshold = await safeSdk.getThreshold();

  if (threshold <= 1) {
    // Execute the transaction immediately
    receipt = await executeTransaction(safeSdk, safeTransaction);
  } else {
    // Propose a transaction to the relayer
    const senderSignature = await safeSdk.signTransactionHash(
      safeTransactionHash
    );
    await safeService.proposeTransaction({
      safeAddress: safeSdk.getAddress(),
      safeTransactionData: safeTransaction.data,
      safeTxHash: safeTransactionHash,
      senderAddress: await signer.getAddress(),
      senderSignature: senderSignature.data,
    });
  }

  return {
    transaction: safeTransaction,
    transactionHash: safeTransactionHash,
    receipt,
  };
};
