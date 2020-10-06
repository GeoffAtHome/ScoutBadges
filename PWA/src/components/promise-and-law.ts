/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css, html, customElement, LitElement, property } from 'lit-element';
import { defaultLawAndPromise, LawAndPromise } from '../actions/badgedata';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import './the-badge';

@customElement('promise-and-law')
export class PromiseAndLaw extends LitElement {

  @property({ type: Object })
  private lawAndPromise: LawAndPromise = defaultLawAndPromise

  static get styles() {
    return [
      SharedStyles,
      css`
        :host {
          display: inline-block;
        }

        .box {
            display: flex;
            flex-grow: 1;
            justify-content: space-evenly;
            flex-wrap: wrap;
            flex-direction: row;
        }

        .card {
            margin: 10px;
            padding: 10px;
            color: #757575;
            border-radius: 5px;
            background-color: #fff;
            min-width: 180px;
            max-width: 425px;
        }
      `
    ];
  }

  protected render() {
    return html`
      <div class="box">
        <div class='card'>
        <the-badge .card="${this.lawAndPromise.promise}"></the-badge>
        </div>
        <div class='card'>
        <the-badge .card="${this.lawAndPromise.law}"></the-badge>
        </div>
        <div class='card'>
        <the-badge .card="${this.lawAndPromise.motto}"></the-badge>
        </div>
      </div>
    `;
  }
}
