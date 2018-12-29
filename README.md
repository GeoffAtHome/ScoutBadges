# ScoutBages

## Overview
After getting disgruntled by the Android app "ScoutBadges" not working on my Android phone and lack of response from the author of the app I decide to write my own version of the app that works as a Progressive Web App (PWA). This should mean that it works offline and across anything that support a browser.

You need to be online to gain access to the application but after that it will run offline as all the content should be cached (only the pages you visit will be cached - in a future release this restriction maybe removed).

When scouts.org.uk update the badge requirements the scraping code can be re-run to refresh the content. The new content then become access and will update the cache. Obviously to update the cache you need to be online.

The project is in two parts:
* **ScrapeTheSite** - creates the resources needed for the PWA
* **PWA** - the app that will run on your phone/tablet.....

## Build the project
Download from Github. Run:
* `cd ScrapeTheApp`
* `npm install`
* `npm start`
* `cd ../PWA`
* `polymer serve --open`

(this assumes you have npm and polyercli installed)

## To host
Deploy the contents of the build directory as required.

For more details about the Polymer-cli see [https://www.polymer-project.org/](https://www.polymer-project.org/)

Suggestions welcome for additional features to add.
