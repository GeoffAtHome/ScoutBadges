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
import './shared-styles.js';
import './badge-card.js';


class BadgeCards extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
        badge-card {
            width = 500px;
        }
      </style>

    <h1>[[section]] [[setName(set)]]</h1>
    <dom-repeat items="{{badges}}">
        <template>
        <badge-card card$="[[item]]"></badge-card>
        </template>
    </dom-repeat>
    `;
    }
    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            badges: Array,
            data: Object,
            section: String,
            set: String
        };
    }

    /**
     * Array of strings describing multi-property observer methods and their
     * dependant properties
     */
    static get observers() {
        return [
            'Changed(section, set)'
        ];
    }

    Changed(section, set) {
        if (this.data !== undefined) {
            this.badges = this.data[section][set];
        }
    }

    setName(set) {
        switch (set) {
            case "Corebadges":
                return "Core badges";
            case "Awards":
                return "Awards";
            case "ChallengeAwards":
                return "Challenge awards";
            case "ActivityBadges":
                return "Activity badges";
            case "StagedActivityBadges":
                return "Staged activity badges";
                break;
        }
    }
}

window.customElements.define('badge-cards', BadgeCards);