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
import '@polymer/iron-image/iron-image.js'
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
          background-color: #eeeeee;
        }

        iron-image.menu {
          width: 106px;
          height: 30px;
          margin-top: 15px;
        }
        iron-image.menuwelcome {
          width: 40px;
          height: 30px;
          margin-top: 15px;
        }
      </style>
      <iron-ajax auto url="res/data.json" handle-as="json" last-response="{{data}}"></iron-ajax>
      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{setroute}}"></app-route>
      <app-route route="{{setroute}}" pattern="/:badgeset" data="{{badgeSetData}}" tail="{{badgeroute}}"></app-route>
      <app-route route="{{badgeroute}}" pattern="/:badge" data="{{badgeData}}"></app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[section]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="Welcome" href="[[rootPath]]Welcome/">
              <iron-image class="menuwelcome" position="left" sizing="contain" fade src="images/Welcome.png"></iron-image>Welcome
            </a>
            <a name="Beavers" href="[[rootPath]]Beavers/[[badgeset]]/">
              <iron-image class="menu" position="left" sizing="contain" fade src="images/Beavers.png"></iron-image>
            </a>
            <a name="Cubs" href="[[rootPath]]Cubs/[[badgeset]]/">
              <iron-image class="menu" position="left" sizing="contain" fade src="images/Cubs.png"></iron-image>
            </a>
            <a name="Scouts" href="[[rootPath]]Scouts/[[badgeset]]/">
              <iron-image class="menu" position="left" sizing="contain" fade src="images/Scouts.png"></iron-image>
            </a>
            <a name="Explorers" href="[[rootPath]]Explorers/[[badgeset]]/">
              <iron-image class="menu" position="left" sizing="contain" fade src="images/Explorers.png"></iron-image>
            </a>
            <a name="AllBadges" href="[[rootPath]]AllBadges">All Badges</a>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title>
              <iron-image class="menu" sizing="contain" fade src="images/[[section]].png"></iron-image>
              [[title]]</div>
              <paper-icon-button icon="my-icons:share" on-tap="_share"></paper-icon-button>
              <paper-icon-button icon="my-icons:arrow-back" on-tap="_BackClicked"></paper-icon-button>
            </app-toolbar>
          </app-header>

          <div id="track" on-track="handleTrack">
            <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <welcome-page name="Welcome"></welcome-page>
            <section-badges name="section" data="[[data]]" section="[[section]]" badgeset="[[badgeset]]"></section-badges>
            <display-badge name="Badge" data="[[data]]" section="[[section]]" badgeset="[[badgeset]]" badge="[[badge]]"></display-badge>
            <all-badges name="AllBadges" data="[[data]]"></all-badges>
          </iron-pages>
          </div>
        </app-header-layout>
      </app-drawer-layout>
    `;
    }

    static get properties() {
        return {
            data: Object,
            badge: {
                type: String,
                reflectToAttribute: true
            },
            badgeset: {
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
            route: Object,
            setroute: Object,
            badgeroute: Object,
            routeData: Object,
            badgeSetData: Object,
            badgeData: Object
        };
    }

    static get observers() {
        return [
            '_routePageChanged(routeData.page, badgeSetData.badgeset, badgeData.badge)'
        ];
    }

    ready() {
        super.ready();
        window.addEventListener("display-title", event => this._displayTitle(event));
        this.$.track.addEventListener("touchstart", this.handleStart, false);
        this.$.track.addEventListener("touchend", this.handleEnd, false);
    }

    _displayTitle(event) {
        this.title = event.detail;
        localStorage.setItem("title", this.title);
    }

    _BackClicked(event) {
        window.history.back();
    }

    _share(event) {
        // Work out where we our to compose the correct content to share
        let title = "";
        let text = "";
        let link = location.href;

        switch (this.page) {
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
            title = this.section + " " + this.badgeset + " badge requirements";
            text = "You can use the following link to find the requirements for your " + title;
            break;

        case 'Badge':
            const badge = this.data[this.section][this.badgeset].filter((item) => item.id === this.badge)[0];
            title = this.section + " " + this.badgeset + " " + badge.title;
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

    _routePageChanged(page, badgeSet, badge) {
        // Show the corresponding page according to the route.
        //
        // If no page was found in the route data, page will be an empty string.
        // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
        if (!page) {
            page = localStorage.getItem("page");
            if (!page) {
                page = 'Welcome';
            } else {
                badgeSet = localStorage.getItem("set");
                badge = localStorage.getItem("badge");
                this.section = localStorage.getItem("section");
                this.title = localStorage.getItem("title");
            }
        }

        if (!badgeSet) {
            badgeSet = '';
        }

        if (!badge) {
            badge = '';
        }

        switch (page) {
        case 'Welcome':
            this.page = page;
            this.badge = '';
            this.badgeset = 'Welcome';
            this.section = 'Welcome';
            break;

        case 'Beavers':
        case 'Cubs':
        case 'Scouts':
        case 'Explorers':
            this.validateBadgeSet(badgeSet);
            if (badge === '') {
                this.page = 'section';
                this.section = page;
                this.badge = '';
            } else {
                this.page = 'Badge';
                this.section = page;
                this.badge = badge;
            }
            break;

        case 'Badge':
            this.validateBadgeSet(badgeSet);
            this.page = page;
            this.badge = badge;
            break;

        case 'AllBadges':
            this.page = page;
            this.badge = '';
            this.badgeset = 'All badges';
            this.section = "Welcome";
            break;

        default:
            this.page = "Welcome";
            this.badge = '';
            this.badgeset = 'core';
            this.section = "AllBadges";
            break;
        }
        // Close a non-persistent drawer when the page & route are changed.
        if (!this.$.drawer.persistent) {
            this.$.drawer.close();
        }
        // Save the page details for a restart
        localStorage.setItem("page", this.page);
        localStorage.setItem("set", this.badgeset);
        localStorage.setItem("badge", this.badge);
        localStorage.setItem("section", this.section);
        localStorage.setItem("title", this.title);
    }

    validateBadgeSet(badgeSet) {
        if (['core', , 'activity', 'challenge', 'staged'].indexOf(badgeSet) !== -1) {
            this.badgeset = badgeSet;
        } else {
            this.badgeset = "core";
        }
    }

    _pageChanged(page) {
        // Import the page component on demand.
        //
        // Note: `polymer build` doesn't like string concatenation in the import
        // statement, so break it up.
        switch (page) {
        case 'Welcome':
            import ('./welcome-page.js');
            break;
        case 'Badge':
            import ('./display-badge.js');
            break;
        case 'AllBadges':
            import ('./all-badges.js');
            break;
        default:
            import ('./section-badges.js');
            break;
        }
    }

    handleStart(e) {
        this.startX = e.changedTouches[0].pageX;
        this.startY = e.changedTouches[0].pageY;
    }

    handleEnd(e) {
        const deltaX = e.changedTouches[0].pageX - this.startX;
        const deltaY = Math.abs(e.changedTouches[0].pageY - this.startY);
        if (deltaX > 100 && deltaY < 100) {
            window.history.back();
        } else if (deltaX < -100 && deltaY < 100) {
            window.history.forward();
        }
    }
}

window.customElements.define('my-app', MyApp);