/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

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

    <h1>Scout Badge Requirements v0.0.1</h1>
    <p>Welcome to Scout Badge Requirements. All the Scout badge requirements was scraped from scouts.org.uk. This app is free to use and should work offline once all the data has been cached.</p>
    `;
  }
}

window.customElements.define('welcome-page', WelcomePage);