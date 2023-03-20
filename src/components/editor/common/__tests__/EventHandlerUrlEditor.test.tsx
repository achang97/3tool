import { EVENT_HANDLER_DATA_TYPES } from '@app/constants';
import {
  validateSwitchField,
  validateTextField,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { EventHandlerUrlEditor } from '../EventHandlerUrlEditor';

const mockName = 'name';
const mockHandleChangeData = jest.fn();

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview');

describe('EventHandlerUrlEditor', () => {
  describe('url', () => {
    it('renders text field', async () => {
      const result = render(
        <EventHandlerUrlEditor
          name={mockName}
          data={{ url: 'url', newTab: false }}
          onChangeData={mockHandleChangeData}
        />
      );

      await validateTextField(result, undefined, {
        field: 'url',
        label: 'URL',
        value: 'url',
        onChange: mockHandleChangeData,
        data: {
          type: EVENT_HANDLER_DATA_TYPES.url.url,
          placeholder: 'Add URL',
        },
      });
    });

    it('renders "Add URL" placeholder', async () => {
      const result = render(
        <EventHandlerUrlEditor
          name={mockName}
          data={{ url: '', newTab: false }}
          onChangeData={mockHandleChangeData}
        />
      );

      expect(result.getByText('Add URL')).toBeDefined();
    });
  });

  it('newTab: renders switch field', async () => {
    const result = render(
      <EventHandlerUrlEditor
        name={mockName}
        data={{ url: 'url', newTab: true }}
        onChangeData={mockHandleChangeData}
      />
    );

    await validateSwitchField(result, undefined, {
      field: 'newTab',
      label: 'New Tab',
      value: true,
      onChange: mockHandleChangeData,
      data: {},
    });
  });
});
