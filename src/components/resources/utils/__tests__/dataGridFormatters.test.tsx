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
        value: 'smart_contract',
      } as GridValueFormatterParams);
      expect(result).toEqual('Smart contract');
    });

    it('returns "Dune" for dune type', () => {
      const result = formatResourceType({
        value: 'dune',
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
      expect(result).toEqual('Jan 4, 2023 6:37 PM');
    });
  });

  describe('renderNameCell', () => {
    it('renders name', () => {
      const mockName = 'Name';

      const result = render(
        renderNameCell({
          value: mockName,
          row: { type: 'dune' },
        } as GridRenderCellParams)
      );

      expect(result.getByText(mockName)).toBeDefined();
    });

    it('renders address within parentheses if type is smart_contract', () => {
      const mockName = 'Name';
      const mockAddress = '0x123';

      const result = render(
        renderNameCell({
          value: mockName,
          row: {
            type: 'smart_contract',
            metadata: { smartContract: { address: mockAddress } },
          },
        } as GridRenderCellParams)
      );

      expect(result.getByText(`(${mockAddress})`)).toBeDefined();
    });
  });
});
