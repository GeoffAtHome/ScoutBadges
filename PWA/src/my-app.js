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
import {
  setPassiveTouchGestures,
  setRootPath
} from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './my-icons.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends PolymerElement {
  static get template() {
    return html `
      <style>
        :host {
          --app-primary-color: #4285f4;
          --app-secondary-color: black;

          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }
      </style>
      <iron-ajax auto url="res/data.json" handle-as="json" last-response="{{data}}"></iron-ajax>
      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}"></app-route>
      <app-route route="{{subroute}}" pattern="/:set" data="{{subrouteData}}"></app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="Beavers" href="[[rootPath]]Beavers/[[set]]">Beavers</a>
            <a name="Cubs" href="[[rootPath]]Cubs/[[set]]">Cubs</a>
            <a name="Scouts" href="[[rootPath]]Scouts/[[set]]">Scouts</a>
            <a name="Explorers" href="[[rootPath]]Explorers/[[set]]">Explorers</a>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">[[title]]</div>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <welcome-page name="Welcome"></welcome-page>
            <section-badges name="section" section="[[section]]" set="[[set]]" data="[[data]]"></section-badges>
            <display-badge name="Badge" set="[[set]]" card="[[card]]"></display-badge>
            <my-view404 name="view404"></my-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      card: Object,
      data: Object,
      set: {
        type: String,
        reflectToAttribute: true,
        // observer: '_pageChanged'
      },
      section: String,
      title: {
        type: String,
        value: "Scout Badge Requirements"
      },
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subrouteData: Object,
      subroute: Object
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page, subrouteData.set)'
    ];
  }

  ready() {
    super.ready();
    window.addEventListener("display-badge", event => this._displayBadge(event));
    window.addEventListener("display-title", event => this._displayTitle(event));
    window.addEventListener("change-set", event => this._changeSet(event));
  }

  _displayBadge(event) {
    this.card = event.detail.info;
    this.page = "Badge";
    console.log(this.card.title);
  }

  _displayTitle(event) {
    this.title = event.detail;
    console.log(this.title);
  }

  _changeSet(event) {
    const set = event.detail;
    this.set = set;
    window.history.pushState(set, this.section, '/' + this.section + '/' + set);
  }

  _routePageChanged(page, set) {
    // Show the corresponding page according to the route.
    //
    // If no page was found in the route data, page will be an empty string.
    // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      this.page = 'Welcome';
      this.set = '';
    } else if (['Beavers', 'Cubs', 'Scouts', 'Explorers'].indexOf(page) !== -1) {
      this.page = 'section'
      this.section = page;
      if (!set) {
        this.set = "core";
      } else if (['core', , 'activity', 'challenge', 'staged'].indexOf(set) !== -1) {
        this.set = set;
      } else {
        this.set = "core";
      }
    } else if (this.page === 'Badge') {
      this.page = page;
    } else {
      this.page = 'Welcome';
      this.set = '';
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
    console.log("Section: " + this.page + " Set: " + this.set);
  }

  _pageChanged(page) {
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'Welcome':
        import('./welcome-page.js');
        break;
      case 'Badge':
        import('./display-badge.js');
        break;
      default:
        import('./section-badges.js');
        break;
    }
  }
}

window.customElements.define('my-app', MyApp);