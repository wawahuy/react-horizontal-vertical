export enum RhvItemState {
  None,
  Initial,
  Enter,
  Leave,
  Focus
}

export interface RhvEvent {
  onStateChange?: (state: RhvItemState, index: number, element?: any) => void;
}
