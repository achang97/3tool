import { EVENT_HANDLER_DATA_TYPES } from '@app/constants';
import { validateSwitchField, validateTextField } from '@tests/testers/inspector';
import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { EventHandlerUrlEditor } from '../EventHandlerUrlEditor';

const mockName = 'name';
const mockHandleDataChange = jest.fn();

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview');

describe('EventHandlerUrlEditor', () => {
  describe('url', () => {
    it('renders text field', async () => {
      render(
        <EventHandlerUrlEditor
          name={mockName}
          data={{ url: 'url', newTab: false }}
          onDataChange={mockHandleDataChange}
        />
      );

      await validateTextField(undefined, {
        field: 'url',
        label: 'URL',
        value: 'url',
        onChange: mockHandleDataChange,
        data: {
          type: EVENT_HANDLER_DATA_TYPES.url.url,
          placeholder: 'Add URL',
        },
      });
    });

    it('renders "Add URL" placeholder', async () => {
      render(
        <EventHandlerUrlEditor
          name={mockName}
          data={{ url: '', newTab: false }}
          onDataChange={mockHandleDataChange}
        />
      );

      expect(screen.getByText('Add URL')).toBeDefined();
    });
  });

  it('newTab: renders switch field', async () => {
    render(
      <EventHandlerUrlEditor
        name={mockName}
        data={{ url: 'url', newTab: true }}
        onDataChange={mockHandleDataChange}
      />
    );

    await validateSwitchField(undefined, {
      field: 'newTab',
      label: 'New Tab',
      value: true,
      onChange: mockHandleDataChange,
      data: {},
    });
  });
});
