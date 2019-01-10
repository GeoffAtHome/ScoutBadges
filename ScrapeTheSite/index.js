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
        const title = request.text.replace(/ Staged Activity Badge/, '').replace(/ Activity Badge/, '').replace(/ Challenge Award/, '').replace(/ Award/, '');
        const link = section + "/" + badgeSet + "/" + title.replace(/(\(|\)| |')/g, '_').toLowerCase();
        let text = stripHtmlComments(results[0].text);

        // Find all the images
        const images = text.match(/<img .*?>/g);
        if (images !== null) {
            for (const image of images) {
                // If the width or the height of the image is zero remove it
                if (RealImage(image) === false) {
                    text = text.replace(image, '');
                } else {
                    // Save the image
                    const path = image.match(/src=".*?"/)[0].split('=')[1].replace(/"/g, "")
                    const shortName = SaveImage(data, path, link);
                    text = text.replace(path, shortName);
                }
            }
        }

        text = text.replace(/ (class|style|title|alt|cellspacing|cellpadding|border|width|height|align)=".*?"/g, '');
        text = text.replace(/<font .*?>/g, '');
        text = text.replace(/<\/font>/g, '');
        text = text.replace(/<span.*?>/g, '<span>');
        text = RemoveDoubles(text);
        text = text.replace(/  +/g, ' ');
        const saveName = SaveImage(data, request.image, link);
        // Strip back the title to make the text shorter
        data[section][badgeSet].push({
            id: title.replace(/(\(|\)| |')/g, '_').toLowerCase(),
            title: title,
            image: saveName,
            info: text
        });
    }
}

function RemoveDoubles(text) {
    let newText = text.replace(/(&#xA0; |\n|\r)/g, '');

    while (true) {
        newText = newText.replace(/&nbsp;&nbsp;/g, '&nbsp;');
        newText = newText.replace(/&#xA0;&#xA0;/g, '&#xA0;');
        if (newText === text) {
            break;
        }
        text = newText;
    }
    return text;
}

function RealImage(text) {
    let result = true;

    const parts = text.split(' ');
    for (const part of parts) {
        // remove quotes
        const attribute = part.replace(/('|")/g, '');
        const split = attribute.split('=');
        if (split[0] === 'width' || split[0] === 'height') {
            if (split[1] === '0') {
                result = false;
                break;
            }
        }
    }

    return result;
}

function SaveImage(data, href, link) {
    const parts = href.split('/');
    const shortName = parts[parts.length - 1];
    const entry = {
        url: shortName,
        link: link
    };
    // If the image is not already in the list add it!
    if (data['Badges'].filter(item => item.url === entry.url && item.link === entry.link).length === 0) {
        data['Badges'].push(entry);
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
        case 'Beavers':
        case 'Cubs':
        case 'Scouts':
        case 'Explorers':
            await SectionBadges(data, result);
            break;
        default:
            break;
        }
    };
    // Any special fix-up needs to be done here.
    let text = JSON.stringify(data);
    text = text.replace(/<img src=\\"res\/Scout%20Ls%20SeniorPatrolLeader%20RGB.jpg\\"><img src=\\"res\/Ls%20PatrolLeader%20RGB.jpg\\"><img src=\\"res\/Scout Ls AssistantPatrolLeader RGB.jpg\\"><br>Senior Patrol Leader&#xA0;Patrol Leader&#xA0;Assistant Patrol Leader<br>/g, '<img src=\\"res\/Scout%20Ls%20SeniorPatrolLeader%20RGB.jpg\\"><br>Senior Patrol Leader Patrol<br><br><img src=\\"res\/Ls%20PatrolLeader%20RGB.jpg\\"><br>Patrol Leader<br><br><img src=\\"res\/Scout Ls AssistantPatrolLeader RGB.jpg\\"><br>Patrol Leader<br><br>');
    text = text.replace(/<p><b>Sixer Leadership Stripes&#xA0;Seconder <\/b><b><span><b>Leadership<\/b> <\/span> Stripes<br><br><img src=\\"res\/sixer%20leadership%20stripes.png\\"> &#xA0;<img src=\\"res\/seconder%20leadership%20stripes.png\\"> &#xA0;<br><\/b><\/p>/g, '<img src=\\"res\/sixer%20leadership%20stripes.png\\"><br>Sixer Leadership Stripes<br><br><img src=\\"res\/seconder%20leadership%20stripes.png\\"><br>Seconder Leadership Stripes<br><br>');
    fs.writeFile("./../PWA/res/data.json", text, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

}

Root();