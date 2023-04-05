import { Resource, ResourceType } from './api';

export type BaseResourceFormProps<T extends ResourceType = any> = {
  name: string;
  data: Resource['data'][T];
  onDataChange: (update: RecursivePartial<Resource['data'][T]>) => void;
  onNameChange: (name: string) => void;
};
