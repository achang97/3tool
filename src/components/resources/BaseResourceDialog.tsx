import { ApiErrorResponse, Resource, ResourceType } from '@app/types';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FC, FormEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { BaseResourceFormProps } from '@app/types/resources';
import { RESOURCE_CONFIGS } from '@app/constants';
import { ApiErrorMessage } from '../common/ApiErrorMessage';
import { SmartContractForm } from './contracts/SmartContractForm';
import { AbiForm } from './abi/AbiForm';
import { validateResource } from './utils/validate';

type BaseResourceDialogProps = {
  title: string;
  resource: Resource;
  error?: ApiErrorResponse['error'];
  isOpen: boolean;
  isBackButtonVisible: boolean;
  isLoading?: boolean;
  onChange: (update: RecursivePartial<Resource>) => void;
  onSubmit: () => void;
  onClose: () => void;
  testId?: string;
};

const RESOURCE_FORM_MAP: {
  [KeyType in ResourceType]: FC<BaseResourceFormProps<KeyType>>;
} = {
  [ResourceType.SmartContract]: SmartContractForm,
  [ResourceType.Abi]: AbiForm,
};

const FORM_ID = 'resource-form';

export const BaseResourceDialog = ({
  title,
  isOpen,
  isBackButtonVisible,
  resource,
  onChange,
  onSubmit,
  onClose,
  error,
  isLoading,
  testId,
}: BaseResourceDialogProps) => {
  const errorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView();
    }
  }, [error]);

  const isFormComplete = useMemo(() => {
    return validateResource(resource);
  }, [resource]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  const handleNameChange = useCallback(
    (name: string) => {
      onChange({ name });
    },
    [onChange]
  );

  const handleDataChange = useCallback(
    (update: RecursivePartial<ValueOf<Resource['data']>>) => {
      onChange({ data: { [resource.type]: update } });
    },
    [onChange, resource.type]
  );

  const typedResourceForm = useMemo(() => {
    const TypedResourceForm = RESOURCE_FORM_MAP[resource.type];
    return (
      <TypedResourceForm
        name={resource.name}
        // @ts-ignore We know that this accesses the correct data key
        data={resource.data[resource.type]}
        onNameChange={handleNameChange}
        onDataChange={handleDataChange}
      />
    );
  }, [resource, handleNameChange, handleDataChange]);

  return (
    <Dialog onClose={onClose} open={isOpen} fullWidth data-testid={testId}>
      <DialogTitle>
        {title} | {RESOURCE_CONFIGS[resource.type].label}
      </DialogTitle>
      <DialogContent>
        <form id={FORM_ID} onSubmit={handleSubmit}>
          {typedResourceForm}
        </form>
        {error && <ApiErrorMessage sx={{ marginTop: 2 }} error={error} ref={errorRef} />}
      </DialogContent>
      <DialogActions>
        {isBackButtonVisible && (
          <Button color="secondary" onClick={onClose}>
            Go back
          </Button>
        )}
        <LoadingButton type="submit" form={FORM_ID} loading={isLoading} disabled={!isFormComplete}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
