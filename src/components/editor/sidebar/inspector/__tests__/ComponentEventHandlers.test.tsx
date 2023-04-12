import { ComponentEvent, EventHandler } from '@app/types';
import { screen, render } from '@testing-library/react';
import { ComponentEventHandlers } from '../ComponentEventHandlers';

const mockName = 'name';
const mockEventHandlers: EventHandler[] = [];
const mockEventOptions: ComponentEvent[] = [];
const mockHandleChange = jest.fn();

describe('ComponentEventHandlers', () => {
  it('renders label', () => {
    render(
      <ComponentEventHandlers
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
      />
    );
    expect(screen.getByText('Event handlers')).toBeTruthy();
  });

  it('renders placeholder', () => {
    render(
      <ComponentEventHandlers
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
      />
    );
    expect(
      screen.getByText(
        'Trigger actions, control components, or call other APIs in response to component events.'
      )
    ).toBeTruthy();
  });

  it('renders all columns', () => {
    render(
      <ComponentEventHandlers
        name={mockName}
        eventHandlers={mockEventHandlers}
        eventOptions={mockEventOptions}
        onChange={mockHandleChange}
      />
    );
    expect(screen.getByText('Event')).toBeVisible();
    expect(screen.getByText('Effect')).toBeVisible();
  });
});
