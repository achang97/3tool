import { COMPONENT_DATA_TYPES } from '@app/constants';
import { Component, ComponentEvent, EventHandler } from '@app/types';
import { validateTextField, validateSection } from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { TableInspector } from '../TableInspector';

const mockName = 'name';
const mockData: Component['data']['table'] = {
  data: '[1]',
  emptyMessage: 'Empty Message',
  multiselect: 'multiselect',
  columnHeaderNames: {},
  columnHeadersByIndex: [],
};
const mockEventHandlers: EventHandler<ComponentEvent>[] = [];

const mockHandleChangeData = jest.fn();
const mockHandleChangeEventHandlers = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview', () => ({
  useCodeMirrorPreview: jest.fn(() => ({})),
}));

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
  })
);

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

describe('TableInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data', () => {
    it('renders "Data" title', () => {
      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );
      validateSection(result, 'Data');
    });

    it('data: renders "Data" text field', async () => {
      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Data', {
        field: 'data',
        label: 'Data',
        value: mockData.data,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.table.data },
      });
    });

    it('emptyMessage: renders "Empty message" text field', async () => {
      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Data', {
        field: 'emptyMessage',
        label: 'Empty message',
        value: mockData.emptyMessage,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.table.emptyMessage },
      });
    });
  });

  describe('Row selection', () => {
    it('renders "Row selection" title', () => {
      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );
      validateSection(result, 'Row selection');
    });

    it('multiselect: renders "Enable multi-row selection" text field', async () => {
      const result = render(
        <TableInspector
          name={mockName}
          data={mockData}
          eventHandlers={mockEventHandlers}
          onChangeData={mockHandleChangeData}
          onChangeEventHandlers={mockHandleChangeEventHandlers}
        />
      );

      await validateTextField(result, 'Row selection', {
        field: 'multiselect',
        label: 'Enable multi-row selection',
        value: mockData.multiselect,
        onChange: mockHandleChangeData,
        data: { type: COMPONENT_DATA_TYPES.table.multiselect },
      });
    });
  });
});
