import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { ComponentData, ComponentType } from '@app/types';
import { mockEvalResult } from '@tests/constants/eval';
import {
  validateDynamicInputField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { TableInspector } from '../TableInspector';

const mockName = 'Name';
const mockData: ComponentData = {
  table: {
    data: '[1]',
    emptyMessage: 'Empty Message',
    multiselect: 'multiselect',
    columnHeaderNames: {},
    columnHeadersByIndex: [],
  },
};

const mockHandleUpdate = jest.fn();

jest.mock('@app/components/editor/hooks/useComponentEvalData');

describe('TableInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useComponentEvalData as jest.Mock).mockImplementation(() => ({
      evalData: {},
    }));
  });

  describe('Data', () => {
    it('renders "Data" title', () => {
      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Data');
    });

    it('data: renders "Data" text field', async () => {
      const mockEvalData = { data: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Data', {
        type: ComponentType.Table,
        field: 'data',
        label: 'Data',
        value: mockData.table?.data,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.data,
      });
    });

    it('emptyMessage: renders "Empty message" text field', async () => {
      const mockEvalData = { emptyMessage: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Data', {
        type: ComponentType.Table,
        field: 'emptyMessage',
        label: 'Empty message',
        value: mockData.table?.emptyMessage,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.emptyMessage,
      });
    });
  });

  describe('Row selection', () => {
    it('renders "Row selection" title', () => {
      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );
      validateSection(result, 'Row selection');
    });

    it('multiselect: renders "Enable multi-row selection" text field', async () => {
      const mockEvalData = { multiselect: mockEvalResult };
      (useComponentEvalData as jest.Mock).mockImplementation(() => ({
        evalData: mockEvalData,
      }));

      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Row selection', {
        type: ComponentType.Table,
        field: 'multiselect',
        label: 'Enable multi-row selection',
        value: mockData.table?.multiselect,
        onChange: mockHandleUpdate,
        evalResult: mockEvalData.multiselect,
      });
    });
  });
});
