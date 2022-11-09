export enum RhvItemState {
  None,
  Initial,
  Initiated,
  Enter,
  Leave,
  Focus
}

export interface RhvEvent {
  onVisibilityChange: () => void;
}
