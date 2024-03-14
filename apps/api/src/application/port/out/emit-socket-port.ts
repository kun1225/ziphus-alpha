export interface EmitSocketPort {
  (props: { event: string; data: any; namespace?: string }): void;
}
