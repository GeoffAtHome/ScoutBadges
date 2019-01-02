const xray = require('x-ray-scraper');
const request = require('request');
const stripHtmlComments = require('strip-html-comments');
const fs = require('fs');

async function SingleBadge(data, section, badgeSet, request) {
    const results = await xray(request.href, 'body', [{
        text: xray('div.seven.columns@html'),
    }]);
    if (results[0]) {
        console.log(section + ": " + badgeSet + ": " + request.text);
        let text = stripHtmlComments(results[0].text);
        text = text.replace(/ (class|style|title|alt|cellspacing|cellpadding|border|width|height|align)=".*?"/g, '');
        text = text.replace(/<font .*?>/g, '');
        text = text.replace(/<\/font>/g, '');
        text = text.replace(/<span.*?>/g, '<span>');
        text = text.replace(/(&nbsp;|&#xA0;|\n|\r)/g, '');
        text = text.replace(/  +/g, ' ');
        const images = text.match(/<img .*?>/g);
        if (images !== null) {
            for (const image of images) {
                const path = image.match(/src=".*?"/)[0].split('=')[1].replace(/"/g, "")
                const shortName = SaveImage(data, path);
                text = text.replace(path, shortName);
            }
        }
        const saveName = SaveImage(data, request.image);
        // Strip back the title to make the text shorter
        const title = request.text.replace(/ Staged Activity Badge/, '').replace(/ Activity Badge/, '').replace(/ Challenge Award/, '').replace(/ Award/, '');
        data[section][badgeSet].push({
            id: title.replace(/(\(|\)| |')/g, '_').toLowerCase(),
            title: title,
            image: saveName,
            info: text
        });
    }
}

function SaveImage(data, href) {
    const parts = href.split('/');
    const shortName = parts[parts.length - 1];
    // If the image is not already in the list add it!
    if (data['Badges'].indexOf(shortName) === -1) {
        data['Badges'].push(shortName);
        GetImage(href, shortName);
    }
    return "res/" + shortName;
}

function download(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};



function GetImage(href, shortName) {
    let path = "./../PWA/res/";
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    path = path + shortName.replace(/%20/g, " ");
    download(href, path, function () {});
}


async function BadgeSets(data, section, request) {
    // Remove spaces from section label
    section = section.replace(/ /g, '');
    // Normalise the badge set
    let badgeSet = '';
    switch (request.text) {
        case 'Activity Badges':
            badgeSet = "activity";
            break;
        case 'Awards':
        case 'Challenge Awards':
            badgeSet = "challenge";
            break;
        case 'Core badges':
            badgeSet = 'core';
            break
        case 'Staged Activity Badges':
            badgeSet = 'staged';
            break
    }

    await BadgeSetPage(data, section, request, badgeSet);
    await CheckForMorePages(data, section, request);
}

async function BadgeSetPage(data, section, request, badgeSet) {
    const results = await xray(request.href, 'td', [{
        text: 'div',
        href: 'a@href',
        image: 'img@src'
    }]);

    for (const result of results) {
        await SingleBadge(data, section, badgeSet, result);
    }
}


async function CheckForMorePages(data, section, request) {
    // Are there more pages?
    const results = await xray(request.href, 'div.results_pagination_bottom', [{
        text: xray(['a']),
        href: xray(['a@href'])
    }]);

    if (results.length !== 0) {
        const text = results[0].text;
        const index = text.findIndex(x => x.includes("Next"));
        if (index !== -1) {
            const newRequest = {
                text: request.text,
                href: results[0].href[index]
            };
            await BadgeSets(data, section, newRequest);
        }
    }
}

async function SectionBadgeSets(data, section, request) {
    const results = await xray(request.href, 'li', [{
        text: 'a',
        href: 'a@href'
    }]);

    for (const result of results) {
        switch (result.text) {
            case 'Activity Badges':
            case 'Awards':
            case 'Challenge Awards':
            case 'Core badges':
            case 'Staged Activity Badges':
                await BadgeSets(data, section, result);
                break;
            default:
                break;
        }
    }
}

async function SectionBadges(data, request) {
    const section = request.text;

    const results = await xray(request.href, 'li', [{
        text: 'a',
        href: 'a@href'
    }]);

    for (const result of results) {
        switch (result.text) {
            case 'Badges and awards':
                await SectionBadgeSets(data, section, result);
                break;
            default:
                break;
        }
    }
}

async function Root() {
    let data = {
        Beavers: {
            activity: [],
            core: [],
            challenge: [],
            staged: []
        },
        Cubs: {
            activity: [],
            core: [],
            challenge: [],
            staged: []
        },
        Scouts: {
            activity: [],
            core: [],
            challenge: [],
            staged: []
        },
        Explorers: {
            activity: [],
            core: [],
            challenge: [],
            staged: []
        },
        Badges: []
    }

    const results = await xray('https://members.scouts.org.uk/supportresources', 'li', [{
        text: 'a',
        href: 'a@href'
    }])

    for (const result of results) {
        switch (result.text) {
            case 'Scouts':
            case 'Beavers':
            case 'Cubs':
            case 'Explorers':
                await SectionBadges(data, result);
                break;
            default:
                break;
        }
    };
    // Any special fix-up needs to be done here.
    let text = JSON.stringify(data);
    text = text.replace(/<img src=\\"res\/Scout%20Ls%20SeniorPatrolLeader%20RGB.jpg\\"><img src=\\"res\/Scout%20Ls%20SeniorPatrolLeader%20RGB.jpg\\"><img src=\\"res\/Ls%20PatrolLeader%20RGB.jpg\\"><img src=\\"res\/Scout Ls AssistantPatrolLeader RGB.jpg\\"><br>Senior Patrol Leader Patrol Leader Assistant Patrol Leader<br>/, '<img src=\\"res\/Scout%20Ls%20SeniorPatrolLeader%20RGB.jpg\\"><br>Senior Patrol Leader Patrol<br><img src=\\"res\/Ls%20PatrolLeader%20RGB.jpg\\"><br>Patrol Leader<br><img src=\\"res\/Scout Ls AssistantPatrolLeader RGB.jpg\\"><br>Patrol Leader<br>');

    fs.writeFile("./../PWA/res/data.json", text, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

}

Root();