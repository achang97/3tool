import { EvalResult } from '@app/components/editor/utils/eval';
import { ComponentType } from '@app/types';
import {
  validateDynamicInputField,
  validateEnumField,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { BaseInspector, BaseInspectorSectionProps } from '../BaseInspector';

const mockName = 'Name';
const mockType = ComponentType.Button;
const mockHandleUpdate = jest.fn();

describe('BaseInspector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section titles', () => {
    const mockConfig: BaseInspectorSectionProps[] = [
      { title: 'Section 1', fields: [] },
      { title: 'Section 2', fields: [] },
    ];

    const result = render(
      <BaseInspector
        name={mockName}
        type={mockType}
        config={mockConfig}
        onUpdate={mockHandleUpdate}
      />
    );

    expect(result.getByText('Section 1')).toBeTruthy();
    expect(result.getByText('Section 2')).toBeTruthy();
  });

  it('rerenders on name change', () => {
    const mockConfig: BaseInspectorSectionProps[] = [
      {
        title: 'Section 1',
        fields: [
          {
            field: 'text',
            label: 'Text',
            value: 'hello',
            data: {
              text: {
                evalResult: {
                  parsedExpression: 'hello',
                  value: 'hello',
                },
              },
            },
          },
        ],
      },
    ];
    const result = render(
      <BaseInspector
        name={mockName}
        type={mockType}
        config={mockConfig}
        onUpdate={mockHandleUpdate}
      />
    );
    expect(result.getByText('hello')).toBeTruthy();

    const mockUpdatedConfig: BaseInspectorSectionProps[] = [
      {
        title: 'Section 1',
        fields: [
          {
            field: 'text',
            label: 'Text',
            value: 'hello!',
            data: {
              text: {
                evalResult: {
                  parsedExpression: 'hello!',
                  value: 'hello!',
                },
              },
            },
          },
        ],
      },
    ];
    result.rerender(
      <BaseInspector
        name={`${mockName}_1`}
        type={mockType}
        config={mockUpdatedConfig}
        onUpdate={mockHandleUpdate}
      />
    );
    expect(result.getByText('hello!')).toBeTruthy();
  });

  it('renders nothing if field data is empty', () => {
    const mockConfig: BaseInspectorSectionProps[] = [
      {
        title: 'Section 1',
        fields: [
          {
            field: 'text',
            label: 'Text',
            value: 'hello',
            data: {},
          },
        ],
      },
    ];
    const result = render(
      <BaseInspector
        name={mockName}
        type={mockType}
        config={mockConfig}
        onUpdate={mockHandleUpdate}
      />
    );
    expect(result.queryByText('Text')).toBeNull();
    expect(result.queryByText('hello')).toBeNull();
  });

  describe('enum', () => {
    it('renders enum field if enum data is defined', async () => {
      const mockOptions = [
        {
          label: 'Option 1',
          value: 1,
        },
        {
          label: 'Option 2',
          value: 2,
        },
      ];
      const mockConfig: BaseInspectorSectionProps[] = [
        {
          title: 'Section 1',
          fields: [
            {
              field: 'text',
              label: 'Text',
              value: 1,
              data: {
                enum: {
                  options: mockOptions,
                },
              },
            },
          ],
        },
      ];

      const result = render(
        <BaseInspector
          name={mockName}
          type={mockType}
          config={mockConfig}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateEnumField(result, 'Section 1', {
        type: mockType,
        field: 'text',
        label: 'Text',
        value: 1,
        options: mockOptions,
        onChange: mockHandleUpdate,
      });
    });
  });

  describe('text', () => {
    it('renders text field if text data is defined', async () => {
      const mockEvalResult: EvalResult = {
        parsedExpression: 'hello',
        value: 'hello',
      };
      const mockConfig: BaseInspectorSectionProps[] = [
        {
          title: 'Section 1',
          fields: [
            {
              field: 'text',
              label: 'Text',
              value: '{{ something }}',
              data: {
                text: {
                  evalResult: mockEvalResult,
                },
              },
            },
          ],
        },
      ];

      const result = render(
        <BaseInspector
          name={mockName}
          type={mockType}
          config={mockConfig}
          onUpdate={mockHandleUpdate}
        />
      );

      await validateDynamicInputField(result, 'Section 1', {
        type: mockType,
        field: 'text',
        label: 'Text',
        value: '{{ something }}',
        evalResult: mockEvalResult,
        onChange: mockHandleUpdate,
      });
    });
  });
});
