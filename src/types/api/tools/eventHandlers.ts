export enum EventHandlerType {
  Action = 'action',
  Url = 'url',
}

export type ActionData = {
  actionId: string;
};

export type UrlData = {
  url: string;
};

export type EventHandler<T = unknown> = {
  event: T;
  type: EventHandlerType;
  data: {
    [EventHandlerType.Action]?: ActionData;
    [EventHandlerType.Url]?: UrlData;
  };
};
