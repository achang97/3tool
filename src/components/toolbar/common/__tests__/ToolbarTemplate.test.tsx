import { screen } from '@testing-library/react';
import { render } from '@tests/utils/renderWithContext';
import { ToolbarTemplate } from '../ToolbarTemplate';

describe('ToolbarTemplate', () => {
  it('renders logo as a link to /', () => {
    render(<ToolbarTemplate />);

    const logo = screen.getByTestId('toolbar-logo');
    expect(logo.getAttribute('href')).toEqual('/');
  });

  it('renders left component', () => {
    const mockLeft = 'left';

    render(<ToolbarTemplate left={mockLeft} />);

    expect(screen.getByText(mockLeft)).toBeTruthy();
  });

  it('renders middle component', () => {
    const mockMiddle = 'middle';

    render(<ToolbarTemplate middle={mockMiddle} />);

    expect(screen.getByText(mockMiddle)).toBeTruthy();
  });

  it('renders right component', () => {
    const mockRight = 'right';

    render(<ToolbarTemplate right={mockRight} />);

    expect(screen.getByText(mockRight)).toBeTruthy();
  });
});
