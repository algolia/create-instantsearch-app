declare module 'react-instantsearch-dom' {
  import type { ElementType } from 'react';

  type ConnectorDescription = {
    displayName: string;
    /**
     * A function to filter the local state.
     */
    refine?: (props: any, searchState: any, searchResults: any) => any;
    /**
     * Function transforming the local state to a SearchParameters.
     */
    getSearchParameters?: (
      searchParameters: any,
      props: any,
      searchState: any
    ) => any;
    /**
     * Metadata of the widget (for current refinements).
     */
    getMetadata?: (props: any, searchState: any) => any;
    /**
     * Hook after the state has changed.
     */
    transitionState?: (
      props: any,
      prevSearchState: any,
      nextSearchState: any
    ) => any;
    /**
     * Transform the state into props passed to the wrapped component.
     * Receives (props, widgetStates, searchState, metadata) and returns the local state.
     */
    getProvidedProps: (props: any, searchState: any, searchResults: any) => any;
    /**
     * Receives props and return the id that will be used to identify the widget.
     */
    getId?: (...args: any[]) => string;
    /**
     * Hook when the widget will unmount. Receives (props, searchState) and return a cleaned state.
     */
    cleanUp?: (props: any, searchState: any, context: any) => any;
    searchForFacetValues?: (...args: any[]) => any;
    shouldComponentUpdate?: (...args: any[]) => boolean;
  };

  export const createConnector: (
    connectorDesc: ConnectorDescription
  ) => (component: ElementType) => ElementType;
}
