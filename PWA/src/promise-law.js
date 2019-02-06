import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import './the-badge.js';
import './shared-styles.js';

class PromiseAndLaw extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        :host {
          display: inline-block;
        }

        .box {
            display: flex;
            flex-grow: 1;
            justify-content: space-evenly;
            flex-wrap: wrap;
            flex-direction: row;
        }

        .card {
            margin: 10px;
            padding: 10px;
            color: #757575;
            border-radius: 5px;
            background-color: #fff;
            min-width: 180px;
            max-width: 425px;
        }


      </style>

      <div class="box">
        <div class='card'>
        <the-badge card="[[promise]]"></the-badge>
        </div>
        <div class='card'>
        <the-badge card="[[law]]"></the-badge>
        </div>
        <div class='card'>
        <the-badge card="[[motto]]"></the-badge>
        </div>
      </div>
    `;
    }

    // Declare properties
    static get properties() {
        return {
            promise: Object,
            law: Object,
            motto: Object,
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
        if (this.data !== undefined && ['Beavers', 'Cubs', 'Scouts', 'Explorers'].indexOf(section) !== -1 && ['lawAndPromise', 'core', 'activity', 'challenge', 'staged'].indexOf(badgeset) !== -1) {
            const card = data[section][badgeset][0];
            if (card !== undefined) {
                this.promise = card.promise;
                this.law = card.law;
                this.motto = card.motto;
            }
        }
        this.scrollIntoView();
    }
}

window.customElements.define('promise-and-law', PromiseAndLaw);