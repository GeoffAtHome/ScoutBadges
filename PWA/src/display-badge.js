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
            width: 200px;
        }
      </style>

      <div id="track" class="badge" on-track="handleTrack">
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

    ready() {
        super.ready();
        this.$.track.addEventListener("touchstart", this.handleStart, false);
        this.$.track.addEventListener("touchend", this.handleEnd, false);
    }

    Changed(card) {
        this.scrollIntoView();
    }

    handleStart(e) {
        this.startX = e.changedTouches[0].pageX;
        this.startY = e.changedTouches[0].pageY;
    }

    handleEnd(e) {
        const deltaX = e.changedTouches[0].pageX - this.startX;
        const deltaY = Math.abs(e.changedTouches[0].pageY - this.startY);
        if (deltaX > 100 && deltaY < 100) {
            window.history.back();
        }
    }
}

window.customElements.define('display-badge', DisplayBadge);