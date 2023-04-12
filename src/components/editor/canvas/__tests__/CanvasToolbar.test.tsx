import { screen, render } from '@testing-library/react';
import { CanvasToolbar } from '../CanvasToolbar';

describe('CanvasToolbar', () => {
  it('renders Connect Wallet button', () => {
    render(<CanvasToolbar />);
    expect(screen.getByTestId('connect-wallet-button')).toBeTruthy();
  });
});
