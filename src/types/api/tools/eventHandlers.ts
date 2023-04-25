export enum EventHandlerType {
  Action = 'action',
  Url = 'url',
}

export enum ActionMethod {
  Trigger = 'trigger',
  Reset = 'reset',
}

export type ActionData = {
  actionName: string;
  method: ActionMethod;
};

export type UrlData = {
  url: string;
  newTab: boolean;
};

export type EventHandler<T = any> = {
  _id?: string;
  event: T;
  type: EventHandlerType;
  data: {
    [EventHandlerType.Action]?: ActionData;
    [EventHandlerType.Url]?: UrlData;
  };
};
