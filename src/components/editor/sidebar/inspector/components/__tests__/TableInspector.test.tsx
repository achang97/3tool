import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component } from '@app/types';
import {
  validateDynamicInputField,
  validateSection,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { TableInspector } from '../TableInspector';

const mockData: Component['data']['table'] = {
  data: '[1]',
  emptyMessage: 'Empty Message',
  multiselect: 'multiselect',
  columnHeaderNames: {},
  columnHeadersByIndex: [],
};

const mockHandleUpdateData = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview', () => ({
  useCodeMirrorPreview: jest.fn(() => ({})),
}));

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
  })
);

describe('TableInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data', () => {
    it('renders "Data" title', () => {
      const result = render(
        <TableInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );
      validateSection(result, 'Data');
    });

    it('data: renders "Data" text field', async () => {
      const result = render(
        <TableInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );

      await validateDynamicInputField(result, 'Data', {
        field: 'data',
        label: 'Data',
        value: mockData.data,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.table.data },
      });
    });

    it('emptyMessage: renders "Empty message" text field', async () => {
      const result = render(
        <TableInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );

      await validateDynamicInputField(result, 'Data', {
        field: 'emptyMessage',
        label: 'Empty message',
        value: mockData.emptyMessage,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.table.emptyMessage },
      });
    });
  });

  describe('Row selection', () => {
    it('renders "Row selection" title', () => {
      const result = render(
        <TableInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );
      validateSection(result, 'Row selection');
    });

    it('multiselect: renders "Enable multi-row selection" text field', async () => {
      const result = render(
        <TableInspector data={mockData} onUpdateData={mockHandleUpdateData} />
      );

      await validateDynamicInputField(result, 'Row selection', {
        field: 'multiselect',
        label: 'Enable multi-row selection',
        value: mockData.multiselect,
        onChange: mockHandleUpdateData,
        config: { type: COMPONENT_DATA_TYPES.table.multiselect },
      });
    });
  });
});
