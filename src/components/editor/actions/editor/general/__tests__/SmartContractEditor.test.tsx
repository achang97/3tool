import { screen, render } from '@testing-library/react';
import { SmartContractEditor } from '../SmartContractEditor';

describe('SmartContractEditor', () => {
  it('renders text', () => {
    render(<SmartContractEditor />);
    expect(screen.getByText('Smart Contract Editor')).toBeTruthy();
  });
});
