import { Component, ComponentType } from '@app/types';
import { mockComponentLayout } from '@tests/constants/data';
import { render } from '@tests/utils/renderWithContext';
import { DepGraph } from 'dependency-graph';
import React from 'react';
import { CanvasDroppable } from '../CanvasDroppable';

const mockUpdateTool = jest.fn();

const mockComponents = [
  {
    name: 'button1',
    type: ComponentType.Button,
    layout: mockComponentLayout,
    eventHandlers: [],
    data: {},
  },
] as unknown as Component[];

jest.mock('../../hooks/useActiveTool', () => ({
  useActiveTool: jest.fn(() => ({
    tool: {
      components: mockComponents,
    },
    updateTool: mockUpdateTool,
    dataDepGraph: new DepGraph<string>(),
    evalDataMap: {},
    evalDataValuesMap: {},
  })),
}));

jest.mock('../../hooks/useComponentEvalData', () => ({
  useComponentEvalData: jest.fn(() => ({
    evalDataValues: {},
  })),
}));

describe('CanvasDroppable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tool components', () => {
    const result = render(<CanvasDroppable isEditable />);
    expect(result.getByTestId('canvas-component-button1')).toBeTruthy();
  });
});
