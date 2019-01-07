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
        <style is="custom-style">
        :host {
          padding: 10px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        }

        </style>
        <dom-repeat items="[[badges]]">
            <template>
                <badge-card card="[[item]]" badgeset="[[badgeset]]" section="[[section]]"></badge-card>
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
            badgeset: String
        };
    }

    /**
     * Array of strings describing multi-property observer methods and their
     * dependant properties
     */
    static get observers() {
        return [
            'Changed(section, badgeset)'
        ];
    }

    Changed(section, badgeset) {
        if (this.data !== undefined && ['Beavers', 'Cubs', 'Scouts', 'Explorers'].indexOf(section) !== -1 && ['core', , 'activity', 'challenge', 'staged'].indexOf(badgeset) !== -1) {
            this.badges = this.data[section][badgeset];
        }
        let title = badgeset;
        this.dispatchEvent(new CustomEvent("display-title", {
            bubbles: true,
            composed: true,
            detail: "    " + title
        }));
    }

    setName(badgeset) {
        switch (badgeset) {
            case "core":
                return "Core badges";
            case "challenge":
                return "Challenge awards";
            case "activity":
                return "Activity badges";
            case "staged":
                return "Staged activity badges";
                break;
        }
    }
}

window.customElements.define('badge-cards', BadgeCards);