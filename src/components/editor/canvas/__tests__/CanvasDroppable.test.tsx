import { Component, ComponentType } from '@app/types';
import { mockComponentLayout } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import { DepGraph } from 'dependency-graph';
import React from 'react';
import { CanvasDroppable } from '../CanvasDroppable';

const mockUpdateTool = jest.fn();

const mockComponents: Component[] = [
  {
    name: 'button1',
    type: ComponentType.Button,
    layout: mockComponentLayout,
    eventHandlers: [],
    data: {},
  },
];

jest.mock('../../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      components: mockComponents,
    },
    updateTool: mockUpdateTool,
    componentDataDepGraph: new DepGraph<string>(),
    componentEvalDataMap: {},
    componentEvalDataValuesMap: {},
  })),
}));

jest.mock('../../hooks/useComponentEvalData', () => ({
  useComponentEvalData: jest.fn(() => ({
    evalDataValues: {},
  })),
}));

describe('CanvasDroppable', () => {
  it('renders tool components', () => {
    const result = render(<CanvasDroppable />);
    expect(result.getByTestId('button1')).toBeTruthy();
  });
});
