import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import {} from '@polymer/polymer/lib/elements/dom-repeat.js';
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
            'Changed(data, section, badgeset)'
        ];
    }

    Changed(data, section, badgeset) {
        if (data !== undefined && ['Beavers', 'Cubs', 'Scouts', 'Explorers'].indexOf(section) !== -1 && ['lawAndPromise', 'core', 'activity', 'challenge', 'staged'].indexOf(badgeset) !== -1) {
            this.badges = this.data[section][badgeset];
        }
    }
}

window.customElements.define('badge-cards', BadgeCards);