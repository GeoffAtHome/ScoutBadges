import {
    PolymerElement
} from '@polymer/polymer/polymer-element.js';
import {
    html
} from '@polymer/polymer/lib/utils/html-tag.js';
import '@vaadin/vaadin-tabs/vaadin-tabs.js';
import './badge-cards.js';
import './shared-styles.js';

class SectionBadges extends PolymerElement {
    static get template() {
        return html `
    <vaadin-tabs id="tabs" selected="[[selected]]">
        <vaadin-tab><a href="/[[section]]/core/">Core badges</a></vaadin-tab>
        <vaadin-tab><a href="/[[section]]/challenge/">Challenge awards</a></vaadin-tab>
        <vaadin-tab><a href="/[[section]]/activity/">Activity badges</a></vaadin-tab>
        <vaadin-tab><a href="/[[section]]/staged/">Staged badges</a></vaadin-tab>
    </vaadin-tabs>
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