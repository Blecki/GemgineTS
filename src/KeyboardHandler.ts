export class KeyState {
  constructor(
    public readonly key: string,
    public readonly code: string,
    public readonly shift: boolean,
    public readonly ctrl: boolean,
    public readonly alt: boolean
  ) {}
}

export class KeyboardHandler {
  private keyQueue: KeyState[] = [];
  private activeKeys: Set<string> = new Set();

  constructor(element: HTMLElement | Window = window) {
    // Note: TabIndex is required on Canvas if listening to the element directly
    element.addEventListener('keydown', (e: any) => {
      const state = new KeyState(e.key, e.code, e.shiftKey, e.ctrlKey, e.altKey);
      this.keyQueue.push(state);
      this.activeKeys.add(e.code);
      
      // Prevent scrolling/browser shortcuts if needed
      // e.preventDefault(); 
    });

    element.addEventListener('keyup', (e: any) => {
      this.activeKeys.delete(e.code);
    });
  }

  public consumeEvents(): KeyState[] {
    const events = [...this.keyQueue];
    this.keyQueue = [];
    return events;
  }

  public isKeyDown(code: string): boolean {
    return this.activeKeys.has(code);
  }
}