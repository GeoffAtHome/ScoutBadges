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
    <vaadin-tabs id="tabs" selected="{{selected}}">
        <vaadin-tab >Core badges</vaadin-tab>
        <vaadin-tab>Challenge awards</vaadin-tab>
        <vaadin-tab>Activity badges</vaadin-tab>
        <vaadin-tab>Staged badges</vaadin-tab>
    </vaadin-tabs>
    <badge-cards data="[[data]]" section="[[section]]" set="[[set]]"></badge-cards>
    `;

    }
    /**
     * Object describing property-related metadata used by Polymer features
     */
    static get properties() {
        return {
            data: Object,
            section: String,
            set: {
                type: String,
                value: "CoreBadges"
            },
            selected: Number
        };
    }


    /**
     * Array of strings describing multi-property observer methods and their
     * dependant properties
     */
    static get observers() {
        return [
            'SelectedChanged(selected)'
        ];
    }

    SelectedChanged(selected) {
        let set = "core";
        switch (selected) {
            case 0:
                set = "core";
                break;
            case 1:
                set = "challenge";
                break;
            case 2:
                set = "activity";
                break;
            case 3:
                set = "staged";
                break;
        }
        this.dispatchEvent(new CustomEvent("change-set", {
            bubbles: true,
            composed: true,
            detail: set
        }));
    }
}

customElements.define('section-badges', SectionBadges);