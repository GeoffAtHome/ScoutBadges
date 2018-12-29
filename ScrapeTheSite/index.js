const xray = require('x-ray-scraper');
const request = require('request');
const stripHtmlComments = require('strip-html-comments');
const fs = require('fs');

async function SingleBadge(data, section, badge, request) {
    const results = await xray(request.href, 'body', [{
        text: xray('div.seven.columns@html'),
    }]);
    if (results[0]) {
        let text = stripHtmlComments(results[0].text);
        text = text.replace(/ (class|style|title|alt|cellspacing|cellpadding|border)=".*?"/g, '');
        text = text.replace(/<font .*?>/g, '');
        text = text.replace(/<\/font>/g, '');
        text = text.replace(/<span.*?>/g, '<span>');
        const images = img = text.match(/<img .*?>/);
        console.log(section + ": " + badge + ": " + request.text);
        if (images !== null) {
            for (const image of images) {
                const path = image.match(/src=".*?"/)[0].split('=')[1].replace(/"/g, "")
                const shortName = SaveImage(path);
                text = text.replace(path, shortName);
            }
        }
        const saveName = SaveImage(request.image);
        data[section][badge].push({
            title: request.text,
            image: saveName,
            info: text
        });
    }
}

function SaveImage(href) {
    const parts = href.split('/');
    const shortName = parts[parts.length - 1];
    GetImage(href, shortName);
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
    await BadgeSetPage(data, section, request);
    await CheckForMorePages(data, section, request);
}

async function BadgeSetPage(data, section, request) {
    // Remove spaces from badge label
    const badge = request.text.replace(/ /g, '');;

    const results = await xray(request.href, 'td', [{
        text: 'div',
        href: 'a@href',
        image: 'img@src'
    }]);

    for (const result of results) {
        await SingleBadge(data, section, badge, result);
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
            ActivityBadges: [],
            Corebadges: [],
            ChallengeAwards: [],
            StagedActivityBadges: []
        },
        Cubs: {
            ActivityBadges: [],
            Corebadges: [],
            ChallengeAwards: [],
            StagedActivityBadges: []
        },
        Scouts: {
            ActivityBadges: [],
            Corebadges: [],
            ChallengeAwards: [],
            StagedActivityBadges: []
        },
        Explorers: {
            ActivityBadges: [],
            Corebadges: [],
            Awards: [],
            StagedActivityBadges: []
        }
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

    fs.writeFile("./../PWA/res/data.json", JSON.stringify(data), function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

}

Root();