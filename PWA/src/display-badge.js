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

          padding: 5px;
        }
        iron-image {
            width: 150px;
            height: 150px;
        }
        img {
            height: auto;
        }
      </style>

      <div class="badge">
        <the-badge card="[[card]]"></the-badge>
      </div>
    `;
    }

    // Declare properties
    static get properties() {
        return {
            card: Object
        };
    }
}

window.customElements.define('display-badge', DisplayBadge);