/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/* eslint-disable import/extensions */
import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import { BadgeDataType, SectionDataType } from './badgedata';

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const UPDATE_SECTION = 'UPDATE_SECTION'
export const UPDATE_BADGESET = 'UPDATE_BADGESET'
export const UPDATE_BADGE = 'UPDATE_BADGE'

export interface AppActionUpdatePage extends Action<'UPDATE_PAGE'> { page: string };
export interface AppActionUpdateOffline extends Action<'UPDATE_OFFLINE'> { offline: boolean };
export interface AppActionUpdateDrawerState extends Action<'UPDATE_DRAWER_STATE'> { opened: boolean };
export interface AppActionOpenSnackbar extends Action<'OPEN_SNACKBAR'> { };
export interface AppActionCloseSnackbar extends Action<'CLOSE_SNACKBAR'> { };
export interface AppActionUpdateSection extends Action<'UPDATE_SECTION'> { section: BadgeDataType };
export interface AppActionUpdateBadgeSet extends Action<'UPDATE_BADGESET'> { badgeSet: SectionDataType };
export interface AppActionUpdateBadge extends Action<'UPDATE_BADGE'> { badge: string };
export type AppAction = AppActionUpdatePage | AppActionUpdateOffline | AppActionUpdateDrawerState | AppActionOpenSnackbar | AppActionCloseSnackbar | AppActionUpdateSection | AppActionUpdateBadgeSet | AppActionUpdateBadge

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

function getPageFromPart(part: string) {
  switch (part) {
    case '':
    case 'welcome':
      return 'welcome'

    case 'Beavers':
    case 'Cubs':
    case 'Scouts':
    case 'Explorers':
      return 'section'

    case 'allbadges':
      return 'allbadges'

    default:
      break;

  }
  return ''
}

function getSectionFromPart(part: string) {
  switch (part) {
    case 'Beavers':
    case 'Cubs':
    case 'Scouts':
    case 'Explorers':
      return part

    default:
      break;
  }
  return ''
}

const updatePage: ActionCreator<AppActionUpdatePage> = (page: string) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

const loadPage: ActionCreator<ThunkResult> = (page: string) => (dispatch) => {
  switch (page) {
    case 'welcome':
      import('../components/welcome-page').then(() => {
        // Put code in here that you want to run every time when
        // navigating to view1 after my-view1 is loaded.
      });
      break;
    case 'section':
      import('../components/section-badges');
      break;
    case 'badge':
      import('../components/display-badge');
      break;
    case 'allbadges':
      import('../components/all-badges');
      break;
    default:
      // eslint-disable-next-line no-param-reassign
      page = 'view404';
      import('../components/my-view404');
  }

  dispatch(updatePage(page));
};

export const updateDrawerState: ActionCreator<AppActionUpdateDrawerState> = (opened: boolean) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};


const updateSection: ActionCreator<AppActionUpdateSection> = (section: BadgeDataType) => {
  return {
    type: UPDATE_SECTION,
    section
  };
};

export const updateBadgeSet: ActionCreator<AppActionUpdateBadgeSet> = (badgeSet: SectionDataType) => {
  return {
    type: UPDATE_BADGESET,
    badgeSet
  };
};

const updateBadge: ActionCreator<AppActionUpdateBadge> = (badge: string) => {
  return {
    type: UPDATE_BADGE,
    badge
  };
};

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch) => {
  // Extract the page name from path.
  const parts = path.split('/')
  let page = 'welcome'
  let section = ''
  let badgeSet = 'core'
  let badge = ''
  let index = 0

  if (parts[0] === "") {
    parts.shift()
  }

  while (parts.length > 0) {
    let part = parts.shift()
    if (part === undefined) {
      part = ''
    }
    if (part !== '') {
      switch (index) {
        case 0:
          page = getPageFromPart(part)
          section = getSectionFromPart(part)
          break

        case 1:
          badgeSet = part;
          break

        case 2:
          badge = part;
          page = 'badge'
          break

        default:
          break
      }
      // eslint-disable-next-line no-plusplus
      index++;
    }
  }

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));
  dispatch(updateSection(section));
  dispatch(updateBadgeSet(badgeSet));
  dispatch(updateBadge(badge));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  if (window.matchMedia("(max-width: 700px)").matches) {
    dispatch(updateDrawerState(false));
  }
};


let snackbarTimer: number;

export const showSnackbar: ActionCreator<ThunkResult> = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  window.clearTimeout(snackbarTimer);
  snackbarTimer = window.setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline: ActionCreator<ThunkResult> = (offline: boolean) => (dispatch, getState) => {
  // Show the snackbar only if offline status changes.
  if (offline !== getState().app!.offline) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

