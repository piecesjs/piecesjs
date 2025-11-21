export interface PieceOptions {
  stylesheets?: Array<() => Promise<any>>;
}

export interface PieceConfig {
  name: string;
  id: string;
  piece: Piece;
}

export type QueryResult<T extends Element = Element> = T | NodeList | null;

/**
 * Base class for creating web components
 */
export class Piece extends HTMLElement {
  name: string;
  cid: string;
  template: HTMLTemplateElement;
  stylesheets: Array<() => Promise<any>>;
  piecesManager: any;
  baseHTML?: string;
  updatedPiecesCount: number;
  readonly log: boolean;
  readonly properties: string;

  constructor(name?: string, options?: PieceOptions);

  // Web component lifecycle
  connectedCallback(firstHit?: boolean): void;
  disconnectedCallback(): void;
  adoptedCallback(): void;
  attributeChangedCallback(
    property: string,
    oldValue: string,
    newValue: string,
  ): void;

  // Piece lifecycle
  /**
   * Render HTML in the component
   */
  render(): string | undefined;

  /**
   * Called before mounting (before render)
   * @param firstHit - False if it's an update
   */
  premount(firstHit?: boolean): void;

  /**
   * Called after mounting (after render) - use it to add event listeners
   * @param firstHit - False if it's an update
   */
  mount(firstHit?: boolean): void;

  /**
   * Called when component is updated
   */
  update(): void;

  /**
   * Called when component is unmounted - use it to remove event listeners
   * @param update - True if called during an update
   */
  unmount(update?: boolean): void;

  // Query methods
  /**
   * Query selector shortcut - returns element, NodeList or null
   * @param query - CSS selector
   * @param context - Context element, this by default
   */
  $<T extends Element = Element>(
    query: string,
    context?: Element,
  ): QueryResult<T>;

  /**
   * Same as $ - query selector shortcut
   * @param query - CSS selector
   * @param context - Context element, this by default
   */
  dom<T extends Element = Element>(
    query: string,
    context?: Element,
  ): QueryResult<T>;

  /**
   * Query by data-dom attribute
   * @param query - Value of data-dom attribute
   * @param context - Context element, this by default
   */
  domAttr<T extends Element = Element>(
    query: string,
    context?: Element,
  ): QueryResult<T>;

  /**
   * Query selector - always returns an array
   * @param query - CSS selector
   * @param context - Context element, this by default
   */
  $All<T extends Element = Element>(query: string, context?: Element): T[];

  /**
   * Same as $All - always returns an array
   * @param query - CSS selector
   * @param context - Context element, this by default
   */
  domAll<T extends Element = Element>(query: string, context?: Element): T[];

  /**
   * Query by data-dom attribute - always returns an array
   * @param query - Value of data-dom attribute
   * @param context - Context element, this by default
   */
  domAttrAll<T extends Element = Element>(
    query: string,
    context?: Element,
  ): T[];

  /**
   * Capture all elements with data-dom attribute as object tree
   * @param context - Context element, this by default
   */
  captureTree(context?: Element): Record<string, Element[]>;

  // Event methods
  /**
   * Register event listener - the function is automatically binded to this
   * Tips: call event listeners in the mount()
   * @param type - Event type (e.g., 'click', 'mouseenter')
   * @param el - Target element(s), Document, or Window
   * @param func - Event handler function
   * @param params - Optional parameters
   */
  on<K extends keyof HTMLElementEventMap>(
    type: K,
    el: Element | Element[] | NodeList | Document | Window | null,
    func: (event: HTMLElementEventMap[K]) => void,
    params?: any,
  ): void;
  on(
    type: string,
    el: Element | Element[] | NodeList | Document | Window | null,
    func: (event: Event) => void,
    params?: any,
  ): void;

  /**
   * Remove event listener
   * Tips: remove event listeners in the unmount()
   * @param type - Event type (e.g., 'click', 'mouseenter')
   * @param el - Target element(s), Document, or Window
   * @param func - Event handler function to remove
   */
  off<K extends keyof HTMLElementEventMap>(
    type: K,
    el: Element | Element[] | NodeList | Document | Window | null,
    func: (event: HTMLElementEventMap[K]) => void,
  ): void;
  off(
    type: string,
    el: Element | Element[] | NodeList | Document | Window | null,
    func: (event: Event) => void,
  ): void;

  /**
   * Emit a custom event
   * @param eventName - Name of the custom event
   * @param el - Element to dispatch on, document by default
   * @param params - Parameters to pass in event.detail
   */
  emit(eventName: string, el?: Element | Document | Window, params?: any): void;

  /**
   * Call function of a component, from a component
   * @param func - Method name to call
   * @param args - Arguments to pass
   * @param pieceName - Name of the target component(s)
   * @param pieceId - Specific component ID (optional)
   */
  call(func: string, args?: any, pieceName?: string, pieceId?: string): void;

  // Other
  /**
   * Load stylesheets dynamically from super()
   * @param firstHit - False if called after an update
   */
  loadStyles(firstHit?: boolean): Promise<void>;

  // Private methods
  private privatePremount(firstHit?: boolean): void;
  private privateMount(firstHit?: boolean): void;
  private privateUpdate(): void;
  private privateUnmount(update?: boolean): void;
}
