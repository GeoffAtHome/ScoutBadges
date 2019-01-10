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
            'Changed(card)'
        ];
    }

    Changed(card) {
        this.scrollIntoView();
    }
}

window.customElements.define('display-badge', DisplayBadge);