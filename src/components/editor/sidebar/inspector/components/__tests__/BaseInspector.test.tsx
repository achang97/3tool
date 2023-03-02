import { FieldType } from '@app/types';
import {
  validateDynamicInputField,
  validateEnumField,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { BaseInspector, BaseInspectorSectionProps } from '../BaseInspector';

const mockName = 'name';
const mockHandleUpdateData = jest.fn();

jest.mock('@app/components/editor/hooks/useCodeMirrorPreview', () => ({
  useCodeMirrorPreview: jest.fn(() => ({})),
}));

jest.mock(
  '@app/components/editor/hooks/useCodeMirrorJavascriptAutocomplete',
  () => ({
    useCodeMirrorJavascriptAutocomplete: jest.fn(() => []),
  })
);

jest.mock('@app/components/editor/hooks/useEnqueueSnackbar', () => ({
  useEnqueueSnackbar: jest.fn(() => jest.fn()),
}));

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
        config={mockConfig}
        onUpdateData={mockHandleUpdateData}
      />
    );

    expect(result.getByText('Section 1')).toBeTruthy();
    expect(result.getByText('Section 2')).toBeTruthy();
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
        config={mockConfig}
        onUpdateData={mockHandleUpdateData}
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
          config={mockConfig}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateEnumField(result, 'Section 1', {
        field: 'text',
        label: 'Text',
        value: 1,
        onChange: mockHandleUpdateData,
        config: {
          options: mockOptions,
        },
      });
    });
  });

  describe('text', () => {
    it('renders text field if text data is defined', async () => {
      const mockInputType: FieldType = 'string';
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
                  type: mockInputType,
                },
              },
            },
          ],
        },
      ];

      const result = render(
        <BaseInspector
          name={mockName}
          config={mockConfig}
          onUpdateData={mockHandleUpdateData}
        />
      );

      await validateDynamicInputField(result, 'Section 1', {
        field: 'text',
        label: 'Text',
        value: '{{ something }}',
        onChange: mockHandleUpdateData,
        config: {
          type: mockInputType,
        },
      });
    });
  });
});
