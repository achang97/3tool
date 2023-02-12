import { GLOBAL_LIBRARIES } from '@app/constants';
import { render } from '@testing-library/react';
import { ToolInspector } from '../ToolInspector';

describe('ToolInspector', () => {
  it('renders tool title', () => {
    const result = render(<ToolInspector />);
    expect(result.getByText('tool')).toBeTruthy();
  });

  it('renders libraries section', () => {
    const result = render(<ToolInspector />);
    expect(result.getByText('Libraries')).toBeTruthy();

    GLOBAL_LIBRARIES.forEach(({ label }) => {
      expect(result.getByText(label)).toBeTruthy();
    });
  });
});
