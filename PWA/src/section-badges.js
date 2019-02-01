import {
    PolymerElement
} from '@polymer/polymer/polymer-element.js';
import {
    html
} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import './badge-cards.js';
import './shared-styles.js';

class SectionBadges extends PolymerElement {
    static get template() {
            return html `
      <style include="shared-styles">
        .tabs {
            background-color: #fff;
        }
        .link {
            display: flex;
            text-decoration: none;
            color: var(--app-secondary-color);
            align-items: center;
            justify-content: center;            
        }
    </style>
    <div class="tabs">
        <paper-tabs id="tabs" selected="[[selected]]" scrollable>
            <paper-tab><a class='link' href="#/[[section]]/core/">Core badges</a></paper-tab>
            <paper-tab><a class='link' href="#/[[section]]/challenge/">Challenge awards</a></paper-tab>
            <paper-tab><a class='link' href="#/[[section]]/activity/">Activity badges</a></paper-tab>
            <paper-tab><a class='link' href="#/[[section]]/staged/">Staged badges</a></paper-tab>
        </paper-tabs>
    </div>
    <badge-cards data="[[data]]" section="[[section]]" badgeset="[[badgeset]]"></badge-cards>
    `;

        }
        /**
         * Object describing property-related metadata used by Polymer features
         */
    static get properties() {
        return {
            data: Object,
            section: String,
            badgeset: {
                type: String,
                value: "CoreBadges"
            },
            selected: Number
        };
    }
}

customElements.define('section-badges', SectionBadges);