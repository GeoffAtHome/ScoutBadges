import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import './the-badge.js';
import './shared-styles.js';

class DisplayBadge extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        :host {
          display: inline-block;
        margin: 10px;
        padding: 10px;
        color: #757575;
        border-radius: 5px;
        background-color: #fff;
        }
        img {
            height: auto;
            width: 200px;
            display: block;
        }

      </style>

      <div>
        <the-badge card="[[card]]"></the-badge>
      </div>
    `;
    }

    // Declare properties
    static get properties() {
        return {
            card: Object,
            data: Object,
            section: String,
            badgeset: String,
            badge: String,
            startX: Number,
            startY: Number
        };
    }

    /**
     * Array of strings describing multi-property observer methods and their
     * dependant properties
     */
    static get observers() {
        return [
            'Changed(data, section, badgeset, badge)'
        ];
    }

    Changed(data, section, badgeset, badge) {
        if (data !== undefined && ['Beavers', 'Cubs', 'Scouts', 'Explorers'].indexOf(section) !== -1 && ['lawAndPromise', 'core', 'activity', 'challenge', 'staged'].indexOf(badgeset) !== -1 && badge !== '') {
            const card = data[section][badgeset].filter((item) => item.id === badge)[0];
            if (card !== undefined) {
                this.card = card.info;
            }
            this.scrollIntoView();
        }
    }
}

window.customElements.define('display-badge', DisplayBadge);