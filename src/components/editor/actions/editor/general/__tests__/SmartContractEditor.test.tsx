import { render } from '@testing-library/react';
import { SmartContractEditor } from '../SmartContractEditor';

describe('SmartContractEditor', () => {
  it('renders text', () => {
    const result = render(<SmartContractEditor />);
    expect(result.getByText('Smart Contract Editor')).toBeTruthy();
  });
});
