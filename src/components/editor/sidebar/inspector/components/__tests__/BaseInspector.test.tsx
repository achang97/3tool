import { FieldType } from '@app/types';
import userEvent from '@testing-library/user-event';
import {
  validateTextField,
  validateEnumField,
  validateSwitchField,
  validateSelectField,
} from '@tests/testers/inspector';
import { render } from '@tests/utils/renderWithContext';
import { BaseInspector, BaseInspectorSectionProps } from '../BaseInspector';

const mockName = 'name';
const mockHandleDataChange = jest.fn();

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
        onChange={mockHandleDataChange}
      />
    );
    expect(result.queryByText('Text')).toBeNull();
    expect(result.queryByText('hello')).toBeNull();
  });

  describe('section', () => {
    it('renders section titles', () => {
      const mockConfig: BaseInspectorSectionProps[] = [
        { title: 'Section 1', fields: [] },
        { title: 'Section 2', fields: [] },
      ];

      const result = render(
        <BaseInspector
          name={mockName}
          config={mockConfig}
          onChange={mockHandleDataChange}
        />
      );

      expect(result.getByText('Section 1')).toBeTruthy();
      expect(result.getByText('Section 2')).toBeTruthy();
    });

    it('renders sections without titles', () => {
      const mockConfig: BaseInspectorSectionProps[] = [
        {
          fields: [
            {
              field: 'text',
              component: <div>Custom Component</div>,
            },
          ],
        },
      ];

      const result = render(
        <BaseInspector
          name={mockName}
          config={mockConfig}
          onChange={mockHandleDataChange}
        />
      );

      expect(result.getByText('Custom Component')).toBeTruthy();
    });
  });

  describe('custom component', () => {
    it('renders custom component', async () => {
      const mockConfig: BaseInspectorSectionProps[] = [
        {
          title: 'Section 1',
          fields: [
            {
              field: 'text',
              component: <div>Custom Component</div>,
            },
          ],
        },
      ];

      const result = render(
        <BaseInspector
          name={mockName}
          config={mockConfig}
          onChange={mockHandleDataChange}
        />
      );

      expect(result.getByText('Custom Component')).toBeTruthy();
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
          onChange={mockHandleDataChange}
        />
      );

      await validateTextField(result, 'Section 1', {
        field: 'text',
        label: 'Text',
        value: '{{ something }}',
        onChange: mockHandleDataChange,
        data: {
          type: mockInputType,
        },
      });
    });

    it('renders placeholder text', () => {
      const mockPlaceholder = 'placeholder';
      const mockConfig: BaseInspectorSectionProps[] = [
        {
          title: 'Section 1',
          fields: [
            {
              field: 'text',
              label: 'Text',
              value: '',
              data: {
                text: {
                  type: 'string',
                  placeholder: mockPlaceholder,
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
          onChange={mockHandleDataChange}
        />
      );

      expect(result.getByText(mockPlaceholder)).toBeTruthy();
    });
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
              field: 'enum',
              label: 'Enum',
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
          onChange={mockHandleDataChange}
        />
      );

      await validateEnumField(result, 'Section 1', {
        field: 'enum',
        label: 'Enum',
        value: 1,
        onChange: mockHandleDataChange,
        data: {
          options: mockOptions,
        },
      });
    });
  });

  describe('select', () => {
    it('renders select', async () => {
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
              field: 'select',
              label: 'Select',
              value: 1,
              data: {
                select: {
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
          onChange={mockHandleDataChange}
        />
      );

      await validateSelectField(result, 'Section 1', {
        field: 'select',
        label: 'Select',
        value: 1,
        onChange: mockHandleDataChange,
        data: {
          options: mockOptions,
        },
      });
    });

    it('renders placeholder text', () => {
      const mockPlaceholder = 'placeholder';
      const mockConfig: BaseInspectorSectionProps[] = [
        {
          title: 'Section 1',
          fields: [
            {
              field: 'select',
              label: 'Select',
              value: '',
              data: {
                select: {
                  options: [],
                  placeholder: mockPlaceholder,
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
          onChange={mockHandleDataChange}
        />
      );

      expect(result.getByText(mockPlaceholder)).toBeTruthy();
    });

    it('disables select', async () => {
      const mockConfig: BaseInspectorSectionProps[] = [
        {
          title: 'Section 1',
          fields: [
            {
              field: 'select',
              label: 'Select',
              value: '',
              data: {
                select: {
                  options: [],
                  disabled: true,
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
          onChange={mockHandleDataChange}
        />
      );

      await userEvent.click(result.getByLabelText('Select'));
      expect(result.queryByRole('option')).toBeNull();
    });
  });

  describe('switch', () => {
    it('renders switch', async () => {
      const mockConfig: BaseInspectorSectionProps[] = [
        {
          title: 'Section 1',
          fields: [
            {
              field: 'switch',
              label: 'Switch',
              value: false,
              data: {
                switch: {},
              },
            },
          ],
        },
      ];

      const result = render(
        <BaseInspector
          name={mockName}
          config={mockConfig}
          onChange={mockHandleDataChange}
        />
      );

      await validateSwitchField(result, 'Section 1', {
        field: 'switch',
        label: 'Switch',
        value: false,
        onChange: mockHandleDataChange,
        data: {},
      });
    });
  });
});
