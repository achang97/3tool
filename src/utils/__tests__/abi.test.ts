import { FieldType, Resource } from '@app/types';
import { Abi, AbiType } from 'abitype';
import { filterAbiFunctions, getAbiFieldType, parseResourceAbi } from '../abi';

describe('abi', () => {
  describe('parseResourceAbi', () => {
    it('returns empty array if data is undefined', () => {
      const result = parseResourceAbi(undefined);
      expect(result).toEqual([]);
    });

    it('returns empty array if abi fields are empty', () => {
      const result = parseResourceAbi({
        abi: '',
        logicAbi: '',
      } as Resource['data']['abi']);
      expect(result).toEqual([]);
    });

    it('returns empty array if parsing ABI throws error', () => {
      const result = parseResourceAbi({
        abi: 'asdf',
      } as Resource['data']['abi']);
      expect(result).toEqual([]);
    });

    it('returns combined ABI from abi and logicAbi fields if not proxy', () => {
      const result = parseResourceAbi({
        abi: '[{ "name": "function1" }]',
        logicAbi: '[{ "name": "function2" }]',
        isProxy: false,
      } as Resource['data']['abi']);
      expect(result).toEqual([{ name: 'function1' }]);
    });

    it('returns combined ABI from abi and logicAbi fields if proxy', () => {
      const result = parseResourceAbi({
        abi: '[{ "name": "function1" }]',
        logicAbi: '[{ "name": "function2" }]',
        isProxy: true,
      } as Resource['data']['abi']);
      expect(result).toEqual([{ name: 'function1' }, { name: 'function2' }]);
    });
  });

  describe('filterAbiFunctions', () => {
    const mockAbi = [
      { type: 'constructor' },
      {
        name: 'function1',
        stateMutability: 'pure',
        type: 'function',
      },
      {
        name: 'function2',
        stateMutability: 'view',
        type: 'function',
      },
      {
        name: 'function3',
        stateMutability: 'payable',
        type: 'function',
      },
      {
        name: 'function4',
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] as unknown as Abi;

    it('returns pure and view functions for read type', () => {
      const result = filterAbiFunctions(mockAbi, 'read');
      expect(result).toEqual([
        {
          name: 'function1',
          stateMutability: 'pure',
          type: 'function',
        },
        {
          name: 'function2',
          stateMutability: 'view',
          type: 'function',
        },
      ]);
    });

    it('returns payable and nonpayable functions for write type', () => {
      const result = filterAbiFunctions(mockAbi, 'write');
      expect(result).toEqual([
        {
          name: 'function3',
          stateMutability: 'payable',
          type: 'function',
        },
        {
          name: 'function4',
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ]);
    });
  });

  describe('getAbiFieldType', () => {
    it.each`
      abiType           | fieldType
      ${'bytes'}        | ${'string'}
      ${'uint'}         | ${'number'}
      ${'uint256'}      | ${'number'}
      ${'int'}          | ${'number'}
      ${'int256'}       | ${'number'}
      ${'string'}       | ${'string'}
      ${'address'}      | ${'string'}
      ${'function'}     | ${'string'}
      ${'bool'}         | ${'boolean'}
      ${'tuple'}        | ${'array'}
      ${'invalid type'} | ${'any'}
    `(
      'returns $fieldType for $abiType',
      ({ abiType, fieldType }: { abiType: AbiType; fieldType: FieldType }) => {
        const result = getAbiFieldType(abiType);
        expect(result).toEqual(fieldType);
      }
    );
  });
});
