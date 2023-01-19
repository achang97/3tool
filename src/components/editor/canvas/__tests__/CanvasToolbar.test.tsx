import { render } from '@testing-library/react';
import { CanvasToolbar } from '../CanvasToolbar';

describe('CanvasToolbar', () => {
  it('renders Connect Wallet button', () => {
    const result = render(<CanvasToolbar />);
    expect(result.getByTestId('connect-wallet-button')).toBeDefined();
  });
});
