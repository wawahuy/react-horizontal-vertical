export enum RhvItemState {
  None,
  Initial,
  Initiated,
  Enter,
  Leave,
  Focus
}

export interface RhvEvent {
  onStateChange?: (state: RhvItemState, index: number, element?: any) => void;
}
