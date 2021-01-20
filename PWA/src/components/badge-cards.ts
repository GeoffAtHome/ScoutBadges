/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, property, LitElement, css } from 'lit-element';
import { Badge, BadgeDataType, defaultBadgeArray, SectionDataType } from '../actions/badgedata';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import './badge-card';

@customElement('badge-cards')
export class BadgeCards extends LitElement {

  @property({ type: Array })
  private badges: Array<Badge> = defaultBadgeArray

  @property({ type: String })
  private section: BadgeDataType = 'Beavers';

  @property({ type: String })
  private badgeSet: SectionDataType = 'core';

  static get styles() {
    return [
      SharedStyles,
      css`
      .badges {
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }`
    ];
  }

  protected render() {
    return html`
    <div class='badges'>
    ${this.badges.map((item) => html`
        <badge-card .section="${this.section}" .badgeSet="${this.badgeSet}" .card="${item}"></badge-card>`)
      }
    </div>
      `
  }
}
