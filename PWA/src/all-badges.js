import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import 'plastic-image/plastic-image'
import './shared-styles.js';

class AllBadges extends PolymerElement {
    static get template() {
            return html `
    <style include="shared-styles">
        :host {
            display: block;
            background-color: #fff;
        }
        plastic-image {
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
        <h2>This page downloads all the badges to allow working offline</h2>
        <div class="box">
        <dom-repeat items="[[getBadges(data)]]">
            <template>
            <a href="#/[[item.link]]">
                <plastic-image fade sizing="contain" srcset="res/[[item.name]].webp, res/[[item.name]].[[item.type]]"></plastic-image>            
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