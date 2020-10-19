/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, property, css } from 'lit-element';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import 'plastic-image/plastic-image'
import { BadgeLink, defaultBadgeLink } from '../actions/badgedata';

@customElement('all-badges')
export class AllBadges extends PageViewElement {
  @property({ type: Array })
  private allBadges: Array<BadgeLink> = defaultBadgeLink

  static get styles() {
    return [
      SharedStyles,
      css`
            plastic-image {
                width: 120px;
                height: 120px;
                margin: 5px;
            }

            .box {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
            }
            `
    ];
  }

  protected render() {
    return html`
      <h2>This page downloads all the badges to allow working offline</h2>
      <div class='box'>
        ${this.allBadges.map((item) => html`
        <a href="${item.link}"><plastic-image fade sizing="contain" srcset="res/${item.name}.webp, res/${item.name}.${item.type}">X</plastic-image></a>`)}
      </div>
    `;
  }
}
