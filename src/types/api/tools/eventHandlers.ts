export enum EventHandlerType {
  Action = 'action',
  Url = 'url',
}

export type ActionData = {
  actionName: string;
};

export type UrlData = {
  url: string;
};

export type EventHandler<T> = {
  event: T;
  type: EventHandlerType;
  data: {
    [EventHandlerType.Action]?: ActionData;
    [EventHandlerType.Url]?: UrlData;
  };
};
