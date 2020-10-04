/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css, property, PropertyValues, customElement, query } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { connect } from 'pwa-helpers/connect-mixin';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';
import { updateMetadata } from 'pwa-helpers/metadata';

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState
} from '../actions/app';

// These are the elements needed by this element.
import '@material/mwc-top-app-bar'
import '@material/mwc-drawer'
import '@material/mwc-button'
import '@pwabuilder/pwainstall'
import '@pwabuilder/pwaupdate'
import { menuIcon, arrowBackIcon, shareIcon } from './my-icons';
import './snack-bar';
import { Badge, BadgeData, BadgeDataType, defaultBadge, defaultBadgeData, SectionData, SectionDataType } from '../actions/badgedata';

@customElement('my-app')
export class MyApp extends connect(store)(LitElement) {
  @query('#track')
  private track: any;

  @property({ type: String })
  appTitle = '';

  @property({ type: String })
  private _page = '';

  @property({ type: String })
  private _section: BadgeDataType = 'Beavers';

  @property({ type: String })
  private _badgeSet: SectionDataType = 'core';

  @property({ type: String })
  private _badge = '';

  @property({ type: Boolean })
  private _drawerOpened = false;

  @property({ type: Boolean })
  private _snackbarOpened = false;

  @property({ type: Boolean })
  private _offline = false;

  @property({ type: Object })
  private badgeData: BadgeData = defaultBadgeData

  private startX: number = 0;
  private startY: number = 0;

