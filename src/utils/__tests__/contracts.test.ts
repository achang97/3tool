import axios from 'axios';
import { init as etherscanInit } from 'etherscan-api';
import { CHAINS_BY_ID, CHAIN_APIS_BY_ID } from '@app/constants';
import { mainnet } from 'wagmi';
import { getContractAbi, getTransactionUrl } from '../contracts';

const mockEtherscanClient = {
  contract: {
    getabi: jest.fn(),
  },
};

jest.mock('etherscan-api');
jest.mock('axios');

describe('contracts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactionUrl', () => {
    it('returns empty string if chain id is invalid', () => {
      const result = getTransactionUrl(-1, '123');
      expect(result).toEqual('');
    });

    it('returns transaction url', () => {
      const result = getTransactionUrl(mainnet.id, '123');
      expect(result).toEqual(`${mainnet.blockExplorers.default.url}/tx/123`);
    });
  });

  describe('getContractAbi', () => {
    beforeEach(() => {
      (etherscanInit as jest.Mock).mockImplementation(() => mockEtherscanClient);
    });

    it('throws error if chain is unsupported', async () => {
      expect(async () => getContractAbi('0x0', 0)).rejects.toThrow('Invalid chainId 0');
    });

    it('calls etherscan-api init with correct arguments', async () => {
      const mockAxiosClient = { name: 'axios' };
      (axios.create as jest.Mock).mockImplementation(() => mockAxiosClient);

      mockEtherscanClient.contract.getabi.mockImplementation(() => ({
        result: '[]',
      }));

      await getContractAbi('0x123', mainnet.id);

      expect(etherscanInit as jest.Mock).toHaveBeenCalledWith(
        CHAIN_APIS_BY_ID[mainnet.id].apiKey,
        CHAINS_BY_ID[mainnet.id].network,
        expect.any(Number),
        mockAxiosClient
      );
    });

    it('throws error if Etherscan API call fails', async () => {
      const mockErrorMessage = 'Failed to fetch abi';
      mockEtherscanClient.contract.getabi.mockImplementation(() => {
        throw Error(mockErrorMessage);
      });

      expect(async () => getContractAbi('0x0', mainnet.id)).rejects.toThrow(mockErrorMessage);
    });

    it('returns parsed ABI', async () => {
      const mockAbi = ['123'];
      mockEtherscanClient.contract.getabi.mockImplementation(() => ({
        result: JSON.stringify(mockAbi),
      }));

      expect(await getContractAbi('0x0', mainnet.id)).toEqual(mockAbi);
    });
  });
});
