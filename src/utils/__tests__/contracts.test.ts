import { getContractAbi } from 'utils/contracts';

describe('contracts', () => {
  describe('getContractAbi', () => {
    it('throws error if chain is unsupported', () => {
      expect(getContractAbi('0x0', 0)).toThrowError();
    });

    // it('throws error if Etherscan API call fails');

    // it('returns parsed ABI')
  });
});
