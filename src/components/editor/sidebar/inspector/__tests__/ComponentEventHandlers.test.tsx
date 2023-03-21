import { ComponentEvent, EventHandler } from '@app/types';
import { render } from '@testing-library/react';
import { ComponentEventHandlers } from '../ComponentEventHandlers';

const mockName = 'name';
const mockEventHandlers: EventHandler[] = [];
const mockEventOptions: ComponentEvent[] = [];
const mockHandleChange = jest.fn();

describe('ComponentEventHandlers', () => {
  it('renders label', () => {
    const result = render(
      <ComponentEventHandlers
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
      />
    );
    expect(result.getByText('Event handlers')).toBeTruthy();
  });

  it('renders placeholder', () => {
    const result = render(
      <ComponentEventHandlers
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
      />
    );
    expect(
      result.getByText(
        'Trigger actions, control components, or call other APIs in response to component events.'
      )
    ).toBeTruthy();
  });

  it('renders all columns', () => {
    const result = render(
      <ComponentEventHandlers
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
      />
    );
    expect(result.getByText('Event')).toBeVisible();
    expect(result.getByText('Effect')).toBeVisible();
  });
});
