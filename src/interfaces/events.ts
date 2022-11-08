export enum VisibleState {
  Enter = 0x001,
  Leave = 0x010,
  Focus = 0x100
}

export interface RhvEvent {
  onVisibilityChange: (state: VisibleState) => void;
}
