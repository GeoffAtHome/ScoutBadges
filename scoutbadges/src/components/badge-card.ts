/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, property, LitElement, css } from 'lit-element';
import { Badge, BadgeDataType, SectionDataType } from '../actions/badgedata';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import 'plastic-image/plastic-image'

@customElement('badge-card')
export class BadgeCard extends LitElement {

    @property({ type: Object })
    private card: Badge = {
        id: "",
        title: "",
        image: "",
        imageType: "",
        info: ""
    }

    @property({ type: String })
    private section: BadgeDataType = 'Beavers';

    @property({ type: String })
    private badgeSet: SectionDataType = 'core';


    static get styles() {
        return [
            SharedStyles,
            css`
            :host {
                text-align: center;
                margin: 10px;
                padding: 10px;
                min-width: 180px;
                max-width: 425px;
                color: #757575;
                border-radius: 5px;
                background-color: #fff;
                word-wrap: break-word;
                box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
            }
            plastic-image {
                width: 100%;
                height: 165px;
            }
        `
        ];
    }

    protected render() {
        return html`
        <a href="${this.section}/${this.badgeSet}/${this.card.id}">
            <plastic-image lazy-load fade sizing="contain" srcset="res/${this.card.image}.webp, res/${this.card.image}.${this.card.imageType}"></plastic-image>            
            <div>${this.card.title}</div>
        </a>
        `
    }
}
