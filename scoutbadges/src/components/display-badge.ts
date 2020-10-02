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
import { Badge, BadgeData, BadgeDataType, defaultBadgeData, SectionData, SectionDataType } from '../actions/badgedata';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import './the-badge';

@customElement('display-badge')
export class DisplayBadge extends PageViewElement {

  @property({ type: Object })
  private badgeData: BadgeData = defaultBadgeData

  @property({ type: String })
  private section: BadgeDataType = 'Beavers';

  @property({ type: String })
  private badgeSet: SectionDataType = 'core';

  @property({ type: String })
  private badge = '';


  static get styles() {
    return [
      SharedStyles
    ];
  }

  protected render() {
    return html`
      <div>
        <the-badge card="${this.getTheCard(this.badgeData)}"></the-badge>
      </div>
    `;
  }

  private getTheCard(badgeData: BadgeData) {
    const section: BadgeDataType = this.section
    if (section !== '' && section !== 'Badges') {
      const data: SectionData = badgeData[section]

      const badgeSet: SectionDataType = this.badgeSet
      if (badgeSet !== '' && badgeSet !== 'lawAndPromise') {
        const badges: Array<Badge> = data[badgeSet]
        const badge = badges.find(item => item.id === this.badge)
        return badge?.info
      }
    }
    return []
  }
}
