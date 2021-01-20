/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, property } from 'lit-element';
import { Badge, defaultBadge } from '../actions/badgedata';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import './the-badge';

@customElement('display-badge')
export class DisplayBadge extends PageViewElement {

  @property({ type: Object })
  private badge: Badge = defaultBadge;


  static get styles() {
    return [
      SharedStyles
    ];
  }

  protected render() {
    return html`
      <div>
        <the-badge card="${this.badge.info}"></the-badge>
      </div>
    `;
  }

  updated() {
    document.documentElement.scrollTop = 0;
  }
}
