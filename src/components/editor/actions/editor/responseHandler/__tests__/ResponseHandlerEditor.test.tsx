import { render } from '@testing-library/react';
import { ResponseHandlerEditor } from '../ResponseHandlerEditor';

describe('ResponseHandlerEditor', () => {
  it('renders text', () => {
    const result = render(<ResponseHandlerEditor />);
    expect(result.getByText('TODO: Response Handler')).toBeTruthy();
  });
});
