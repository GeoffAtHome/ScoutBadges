/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-image/iron-image.js'
import './shared-styles.js';

class BadgeCard extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        :host {
          display: inline-block;
        }
        iron-image {
            width: 150px;
            height: 150px;
        }
      </style>

      <a href="[[section]]/[[badgeset]]/[[card.id]]">
      <div>
          <div class="card">
              <iron-image sizing="contain" fade src="[[card.image]]"></iron-image>
                <div class="text">[[card.title]]</div>
          </div>
          <div>
      </a>
    `;
    }
    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            card: Object,
            badgeset: String,
            section: String
        };
    }
}

window.customElements.define('badge-card', BadgeCard);