import {
  InspectorEventHandlers,
  InspectorEventHandlersProps,
} from '../../common/InspectorEventHandlers';

export type ComponentEventHandlersProps = Omit<
  InspectorEventHandlersProps,
  | 'menuPosition'
  | 'placeholder'
  | 'label'
  | 'hideEventColumn'
  | 'hideColumnHeaders'
  | 'isAutosaved'
>;

export const ComponentEventHandlers = (props: ComponentEventHandlersProps) => {
  return (
    <InspectorEventHandlers
      label="Event handlers"
      placeholder="Trigger actions, control components, or call other APIs in response to component events."
      menuPosition="left"
      hideColumnHeaders={false}
      hideEventColumn={false}
      isAutosaved
      {...props}
    />
  );
};
