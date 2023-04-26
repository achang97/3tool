import { Resource, ResourceType } from '@app/types';
import { mockValidAddress } from '@tests/constants/data';
import { validateResource } from '../validate';

describe('validate', () => {
  describe('smart contract', () => {
    it('returns false if data is undefined', () => {
      const result = validateResource({
        type: ResourceType.SmartContract,
        data: {},
      } as Resource);
      expect(result).toEqual(false);
    });

    it('returns false if address is not a valid hex address', () => {
      const result = validateResource({
        type: ResourceType.SmartContract,
        data: {
          smartContract: {
            address: 'asdf',
            abiId: '1',
            chainId: 1,
          },
        },
      } as Resource);
      expect(result).toEqual(false);
    });

    it('returns false if abi id is empty', () => {
      const result = validateResource({
        type: ResourceType.SmartContract,
        data: {
          smartContract: {
            address: mockValidAddress,
            abiId: '',
            chainId: 1,
          },
        },
      } as Resource);
      expect(result).toEqual(false);
    });

    it('returns false if chain id is empty', () => {
      const result = validateResource({
        type: ResourceType.SmartContract,
        data: {
          smartContract: {
            address: mockValidAddress,
            abiId: '1',
          },
        },
      } as Resource);
      expect(result).toEqual(false);
    });

    it('returns true if all fields are valid', () => {
      const result = validateResource({
        type: ResourceType.SmartContract,
        data: {
          smartContract: {
            address: mockValidAddress,
            abiId: '1',
            chainId: 1,
          },
        },
      } as Resource);
      expect(result).toEqual(true);
    });
  });

  describe('abi', () => {
    it('returns false if data is undefined', () => {
      const result = validateResource({
        type: ResourceType.Abi,
        data: {},
      } as Resource);
      expect(result).toEqual(false);
    });

    it('returns false if proxy and logic abi is undefined', () => {
      const result = validateResource({
        type: ResourceType.Abi,
        data: {
          abi: {
            isProxy: true,
            logicAbi: undefined,
          },
        },
      } as Resource);
      expect(result).toEqual(false);
    });

    it('returns false if proxy and logic abi is invalid', () => {
      const result = validateResource({
        type: ResourceType.Abi,
        data: {
          abi: {
            isProxy: true,
            logicAbi: 'asdf',
          },
        },
      } as Resource);
      expect(result).toEqual(false);
    });

    it('returns false if abi is invalid', () => {
      const result = validateResource({
        type: ResourceType.Abi,
        data: {
          abi: {
            abi: 'asdf',
          },
        },
      } as Resource);
      expect(result).toEqual(false);
    });

    it('returns true if proxy and logic abi and abi are valid', () => {
      const result = validateResource({
        type: ResourceType.Abi,
        data: {
          abi: {
            isProxy: true,
            logicAbi: '[]',
            abi: '[]',
          },
        },
      } as Resource);
      expect(result).toEqual(true);
    });

    it('returns true if not proxy and abi is valid', () => {
      const result = validateResource({
        type: ResourceType.Abi,
        data: {
          abi: {
            isProxy: false,
            abi: '[]',
          },
        },
      } as Resource);
      expect(result).toEqual(true);
    });
  });

  describe('default', () => {
    it('returns true', () => {
      const result = validateResource({ type: '' } as unknown as Resource);
      expect(result).toEqual(true);
    });
  });
});
