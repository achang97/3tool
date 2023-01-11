import { render } from '@testing-library/react';
import { EditorToolbar } from '../EditorToolbar';

describe('EditorToolbar', () => {
  it('renders Connect Wallet button', () => {
    const result = render(<EditorToolbar />);
    expect(result.getByTestId('connect-wallet-button')).toBeDefined();
  });
});
