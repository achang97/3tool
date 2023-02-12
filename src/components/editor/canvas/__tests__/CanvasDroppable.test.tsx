import { Component, ComponentType, Tool } from '@app/types';
import {
  mockComponentLayout,
  mockTool as baseMockTool,
} from '@tests/constants/data';
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
    data: {},
  },
];

const mockTool: Tool = {
  ...baseMockTool,
  components: mockComponents,
};

jest.mock('../../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: mockTool,
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
