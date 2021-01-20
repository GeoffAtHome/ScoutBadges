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
import '@material/mwc-tab-bar'
import '@material/mwc-tab'
import './badge-cards'
import './promise-and-law'
import { Badge, BadgeData, BadgeDataType, defaultBadgeData, LawAndPromise, SectionData, SectionDataType } from '../actions/badgedata';
import { updateBadgeSet } from '../actions/app';
import { store } from '../store';


function onClickTab(e: any) {
    const page = e.target.getAttribute('href')
    // window.location.replace(`/${page}`)
    const parts = page.split('/')
    store.dispatch(updateBadgeSet(parts[1]));
    window.history.pushState(null, '', page);
}

function getTabIndex(tab: string) {
    const tabs = ["lawAndPromise", "core", "challenge", "activity", "staged"]
    const index = tabs.findIndex((item) => item === tab)
    return index
}

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
            }

            mwc-tab {
                text-decoration: none;
            }
            `

        ];
    }

    protected render() {
        return html`
        <div class="tabs">
            <mwc-tab-bar id="tabs" activeIndex="${getTabIndex(this.badgeSet)}">
                <mwc-tab label="Promise, Law and Motto" name="lawAndPromise" href="${this.section}/lawAndPromise/" @click=${onClickTab}></mwc-tab>
                <mwc-tab label="Core badges" name="core" href="${this.section}/core/" @click=${onClickTab}></mwc-tab>
                <mwc-tab label="Challenge awards" name="challenge" href="${this.section}/challenge/" @click=${onClickTab}></mwc-tab>
                <mwc-tab label="Activity badges" name="activity" href="${this.section}/activity/" @click=${onClickTab}></mwc-tab>
                <mwc-tab label="Staged badges" name="staged" href="${this.section}/staged/" @click=${onClickTab}></mwc-tab>
            </mwc-tab-bar>
            <promise-and-law class="page" ?active="${this.badgeSet === 'lawAndPromise'}" name="lawAndPromise" .lawAndPromise="${this.getLawAndPromise(this.badgeData)}" .section="${this.section}" .badgeSet="${this.badgeSet}"></promise-and-law>
            <badge-cards class="page" ?active="${this.badgeSet !== 'lawAndPromise'}" .section="${this.section}" .badgeSet="${this.badgeSet}" name="core" .badges="${this.getData(this.badgeData)}"></badge-cards>
        </div>
        `;
    }

    updated() {
        document.documentElement.scrollTop = 0;
    }


    private getLawAndPromise(badgeData: BadgeData): LawAndPromise {
        const { section } = this
        if (section !== '' && section !== 'Badges') {
            const data: SectionData = badgeData[section]
            return data.lawAndPromise
        }
        return badgeData.Beavers.lawAndPromise
    }

    private getData(badgeData: BadgeData): Array<Badge> {
        const { section } = this
        if (section !== '' && section !== 'Badges') {
            const data: SectionData = badgeData[section]

            const { badgeSet } = this
            if (badgeSet !== '' && badgeSet !== 'lawAndPromise') {
                return data[badgeSet]
            }
        }
        return []
    }
}