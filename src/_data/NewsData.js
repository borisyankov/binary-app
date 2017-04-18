const api = 'https://js.binary.com/javascript.php';

const params = {
    id: {
        media: '876',
        prefix: '8grqRDVc105iX6ztb0GwqWNd7ZgqdRLk',
    },
    ru: {
        media: '875',
        prefix: 'bPzDzniJKAKx76XffYA0JmNd7ZgqdRLk',
    },
    en: {
        media: '26',
        prefix: '8grqRDVc1066tyDIijdDK2Nd7ZgqdRLk', // bPzDzniJKAJHH6eEtUVc2GNd7ZgqdRLk',
    },
};

const getContent = xmlItem => {
    if (xmlItem.getElementsByTagName('content:encoded').length) {
        return xmlItem.getElementsByTagName('content:encoded').item(0)
            .textContent;
    }

    return xmlItem.getElementsByTagName('encoded').item(0).textContent;
};

const xmlToNewsItem = xmlItem => ({
    title: xmlItem
        .getElementsByTagName('title')
        .item(0)
        .textContent.replace(/regentmarkets\d.*$/, ''),
    pubDate: xmlItem
        .getElementsByTagName('pubDate')
        .item(0)
        .textContent.replace(/\+0000$/, 'GMT'),
    description: xmlItem.getElementsByTagName('description').item(0)
        .textContent,
    url: xmlItem.getElementsByTagName('guid').item(0).textContent,
    content: getContent(xmlItem),
});

export const readNewsFeed = async l => {
    const queryUrl = `${api}?media=${params[l].media}&prefix=${params[l].prefix}&campaign=1&mode=txt`;
    const domParser = new DOMParser();
    try {
        const response = await fetch(queryUrl);
        const xmlText = await response.text();

        const xml = domParser.parseFromString(xmlText, 'text/xml');
        const allItemsList = xml.querySelectorAll('item');

        return Array.from(allItemsList).map(xmlToNewsItem);
    } catch (err) {
        return [];
    }
};
