import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import 'plastic-image/plastic-image'
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
        plastic-image {
            width: 100%;
            height: 165px;
        }
      </style>

        <a href="#/[[section]]/[[badgeset]]/[[card.id]]">
            <plastic-image lazy-load fade sizing="contain" srcset="res/[[card.image]].webp, res/[[card.image]].[[card.imageType]]"></plastic-image>            
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