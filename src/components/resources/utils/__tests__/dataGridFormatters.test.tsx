import { ResourceType } from '@app/types';
import {
  GridRenderCellParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { render } from '@testing-library/react';
import {
  formatResourceType,
  formatCreatedAt,
  renderNameCell,
} from '../dataGridFormatters';

describe('dataGridFormatters', () => {
  describe('formatResourceType', () => {
    it('returns "Smart Contract" for smart_contract type', () => {
      const result = formatResourceType({
        value: ResourceType.SmartContract,
      } as GridValueFormatterParams);
      expect(result).toEqual('Smart contract');
    });

    it('returns "Dune" for dune type', () => {
      const result = formatResourceType({
        value: ResourceType.Dune,
      } as GridValueFormatterParams);
      expect(result).toEqual('Dune');
    });

    it('returns "" for invalid type', () => {
      const result = formatResourceType({
        value: '',
      } as GridValueFormatterParams);
      expect(result).toEqual('');
    });
  });

  describe('formatCreatedAt', () => {
    it('returns date in moment lll format', () => {
      const result = formatCreatedAt({
        value: new Date('2023-01-05T02:37:30.083Z'),
      } as GridValueFormatterParams);
      expect(result).toEqual('Jan 5, 2023 2:37 AM');
    });
  });

  describe('renderNameCell', () => {
    it('renders name', () => {
      const mockName = 'Name';

      const result = render(
        renderNameCell({
          value: mockName,
          row: { type: ResourceType.Dune },
        } as GridRenderCellParams)
      );

      expect(result.getByText(mockName)).toBeTruthy();
    });

    it('renders address within parentheses if type is smart_contract', () => {
      const mockName = 'Name';
      const mockAddress = '0x123';

      const result = render(
        renderNameCell({
          value: mockName,
          row: {
            type: ResourceType.SmartContract,
            data: { smartContract: { address: mockAddress } },
          },
        } as GridRenderCellParams)
      );

      expect(result.getByText(`(${mockAddress})`)).toBeTruthy();
    });
  });
});
