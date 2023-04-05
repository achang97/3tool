import { ACTION_METHOD_CONFIGS } from '@app/constants';
import { ActionMethod } from '@app/types';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { validateSelectField } from '@tests/testers/inspector';
import { useToolElementNames } from '../../hooks/useToolElementNames';
import { EventHandlerActionEditor } from '../EventHandlerActionEditor';

const mockName = 'name';
const mockHandleDataChange = jest.fn();

jest.mock('../../hooks/useToolElementNames');

describe('EventHandlerActionEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useToolElementNames as jest.Mock).mockImplementation(() => ({
      actionNames: ['action1'],
    }));
  });

  describe('actionName', () => {
    it('renders select', async () => {
      const mockActionNames = ['action1', 'action2'];
      (useToolElementNames as jest.Mock).mockImplementation(() => ({
        actionNames: mockActionNames,
      }));

      const result = render(
        <EventHandlerActionEditor
          name={mockName}
          data={{
            actionName: 'action1',
            method: ActionMethod.Trigger,
          }}
          onDataChange={mockHandleDataChange}
        />
      );
      await validateSelectField(result, undefined, {
        field: 'actionName',
        label: 'Action',
        value: 'action1',
        onChange: mockHandleDataChange,
        data: {
          options: mockActionNames.map((actionName) => ({
            label: actionName,
            value: actionName,
          })),
        },
      });
    });

    it('renders "No created actions" placeholder if there are no created actions', () => {
      (useToolElementNames as jest.Mock).mockImplementation(() => ({
        actionNames: [],
      }));

      const result = render(
        <EventHandlerActionEditor
          name={mockName}
          data={{ actionName: '', method: ActionMethod.Trigger }}
          onDataChange={mockHandleDataChange}
        />
      );
      expect(result.getByText('No created actions')).toBeTruthy();
    });

    it('renders "Select action" placeholder if there are created actions', () => {
      const mockActionNames = ['action1', 'action2'];
      (useToolElementNames as jest.Mock).mockImplementation(() => ({
        actionNames: mockActionNames,
      }));

      const result = render(
        <EventHandlerActionEditor
          name={mockName}
          data={{ actionName: '', method: ActionMethod.Trigger }}
          onDataChange={mockHandleDataChange}
        />
      );
      expect(result.getByText('Select action')).toBeTruthy();
    });

    it('disables select if there are no created actions', async () => {
      (useToolElementNames as jest.Mock).mockImplementation(() => ({
        actionNames: [],
      }));

      const result = render(
        <EventHandlerActionEditor
          name={mockName}
          data={{ actionName: '', method: ActionMethod.Trigger }}
          onDataChange={mockHandleDataChange}
        />
      );
      await userEvent.click(result.getByLabelText('Action'));
      expect(result.queryByRole('option')).toBeNull();
    });
  });

  describe('actionMethod', () => {
    it('renders select', async () => {
      const result = render(
        <EventHandlerActionEditor
          name={mockName}
          data={{
            actionName: 'action1',
            method: ActionMethod.Trigger,
          }}
          onDataChange={mockHandleDataChange}
        />
      );
      await validateSelectField(result, undefined, {
        field: 'method',
        label: 'Method',
        value: ActionMethod.Trigger,
        onChange: mockHandleDataChange,
        data: {
          options: Object.values(ActionMethod).map((method) => ({
            label: ACTION_METHOD_CONFIGS[method].label,
            value: method,
          })),
        },
      });
    });

    it('renders "Select method" placeholder', () => {
      const result = render(
        <EventHandlerActionEditor
          name={mockName}
          data={{
            actionName: '',
            method: '' as unknown as ActionMethod,
          }}
          onDataChange={mockHandleDataChange}
        />
      );
      expect(result.getByText('Select method')).toBeTruthy();
    });
  });
});
