import { Ref, useEffect, useState } from 'react';
import { blurFocus, focusComponent } from '@app/redux/features/editorSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { isInBounds } from '@app/utils/window';

export const useFocusClickedComponent = (
  containerRef?: Ref<HTMLDivElement>
) => {
  const [location, setLocation] = useState<[number, number]>();

  const { layout } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handler = ((e: PointerEvent) => {
      // @ts-ignore getBoundingClientRect is defined
      const boundingClientRect = containerRef?.current?.getBoundingClientRect();

      if (!boundingClientRect) {
        return;
      }

      if (!isInBounds(e.clientX, e.clientY, boundingClientRect)) {
        return;
      }

      const focusedComponent = layout.find(({ i }) => {
        const element = document.getElementById(i);
        return (
          element &&
          isInBounds(e.clientX, e.clientY, element.getBoundingClientRect())
        );
      });
      if (focusedComponent) {
        dispatch(focusComponent(focusedComponent.i));
      } else {
        dispatch(blurFocus());
      }

      setLocation([e.clientX, e.clientY]);
    }) as EventListenerOrEventListenerObject;

    window.addEventListener('mousedown', handler);

    return () => {
      window.removeEventListener('mousedown', handler);
    };
  }, [containerRef, layout, dispatch]);

  return location;
};
