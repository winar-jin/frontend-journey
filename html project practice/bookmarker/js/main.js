document.querySelector('#bookmarks').addEventListener('submit', addUrl);

function addUrl(e) {
    let webName = document.querySelector('#webName').value;
    let webUrl = document.querySelector('#webUrl').value;
    if(!webName && !webUrl){
        alert("Please enter something!");
        return false;
    } 
    let bookmark = {
        webName: webName,
        webUrl: webUrl
    };
    console.log(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmark));
    // if (localStorage.getItem('bookmarks') == null) {
    //     localStorage.setItem('bookmarks', JSON.stringify(bookmark));
    // } else {
    //     let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    //     console.log(bookmarks);
    // }
    e.preventDefault();
}
function local(){
    localStorage.setItem('Helo',4);
}