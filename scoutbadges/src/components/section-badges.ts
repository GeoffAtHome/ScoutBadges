/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html, customElement, css, property } from 'lit-element';
import { PageViewElement } from './page-view-element'

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles';
import '@polymer/paper-tabs/paper-tabs'
import '@polymer/paper-tabs/paper-tab'
import './badge-cards'
import './promise-and-law'
import { Badge, BadgeData, BadgeDataType, defaultBadgeData, LawAndPromise, SectionData, SectionDataType } from '../actions/badgedata';

@customElement('section-badges')
export class SectionBadges extends PageViewElement {

    @property({ type: Object })
    private badgeData: BadgeData = defaultBadgeData

    @property({ type: String })
    private section: BadgeDataType = 'Beavers';

    @property({ type: String })
    private badgeSet: SectionDataType = 'core';

    static get styles() {
        return [
            SharedStyles,
            css`
            .tabs {
                background-color: #fff;
            }
            .link {
                display: flex;
                text-decoration: none;
                color: var(--app-secondary-color);
                align-items: center;
                justify-content: center;            
            }`
        ];
    }

    protected render() {
        return html`
        <div class="tabs">
            <paper-tabs id="tabs" attr-for-selected="name" selected="${this.badgeSet}" scrollable>
                <paper-tab name="lawAndPromise"><a class='link' href="${this.section}/lawAndPromise/">Promise, Law and Motto</a></paper-tab>
                <paper-tab name="core"><a class='link' href="${this.section}/core/">Core badges</a></paper-tab>
                <paper-tab name="challenge"><a class='link' href="${this.section}/challenge/">Challenge awards</a></paper-tab>
                <paper-tab name="activity"><a class='link' href="${this.section}/activity/">Activity badges</a></paper-tab>
                <paper-tab name="staged"><a class='link' href="${this.section}/staged/">Staged badges</a></paper-tab>
            </paper-tabs>
            <promise-and-law class="page" ?active="${this.badgeSet === 'lawAndPromise'}" name="lawAndPromise" .lawAndPromise="${this.getLawAndPromise(this.badgeData)}" .section="${this.section}" .badgeSet="${this.badgeSet}"></promise-and-law>
            <badge-cards class="page" ?active="${this.badgeSet !== 'lawAndPromise'}" .section="${this.section}" .badgeSet="${this.badgeSet}" name="core" .badges="${this.getData(this.badgeData)}"></badge-cards>
        </div>
        `;
    }

    private getLawAndPromise(badgeData: BadgeData): Array<LawAndPromise> {
        const section: BadgeDataType = this.section
        if (section !== '' && section !== 'Badges') {
            const data: SectionData = badgeData[section]
            return data.lawAndPromise
        }
        return badgeData.Beavers.lawAndPromise
    }

    private getData(badgeData: BadgeData): Array<Badge> {
        const section: BadgeDataType = this.section
        if (section !== '' && section !== 'Badges') {
            const data: SectionData = badgeData[section]

            const badgeSet: SectionDataType = this.badgeSet
            if (badgeSet !== '' && badgeSet !== 'lawAndPromise') {
                return data[badgeSet]
            }
        }
        return []
    }

}