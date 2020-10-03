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
import '@pwabuilder/pwainstall'
import '@pwabuilder/pwaupdate'

// This element is connected to the Redux store.
import { store, RootState } from '../store';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState
} from '../actions/app';

// The following line imports the type only - it will be removed by tsc so
// another import for app-drawer is required below.
import { AppDrawerElement } from '@polymer/app-layout/app-drawer/app-drawer';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/app-layout/app-toolbar/app-toolbar';
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

          --app-drawer-width: 256px;

          --app-primary-color: #e91e63;
          --app-secondary-color: #293237;
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: white;
          --app-section-even-color: #f7f7f7;
          --app-section-odd-color: white;

          --app-header-background-color: white;
          --app-header-text-color: var(--app-dark-text-color);
          --app-header-selected-color: var(--app-primary-color);

          --app-drawer-background-color: var(--app-secondary-color);
          --app-drawer-text-color: var(--app-light-text-color);
          --app-drawer-selected-color: #78909c;
        }

        app-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          background-color: var(--app-header-background-color);
          color: var(--app-header-text-color);
          border-bottom: 1px solid #eee;
        }

        .toolbar-top {
          background-color: var(--app-header-background-color);
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
          display: none;
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-selected-color);
          border-bottom: 4px solid var(--app-header-selected-color);
        }

        .menu-btn, .btn {
          background: none;
          border: none;
          fill: var(--app-header-text-color);
          cursor: pointer;
          height: 44px;
          width: 44px;
        }

        .drawer-list {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          padding: 24px;
          background: var(--app-drawer-background-color);
          position: relative;
        }

        .drawer-list > a {
          display: block;
          text-decoration: none;
          color: var(--app-drawer-text-color);
          line-height: 40px;
          padding: 0 24px;
        }

        .drawer-list > a[selected] {
          color: var(--app-drawer-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
        }

        .main-content {
          padding-top: 64px;
          min-height: 100vh;
        }

        .page {
          display: none;
        }

        .page[active] {
          display: block;
        }

        footer {
          footer {
          padding: 24px;
          background: var(--app-drawer-background-color);
          color: var(--app-drawer-text-color);
          text-align: center;
          grid-column: 1 / 4;
        }


        .img-menu {
          display: block;
          max-width: 106px;
          max-height: 30px;
          width: auto;
          height: auto;
          margin-top: 15px;
        }

        .img-welcome {
          display: block;
          max-width: 40px;
          max-height: 30px;
          width: auto;
          height: auto;
          margin-top: 15px;
        }       

        /* Wide layout: when the viewport width is bigger than 460px, layout
        changes to a wide layout */
        @media (min-width: 460px) {
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }

          .main-content {
            padding-top: 107px;
          }

          /* The drawer button isn't shown in the wide layout, so we don't
          need to offset the title */
          [main-title] {
            padding-right: 0px;
          }
        }
      `
    ];
  }

  protected render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <!-- Header -->
      <app-header condenses reveals effects="waterfall">
        <app-toolbar class="toolbar-top">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>
          <div main-title>
            ${this.appTitle}
          </div>
          <button class='btn' title="Share" @click="${this._ShareButtonClicked}">${shareIcon}</button>
          <button class='btn' title="Back" @click="${this._BackButtonClicked}">${arrowBackIcon}</button>
        </app-toolbar>
        <!-- This gets hidden on a small screen-->
        <nav class="toolbar-list">
          <a ?selected="${this._page === 'welcome'}" href="/welcome">Welcome</a>
          <a ?selected="${this._section === 'Beavers'}" href="/Beavers/${this._badgeSet}">Beavers</a>
          <a ?selected="${this._section === 'Cubs'}" href="/Cubs/${this._badgeSet}">Cubs</a>
          <a ?selected="${this._section === 'Scouts'}" href="/Scouts/${this._badgeSet}">Scouts</a>
          <a ?selected="${this._section === 'Explorers'}" href="/Explorers/${this._badgeSet}">Explorers</a>
          <a ?selected="${this._page === 'allbadges'}" href="/allbadges">All Badges</a>
        </nav>
      </app-header>

      <!-- Drawer content -->
      <app-drawer
          .opened="${this._drawerOpened}"
          @opened-changed="${this._drawerOpenedChanged}">
        <nav class="drawer-list">
          <a ?selected="${this._page === 'welcome'}" href="/welcome"><img class='img-welcome' src='../../images/welcome.png'>Welcome</a>
          <a ?selected="${this._section === 'Beavers'}" href="/Beavers/${this._badgeSet}"><img class='img-menu' src='../../images/beavers.png'></a>
          <a ?selected="${this._section === 'Cubs'}" href="/Cubs/${this._badgeSet}"><img class='img-menu' src='../../images/cubs.png'></a>
          <a ?selected="${this._section === 'Scouts'}" href="/Scouts/${this._badgeSet}"><img class='img-menu' src='../../images/scouts.png'></a>
          <a ?selected="${this._section === 'Explorers'}" href="/Explorers/${this._badgeSet}"><img class='img-menu' src='../../images/explorers.png'></a>
          <a ?selected="${this._page === 'allbadges'}" href="/allbadges">All Badges</a>
        </nav>
      </app-drawer>

        <!-- Main content -->
        <main id="track" role="main" class="main-content">
          <welcome-page class="page" ?active="${this._page === 'welcome'}"></welcome-page>
          <section-badges class="page" ?active="${this._page === 'section'}" .badgeData="${this.badgeData}" .section="${this._section}" .badgeSet="${this._badgeSet}"></section-badges>
          <display-badge class="page" ?active="${this._page === 'badge'}" .badge="${this.getTheBadge(this.badgeData, this._section, this._badgeSet, this._badge)}"></display-badge>
          <all-badges class="page" ?active="${this._page === 'allbadges'}" .allBadges="${this.badgeData.Badges}"></all-badges>
          <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
        </main>

      <footer>
        <p>Made with &hearts; by the Polymer team.</p>
      </footer>

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
    store.dispatch(updateDrawerState(true));
  }

  private _drawerOpenedChanged(e: Event) {
    store.dispatch(updateDrawerState((e.target as AppDrawerElement).opened));
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
