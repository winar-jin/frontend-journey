// 1. 善于使用三元运算符 表达式？true ：false
// var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
//   todo: [],
//   completed: []
// };

// 2. 将使用次数多的封装为函数，也方便之后又问题之后的修改
// function dataObjectUpdated() {
//   localStorage.setItem('todoList', JSON.stringify(data));
// }

let addItemButton = document.querySelector('header button[id="addItem"]');
let inputfiled = document.querySelector('header input')
addItemButton.addEventListener('click', addtodoItem);
inputfiled.addEventListener('keydown',enterSubmit);
let removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
let completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

let itemObj = {
    todoItem: [],
    completeItem: []
};

function enterSubmit(e){
    if(e.keyCode === 13){
        addtodoItem();
    }
}

// addtodoItem
function addtodoItem() {
    let itemDom = document.querySelector('header input');
    let item = itemDom.value;
    let flag = 1;
    if (localStorage.getItem('itemSto') !== null) {
        let itemSto = JSON.parse(localStorage.getItem('itemSto'));
        let todoItemSto = itemSto.todoItem;
        if (todoItemSto.indexOf(item) !== -1) {
            flag = 0;
            alert("You have add the same thing!")
        } else if (!item) {
            flag = 0;
        }
    } else {
        if (!item) {
            flag = 0;
        }
    }

    if (flag) {
        if (localStorage.getItem('itemSto') === null) {
            itemObj.todoItem.push(item);
            localStorage.setItem('itemSto', JSON.stringify(itemObj));
        } else {
            let itemSto = JSON.parse(localStorage.getItem('itemSto'));
            itemSto.todoItem.push(item);
            localStorage.setItem('itemSto', JSON.stringify(itemSto));
        }
        addToDom(item, 'todoItem');
    }
    itemDom.value = '';
}


//remove items
function removeItem(e) {
    let itemDom = this.parentNode.parentNode;
    // console.log(itemDom);
    let item = itemDom.firstChild.nodeValue;
    // let parentNode = itemDom.parentNode;
    // let childLi = parentNode.childNodes;

    // for (let i in childLi) {
    //     if (item === childLi[i].firstChild.nodeValue) {
    //         parentNode.removeChild(childLi[i]);
    //     }else{
    //         return false;
    //     }
    // }
    let todoItemSec = document.querySelector('#todoItem ul');
    let todeItemLis = todoItemSec.childNodes;
    let finishedItemSec = document.querySelector('#finishedItem ul');
    let finishedItemLis = finishedItemSec.childNodes;
    for (let i = 0; i < todeItemLis.length; i++) {
        if (todeItemLis[i].nodeName === 'LI') {
            todoItemSec.removeChild(todeItemLis[i]);
            --i;
        }
    }
    for (let i = 0; i < finishedItemLis.length; i++) {
        if (finishedItemLis[i].nodeName === 'LI') {
            finishedItemSec.removeChild(finishedItemLis[i]);
            --i;
        }
    }

    // delete from localStorage
    let itemSto = JSON.parse(localStorage.getItem('itemSto'));
    let todoItemSto = itemSto.todoItem;
    let completeSto = itemSto.completeItem;
    if (todoItemSto.indexOf(item) !== -1) {
        todoItemSto.splice(todoItemSto.indexOf(item), 1);
    } else if (completeSto.indexOf(item) !== -1) {
        completeSto.splice(completeSto.indexOf(item), 1);
    }
    itemSto.todoItem = todoItemSto;
    itemSto.completeItem = completeSto;
    localStorage.setItem('itemSto', JSON.stringify(itemSto));
    renderDom();
}

function completeToggleItem() {
    let itemSto = JSON.parse(localStorage.getItem('itemSto'));
    let todoItemSto = itemSto.todoItem;
    let completeSto = itemSto.completeItem;

    let item = this.parentNode.parentNode;
    let itemName = item.firstChild.nodeValue;
    let identify = item.parentNode.parentNode.id;
    if (identify === 'todoItem') {
        let tem = todoItemSto.splice(todoItemSto.indexOf(itemName), 1);
        completeSto.unshift(tem[0]);
        item.classList.add('complete');
    } else if (identify === 'finishedItem') {
        let tem = completeSto.splice(completeSto.indexOf(itemName), 1);
        todoItemSto.unshift(tem[0]);
        item.classList.remove('complete');
    }

    itemSto.todoItem = todoItemSto;
    itemSto.completeItem = completeSto;
    localStorage.setItem('itemSto', JSON.stringify(itemSto));

    let toggleId = (identify === 'todoItem') ? 'finishedItem' : 'todoItem';
    let toggleParent = document.querySelector(`section[id=${toggleId}] ul`);
    let togglrChild = toggleParent.childNodes[0];
    toggleParent.insertBefore(item, togglrChild);
}


function addToDom(item, id) {
    let todoSection = document.querySelector(`#${id} ul`);
    // let todoSection = document.querySelector('#todoItem ul');
    let firstChild = todoSection.firstChild;


    let todoItem = document.createElement('li');
    todoItem.innerHTML = item;
    if(id === 'finishedItem'){
        todoItem.classList.add('complete');
    }

    let buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('class', 'button');

    let removeButton = document.createElement('button');
    removeButton.setAttribute('id', 'remove');
    removeButton.innerHTML = removeSVG;
    removeButton.addEventListener('click', removeItem);

    let completeButton = document.createElement('button');
    completeButton.setAttribute('id', 'complete');
    completeButton.innerHTML = completeSVG;
    completeButton.addEventListener('click', completeToggleItem);

    buttonDiv.appendChild(removeButton);
    buttonDiv.appendChild(completeButton);
    todoItem.appendChild(buttonDiv);
    // todoSection.appendChild(todoItem);  //add to the end of the list
    todoSection.insertBefore(todoItem, firstChild);
}


function renderDom() {
    let itemSto = JSON.parse(localStorage.getItem('itemSto'));
    let todoItemSto = itemSto.todoItem;
    let completeSto = itemSto.completeItem;
    for (let i = todoItemSto.length - 1 ;i>=0;i--) {
        addToDom(todoItemSto[i], 'todoItem');
    }
    for (let i = completeSto.length - 1 ;i>=0;i--) {
        addToDom(completeSto[i], 'finishedItem');
    }
}
renderDom();



