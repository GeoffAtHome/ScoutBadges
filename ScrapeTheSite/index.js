const xray = require('x-ray-scraper');
const request = require('request');
const stripHtmlComments = require('strip-html-comments');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const outputFolder = "./../PWA/res/" // Output folder

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
                // Save the image
                const imageResult = await getImageResults(image);
                // If the width or the height of the image is zero remove it
                if (imageResult.width === '0' || imageResult.height === '0') {
                    text = text.replace(image, '');
                } else {
                    const shortName = SaveImage(data, imageResult.src, link);
                    const srcset = '"res/' + shortName[0] + '.webp, res/' + shortName[0] + '.' + shortName[1] + '"';
                    const style = '"height: ' + imageResult.height + 'px; width: ' + imageResult.width + 'px;"'
                    const newImage = '<plastic-image lazy-load fade sizing="contain" srcset=' + srcset + ' xstylex' + style + ' ></plastic-image>';
                    text = text.replace(image, newImage);
                }
            }
        }

        text = text.replace(/ (class|style|title|alt|cellspacing|cellpadding|border|width|height|align|hspace|vspace)=".*?"/g, '');
        text = text.replace(/xstylex/g, 'style=');
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
            image: saveName[0],
            imageType: saveName[1],
            info: text
        });
    }
}

async function getImageResults(image) {
    const results = await xray(image, 'img', [{
        src: '@src',
        height: '@height',
        width: '@width'
    }]);

    return results[0]
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

function SaveImage(data, href, link) {
    const parts = href.split('/');
    const shortName = parts[parts.length - 1].replace(/(%20| )/g, "__").toLowerCase();
    const badge = shortName.split('.');
    const entry = {
        link: link,
        name: badge[0],
        type: badge[1]
    };

    // If the image is not already in the list add it!
    if (data['Badges'].filter(item => item.link === entry.link).length === 0) {
        data['Badges'].push({
            link: entry.link,
            name: badge[0],
            type: badge[1]
        });
    }
    GetImage(href, shortName);

    return badge;
}

function download(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};



function GetImage(href, shortName) {
    let path = outputFolder;
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

async function SectionPromises(data, request) {
    const section = request.text;
    const results = await xray(request.href, 'body', [{
        text: xray('div.seven.columns@html'),
    }]);

    if (results[0]) {
        let thisSection = request.text;
        switch (section) {
        case 'Beavers':
            thisSection = 'Beaver Scout';
            break;

        case 'Cubs':
            thisSection = 'Cub Scout';
            break;

        case 'Scouts':
        case 'Explorers':
            thisSection = 'Scout'
            break;
        }
        const text = results[0].text;
        const rxPromise = new RegExp("<h3>(<b>|)The " + thisSection + " Promise.*?<h3>", "g")
        const rxLaw = new RegExp("<h3>(<b>|)The " + thisSection + " Law.*?<h3>", "g")
        const rxMotto = new RegExp("<h3>(<b>|)The " + thisSection + " Motto.*?<h3>", "g")

        const promise = RemoveDoubles(rxPromise.exec(text)[0]);
        const law = RemoveDoubles(rxLaw.exec(text)[0]);
        const motto = RemoveDoubles(rxMotto.exec(text)[0]);

        data[section]['lawAndPromise'].push({
            id: 'lawAndPromise',
            title: thisSection + " Promise, Law and Motto",
            promise: promise,
            law: law,
            motto: motto
        });

    }
}

async function Root() {
    let data = {
        Beavers: {
            lawAndPromise: [],
            activity: [],
            core: [],
            challenge: [],
            staged: []
        },
        Cubs: {
            lawAndPromise: [],
            activity: [],
            core: [],
            challenge: [],
            staged: []
        },
        Scouts: {
            lawAndPromise: [],
            activity: [],
            core: [],
            challenge: [],
            staged: []
        },
        Explorers: {
            lawAndPromise: [],
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
            await SectionPromises(data, result);
            await SectionBadges(data, result);
            break;
        default:
            break;
        }
    };
    // Any special fix-up needs to be done here.
    let text = JSON.stringify(data);
    text = text.replace(/<plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/Scout__Ls__SeniorPatrolLeader__RGB.webp, res\/Scout__Ls__SeniorPatrolLeader__RGB.jpg\\" style=\\"height: 61px; width: 155px;\\" ><\/plastic-image><plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/Ls__PatrolLeader__RGB.webp, res\/Ls__PatrolLeader__RGB.jpg\\" style=\\"height: 60px; width: 152px;\\" ><\/plastic-image><plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/Scout__Ls__AssistantPatrolLeader__RGB.webp, res\/Scout__Ls__AssistantPatrolLeader__RGB.jpg\\" style=\\"height: 59px; width: 160px;\\" ><\/plastic-image><br>Senior Patrol Leader&#xA0;Patrol Leader&#xA0;Assistant Patrol Leader<br>/g, '<plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/Scout__Ls__SeniorPatrolLeader__RGB.webp, res\/Scout__Ls__SeniorPatrolLeader__RGB.jpg\\" style=\\"height: 61px; width: 155px;\\" ><\/plastic-image><br>Senior Patrol Leader Stripes<br><br><plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/Ls__PatrolLeader__RGB.webp, res\/Ls__PatrolLeader__RGB.jpg\\" style=\\"height: 60px; width: 152px;\\" ><\/plastic-image><br>Patrol Leader Stripes<br><br><plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/Scout__Ls__AssistantPatrolLeader__RGB.webp, res\/Scout__Ls__AssistantPatrolLeader__RGB.jpg\\" style=\\"height: 59px; width: 160px;\\" ><\/plastic-image><br>Assistant Patrol Leader Stripes<br><br>');
    text = text.replace(/<b>Sixer Leadership Stripes&#xA0;Seconder <\/b><b><span><b>Leadership<\/b> <\/span> Stripes<br><br><plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/sixer__leadership__stripes.webp, res\/sixer__leadership__stripes.png\\" style=\\"height: 60px; width: 148px;\\" ><\/plastic-image> &#xA0;<plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/seconder__leadership__stripes.webp, res\/seconder__leadership__stripes.png\\" style=\\"height: 60px; width: 148px;\\" ><\/plastic-image> &#xA0;<br><\/b><\/p>/g, '<plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/sixer__leadership__stripes.webp, res\/sixer__leadership__stripes.png\\" style=\\"height: 60px; width: 148px;\\" ><\/plastic-image><br>Sixer Leadership Stripes<br><br><plastic-image lazy-load fade sizing=\\"contain\\" srcset=\\"res\/seconder__leadership__stripes.webp, res\/seconder__leadership__stripes.png\\" style=\\"height: 60px; width: 148px;\\" ><\/plastic-image><br>Seconder Leadership Stripes<br><br>');
    fs.writeFile(outputFolder + "/data.json", text, function (err, data) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        imagemin([outputFolder + '*.jpg'], outputFolder, {
            use: [
                imageminWebp({
                    quality: 65
                })
            ]
        }).then(() => {
            console.log('Jpeg images optimized');
        });

        imagemin([outputFolder + '*.png'], outputFolder, {
            use: [
                imageminWebp({
                    lossless: true // Losslessly encode images
                })
            ]
        }).then(() => {
            console.log('Png images optimized');
        });
    });

}

Root();