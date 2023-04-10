import { RESOURCE_CONFIGS } from '@app/constants';
import { ResourceType } from '@app/types';
import { GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { render } from '@testing-library/react';
import { formatResourceType, formatCreatedAt, renderNameCell } from '../dataGridFormatters';

describe('dataGridFormatters', () => {
  describe('formatResourceType', () => {
    it('returns label for type', () => {
      const mockType = ResourceType.SmartContract;
      const result = formatResourceType({
        value: mockType,
      } as GridValueFormatterParams);
      expect(result).toEqual(RESOURCE_CONFIGS[mockType].label);
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
          row: { type: ResourceType.Abi },
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
