import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class TheBadge extends PolymerElement {
    // Declare properties
    static get properties() {
        return {
            card: Object
        };
    }

    static get observers() {
        return [
            'Changed(card)'
        ];
    }

    Changed(card) {
        this.innerHTML = card;
    }

}

window.customElements.define('the-badge', TheBadge);