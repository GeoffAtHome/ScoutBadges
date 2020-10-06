/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, css } from 'lit-element';
import { PageViewElement } from './page-view-element';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';

@customElement('welcome-page')
export class WelcomePage extends PageViewElement {
    static get styles() {
        return [
            SharedStyles,
            css`
            :host {
                display: block;
                padding: 10px;
              }
              `

        ];
    }

    protected render() {
        return html`
        <h1>Scout Badge Requirements v0.1.04</h1>
        <p>Welcome to Scout Badge Requirements. All the Scout badge requirements was scraped from scouts.org.uk. This app is free to use and work's offline. Images for the badges need to be cached for them to become visible. This can be done from the "All Badges" menu option.</p>
        <p>To refresh the app to the latest badge requirements refresh the cache by (ctrl)(F5) or on a touch screen dragging the screen down.</p>
        <p>For more information contact geoff at 30thabingdon org UK</p>
        <br>
        <h1>Releases</h1>
        <ul>
        <li>0.1.04 - Remove unnessary indirection in data.</li>
        <li>0.1.03 - Update index page.</li>
        <li>0.1.02 - Check update works.</li>
        <li>0.1.00 - Switch to typescript.</li>
        <li>0.0.19 - Update badges - September 2020.</li>
        <li>0.0.18 - correct offline cache with workbox.</li>
        <li>0.0.17 - updated caching to workbox.</li>
        <li>0.0.16 - updated caching to workbox.</li>
        <li>0.0.15 - images compressed to webp for faster loading</li>
        <li>0.0.14 - promise, law and motto added</li>
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
