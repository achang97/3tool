import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from 'tests/utils/renderWithContext';
import { ToolbarTemplate } from '../ToolbarTemplate';

describe('ToolbarTemplate', () => {
  it('renders logo as a link to /tools', () => {
    window.history.pushState('', '', '/settings');

    const result = render(<ToolbarTemplate />);

    const logo = result.getByTestId('toolbar-logo');
    expect(logo).toBeDefined();

    expect(window.location.pathname).toEqual('/settings');
    userEvent.click(logo);
    expect(window.location.pathname).toEqual('/');
  });

  it('renders left component', () => {
    const mockLeft = 'left';

    const result = render(<ToolbarTemplate left={mockLeft} />);

    expect(result.getByText(mockLeft)).toBeDefined();
  });

  it('renders middle component', () => {
    const mockMiddle = 'middle';

    const result = render(<ToolbarTemplate middle={mockMiddle} />);

    expect(result.getByText(mockMiddle)).toBeDefined();
  });

  it('renders right component', () => {
    const mockRight = 'right';

    const result = render(<ToolbarTemplate right={mockRight} />);

    expect(result.getByText(mockRight)).toBeDefined();
  });
});
