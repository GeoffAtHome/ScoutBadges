/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { Reducer } from 'redux';
import { UPDATE_PAGE, UPDATE_OFFLINE, OPEN_SNACKBAR, CLOSE_SNACKBAR, UPDATE_DRAWER_STATE, UPDATE_SECTION, UPDATE_BADGESET, UPDATE_BADGE } from '../actions/app';
import { BadgeDataType, SectionDataType } from '../actions/badgedata';
import { RootAction } from '../store';

export interface AppState {
  page: string;
  offline: boolean;
  drawerOpened: boolean;
  snackbarOpened: boolean;
  section: BadgeDataType;
  badgeSet: SectionDataType;
  badge: string;
  title: string;
}


const INITIAL_STATE: AppState = {
  page: '',
  offline: false,
  drawerOpened: false,
  snackbarOpened: false,
  section: '',
  badgeSet: '',
  badge: '',
  title: ''
};

const app: Reducer<AppState, RootAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
      };
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      };
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened
      };
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false
      };

    case UPDATE_SECTION:
      return {
        ...state,
        section: action.section
      }

    case UPDATE_BADGESET:
      return {
        ...state,
        badgeSet: action.badgeSet
      }

    case UPDATE_BADGE:
      return {
        ...state,
        badge: action.badge
      }

    default:
      return state;
  }
};

export default app;
