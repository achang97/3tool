import { FieldType, Resource } from '@app/types';
import { Abi, AbiFunction, AbiParameter, AbiStateMutability, AbiType } from 'abitype';
import _ from 'lodash';

export const parseResourceAbi = (abiData: Resource['data']['abi']): Abi => {
  if (!abiData) {
    return [];
  }

  try {
    return _.concat(
      JSON.parse(abiData.abi),
      abiData.isProxy && abiData.logicAbi ? JSON.parse(abiData.logicAbi) : []
    ) as Abi;
  } catch {
    return [];
  }
};

export type SmartContractAbiFunction = AbiFunction & {
  name: string;
  inputs: readonly AbiParameter[];
  outputs: readonly AbiParameter[];
};

export const filterAbiFunctions = (
  abi: Abi,
  functionType: 'read' | 'write'
): SmartContractAbiFunction[] => {
  const typedMutabilities: AbiStateMutability[] =
    functionType === 'read' ? ['pure', 'view'] : ['payable', 'nonpayable'];

  const abiFunctions = abi.filter(
    (entry) => entry.type === 'function' && typedMutabilities.includes(entry.stateMutability)
  );
  return abiFunctions as SmartContractAbiFunction[];
};

export const getAbiFieldType = (abiType: AbiType): FieldType => {
  if (abiType.startsWith('bytes')) {
    return 'string';
  }

  if (abiType.startsWith('uint') || abiType.startsWith('int')) {
    return 'number';
  }

  switch (abiType) {
    case 'string':
    case 'address':
    case 'function':
      return 'string';
    case 'bool':
      return 'boolean';
    case 'tuple':
      return 'array';
    default:
      return 'any';
  }
};
