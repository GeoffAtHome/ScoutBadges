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
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            text-align: center;
            margin: 10px;
            padding: 10px;
            min-width: 180px;
            max-width: 425px;
            color: #757575;
            border-radius: 5px;
            background-color: #fff;
            word-wrap: break-word;
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
        iron-image {
            width: 100%;
            height: 165px;
        }
      </style>

        <a href="[[section]]/[[badgeset]]/[[card.id]]">
            <iron-image sizing="contain" fade src="[[card.image]]"></iron-image>
            <div>[[card.title]]</div>
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