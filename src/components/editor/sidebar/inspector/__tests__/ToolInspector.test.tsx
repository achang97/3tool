import { GLOBAL_LIBRARIES } from '@app/utils/global';
import { render } from '@testing-library/react';
import { ToolInspector } from '../ToolInspector';

describe('ToolInspector', () => {
  it('renders tool title', () => {
    const result = render(<ToolInspector />);
    expect(result.getByText('tool')).toBeDefined();
  });

  it('renders libraries section', () => {
    const result = render(<ToolInspector />);
    expect(result.getByText('Libraries')).toBeDefined();

    GLOBAL_LIBRARIES.forEach(({ label }) => {
      expect(result.getByText(label)).toBeDefined();
    });
  });
});
