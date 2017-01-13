document.querySelector('#bookmarks').addEventListener('submit', addUrl);

function addUrl(e) {
    let webName = document.querySelector('#webName').value;
    let webUrl = document.querySelector('#webUrl').value;
    if (!validata(webName, webUrl)) {
        return false;
    }
    if(webName === ''){
        webName = webUrl;
    }
    let bookmark = {
        webName: webName,
        webUrl: webUrl
    };
    if (ifHave(webUrl)) {
        if (localStorage.getItem('bookmarks') === null) {
            let bookmarks = [];
            bookmarks.push(bookmark);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        } else {
            let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
            bookmarks.push(bookmark);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }
    } else {
        return false;
    }

    reFetch();
    document.querySelector('#bookmarks').reset();
    e.preventDefault();
}

function reFetch() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    document.querySelector('#result').innerHTML = '';
    for (let i in bookmarks) {
        let webName = bookmarks[i].webName;
        let webUrl = bookmarks[i].webUrl;
        document.querySelector('#result').innerHTML += '<div class="well">' +
            '<span>' + webName + '</span>' +
            '<a class="btn btn-primary" href="' + webUrl + '" target="_blank">Visit</a>' +
            '<a class="btn btn-danger" onclick="delWebsite(\'' + webUrl + '\')">Delete</a>' +
            '</div>';
    }
}

function delWebsite(url) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    for (let i in bookmarks) {
        let webName = bookmarks[i].webName;
        let webUrl = bookmarks[i].webUrl;
        if (webUrl === url) {
            bookmarks.splice(i, 1);
        }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    reFetch();
}

function validata(name, url) {
    if (!name && !url) {
        alert("all empty");
        return false;
    }
    let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    let regex = new RegExp(expression);
    if (!url.match(regex)) {
        alert("unavilable website");
        return false;
    }
    return true;
}

function ifHave(url) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    for (let i in bookmarks) {
        let webUrl = bookmarks[i].webUrl;
        if (webUrl === url) {
            alert("This website has already exist!");
            return false;
        }
    }
    return true;
}