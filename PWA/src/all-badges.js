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

class AllBadges extends PolymerElement {
    static get template() {
        return html `
    <style include="shared-styles">
        :host {
            display: block;
            background-color: #fff;
        }
        iron-image {
            padding: 5px;
            width: 100px;
            height: 100px;
        }
        .box {
            display: flex;
            flex-grow: 1;
            justify-content: space-evenly;
            flex-wrap: wrap;
            flex-direction: row;
        }
    </style>

    <div>
        <h2>This page is for downloading all the badges for working offline</h2>
        <div class="box">
        <dom-repeat items="[[getBadges(data)]]">
            <template>
            <a href="[[item.link]]">
                <iron-image sizing="contain" fade src="res/[[item.url]]"></iron-image>
            </a>
            </template>
        </dom-repeat>
        </div>
    <div>
    `;
    }
    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            data: Object
        };
    }
    getBadges(data) {
        return data['Badges'];
    }
}

window.customElements.define('all-badges', AllBadges);