  static get styles() {
    return [
      css`
        :host {
          display: block;

          --app-primary-color: #e91e63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;
          --mdc-drawer-width: 150px;
          --mdc-theme-primary:	 #6200ee'
        }

        .parent {
          display: grid;
          grid-template-rows:  1fr auto;
        }
        
       .content {
          display: grid;
          grid-template-columns: minmax(0px, 0%) 1fr;
        }

        [main-title] {
          font-family: 'Pacifico';
          text-transform: lowercase;
          font-size: 30px;
          /* In the narrow layout, the toolbar is offset by the width of the
          drawer button, and the text looks not centered. Add a padding to
          match that button */
          padding-right: 44px;
        }

        .toolbar-list {
        }

        .toolbar-list > a {
          display: grid;
          grid-template-rows: auto;
          line-height: 40px;
          text-decoration: none;
          font-weight: bold;
          padding: 8px;
        }

        .toolbar-list > a[selected] {
          background-color: var(--mdc-theme-primary);
        }

        .menu-btn, .btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
          overflow: auto;
          margin-top: 60px;
          margin-bottom: 60px;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        .img-menu {
          display: block;
          max-width: 106px;
          max-height: 30px;
          width: auto;
          height: auto;
        }

        .img-welcome {
          display: inline;
          max-width: 40px;
          max-height: 30px;
          width: auto;
          height: auto;
        }       
      `
    ];
  }

  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
    <mwc-drawer hasHeader type="dismissible" .open="${this._drawerOpened}">
      <span slot="title"><img class='img-welcome' src='../../images/welcome.png'>Menu</span>
      <div>
        <nav class="toolbar-list">
          <a ?selected="${this._page === 'welcome'}" href="/welcome">Welcome</a>
          <a ?selected="${this._section === 'Beavers'}" href="/Beavers/${this._badgeSet}"><img class='img-menu' src='../../images/beavers.png'></a>
          <a ?selected="${this._section === 'Cubs'}" href="/Cubs/${this._badgeSet}"><img class='img-menu' src='../../images/cubs.png'></a>
          <a ?selected="${this._section === 'Scouts'}" href="/Scouts/${this._badgeSet}"><img class='img-menu' src='../../images/scouts.png'></a>
          <a ?selected="${this._section === 'Explorers'}" href="/Explorers/${this._badgeSet}"><img class='img-menu' src='../../images/explorers.png'></a>
          <a ?selected="${this._page === 'allbadges'}" href="/allbadges">All Badges</a>
        </nav>
      </div>
      <!-- Header -->
      <div slot="appContent">
        <mwc-top-app-bar centerTitle>
          <div slot="title">${this.appTitle}</div>
          <mwc-button title="Menu" slot="navigationIcon" @click="${this._menuButtonClicked}">${menuIcon}</mwc-button> 
          <mwc-button class='btn' title="Share" slot="actionItems" @click="${this._ShareButtonClicked}">${shareIcon}</mwc-button>
          <mwc-button class='btn' title="Back" slot="actionItems" @click="${this._BackButtonClicked}">${arrowBackIcon}</mwc-button>
        </mwc-top-app-bar>
        <div>
          <main id="track" role="main">
            <welcome-page class="page" ?active="${this._page === 'welcome'}">Welcome</welcome-page>
            <section-badges class="page" ?active="${this._page === 'section'}" .badgeData="${this.badgeData}" .section="${this._section}" .badgeSet="${this._badgeSet}"></section-badges>
            <display-badge class="page" ?active="${this._page === 'badge'}" .badge="${this.getTheBadge(this.badgeData, this._section, this._badgeSet, this._badge)}"></display-badge>
            <all-badges class="page" ?active="${this._page === 'allbadges'}" .allBadges="${this.badgeData.Badges}"></all-badges>
            <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
          </main>
        </div>
      </div>
    </mwc-drawer>
      <snack-bar ?active="${this._snackbarOpened}">
        You are now ${this._offline ? 'offline' : 'online'}.
      </snack-bar>
      <pwa-install></pwa-install>
      <pwa-update offlineToastDuration="0" swpath="pwabuilder-sw"></pwa-update>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  protected firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`,
      () => store.dispatch(updateDrawerState(false)));

    this.track.addEventListener("touchstart", this.handleStart, false);
    this.track.addEventListener("touchend", this.handleEnd, false);

    this.getData()
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  private _menuButtonClicked() {
    store.dispatch(updateDrawerState(!this._drawerOpened));
  }

  private async getData() {

    const datamodule = <any>await import('../../res/data');
    this.badgeData = datamodule.badgeData
  }

  stateChanged(state: RootState) {
    this._page = state.app!.page;
    this._offline = state.app!.offline;
    this._snackbarOpened = state.app!.snackbarOpened;
    this._drawerOpened = state.app!.drawerOpened;

    this._section = state.app!.section;
    this._badgeSet = state.app!.badgeSet;
    this._badge = state.app!.badge;

  }

  handleStart(e: TouchEvent) {
    this.startX = e.changedTouches[0].pageX;
    this.startY = e.changedTouches[0].pageY;

    return true;
  }

  handleEnd(e: TouchEvent) {
    const deltaX = e.changedTouches[0].pageX - this.startX;
    const deltaY = Math.abs(e.changedTouches[0].pageY - this.startY);
    if (deltaX > 100 && deltaY < 100) {
      window.history.back();
    } else if (deltaX < -100 && deltaY < 100) {
      window.history.forward();
    }
  }

  _ShareButtonClicked(_event: Event) {
    // Work out where we our to compose the correct content to share
    let title = "";
    let text = "";
    let link = location.href;

    switch (this._page) {
      case 'Welcome':
      default:
        title = "Welcome to Scout Badge Requirements";
        text = "You can use the following link to find the requirements for your Scout Badges"
        break;

      case 'section':
      case 'Beavers':
      case 'Cubs':
      case 'Scouts':
      case 'Explorers':
        if (this._badgeSet == 'lawAndPromise') {
          title = this._section + " " + this.title;
          text = "You can use the following link for the " + title;
        } else {
          title = this._section + " " + this.title + " badge requirements";
          text = "You can use the following link to find the requirements for your " + title;
        }
        break;

      case 'Badge':
        const badge = this.getTheBadge(this.badgeData, this._section, this._badgeSet, this._badge);
        title = this._section + " " + this._badgeSet + " " + badge.title;
        text = "You can use the following link to find the requirements for your Scout Badges"
        break;

      case 'AllBadges':
        title = "Welcome to Scout Badge Requirements";
        text = "All the Scouts badges can be found from the following link"
        break;
    }

    if ('share' in navigator) {
      navigator.share({
        title: title,
        text: text,
        url: link,
      })
    } else {
      title = title.replace(/ /g, "%20") + "&body=" + text.replace(/ /g, "%20") + ": \n\r\n\r" + link;
      location.href = 'mailto:?subject=' + title;
    }
  }

  _BackButtonClicked(_event: Event) {
    window.history.back();
  }

  private getTheBadge(badgeData: BadgeData, section: BadgeDataType, badgeSet: SectionDataType, badgeId: string): Badge {
    if (section !== '' && section !== 'Badges') {
      const data: SectionData = badgeData[section]
      if (badgeSet !== '' && badgeSet !== 'lawAndPromise') {
        const badges: Array<Badge> = data[badgeSet]
        const badge = badges.find(item => item.id === badgeId)
        if (badge != undefined) {
          return badge
        }
      }
    }
    return defaultBadge
  }

}
