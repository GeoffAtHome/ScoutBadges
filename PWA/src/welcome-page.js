import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';


class WelcomePage extends PolymerElement {
    static get template() {
        return html `
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
      </style>
    <h1>Scout Badge Requirements v0.0.13</h1>
    <p>Welcome to Scout Badge Requirements. All the Scout badge requirements was scraped from scouts.org.uk. This app is free to use and work's offline. Images for the badges need to be cached for them to become visible. This can be done from the "All Badges" menu option.</p>
    <p>To refresh the app to the latest badge requirements refresh the cache by (ctrl)(F5) or on a touch screen dragging the screen down.</p>
    <p>For more information contact geoff at 30thabingdon org UK</p>
    <br>
    <h1>Releases</h1>
    <ul>
      <li>0.0.13 - use paper-tabs instead of vaadin-tabs</li>
      <li>0.0.12 - use-hash-route in URL to address searching and sharing</li>
      <li>0.0.11 - add share link for Android and mailto for other platforms</li>
      <li>0.0.10 - remember where the app was closed for reopening</li>
      <li>0.0.9 - fixed patrol leader/sixer second</li>
      <li>0.0.8 - added touch support for back/forward</li>
    </ul>
    `;
    }
}

window.customElements.define('welcome-page', WelcomePage);