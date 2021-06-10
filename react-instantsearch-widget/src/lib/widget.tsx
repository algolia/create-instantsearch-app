import { Component } from './component';
import { connect } from './connector';

import type { ElementType } from 'react';

type WidgetParams = {
  /**
   * Placeholder text for input element.
   */
  placeholder?: string;
};

export const : ElementType<WidgetParams> =
  connect(Component);
