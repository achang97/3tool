import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelpTooltip } from '../HelpTooltip';

describe('HelpTooltip', () => {
  it('renders tooltip on hover', async () => {
    const mockText = 'mockTooltipText';
    render(<HelpTooltip text={mockText} />);

    await userEvent.hover(screen.getByTestId('help-tooltip-icon'));
    expect(await screen.findByText(mockText)).toBeTruthy();
  });
});
