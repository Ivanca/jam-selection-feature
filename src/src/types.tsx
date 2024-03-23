export interface SelectionWithTimeRange {
  text: string;
  anchorNode: Node;
  anchorOffset: number;
  date: Date;
  duration: number;
}

export interface TextSelection {
  anchorNode: Node | null;
  anchorOffset: number;
  focusNode: Node | null;
  focusOffset: number;
  isCollapsed: boolean;
  rangeCount: number;
  type: string;
}
