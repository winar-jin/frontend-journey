/**
 * @ignore  =====================================================================================
 * @fileoverview 手势密码的设定与验证
 * @author  xujin
 * @version 1.0.0
 * @ignore  created in 2017-03-28
 * @ignore  =====================================================================================
 */

/**
 * 坐标类
 * 
 * @param {any} x x坐标
 * @param {any} y y坐标
 */
let Point = function (x, y) {
    this.x = x;
    this.y = y;
}

/**
 * 圆圈类：解锁屏幕的每一个圆圈
 * 
 * @param {any} x x坐标
 * @param {any} y y坐标
 * @param {any} r 半径
 * @param {number} [borderWidth=3] 圆的宽度
 */
let Circle = function (x, y, r, borderWidth) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.borderWidth = borderWidth || 3;
}
// 定义圆圈原型链方法
Circle.prototype = {
    // 画圆
    draw: function (obj) {
        if (!obj) throw new Error('wrong param in draw function');
        if (!this.x || !this.y) throw new Error('wrong centre of a circle');
        if (!this.r || this.r <= 0) throw new Error('the radius must have it\'s meaning at least greater than zero');
        obj.borderWidth = this.borderWidth;
        obj.beginPath();
        obj.arc(this.x, this.y, this.r, 0, Math.PI * 2); // 画圆
        obj.lineWidth = this.borderWidth; // 圆圈的宽度
        obj.strokeStyle = '#7289da'; // 圆圈的颜色
        obj.stroke();
    },

    // 判断坐标是否在当前的圆内
    isContain: function (x, y) {
        return (Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2) < Math.pow(this.r, 2)) ? true : false;
    },

    // 判断前后两个圆是否相等
    isEquals: function (lastCircle) {
        return (this.x === lastCircle.x && this.y === lastCircle.y && this.r === lastCircle.r) ? true : false;
    }
}

/**
 * 主逻辑： 手势密码类
 * 
 * @param {any} canvasID canvas的ID值
 * @param {any} passwordLength 手势密码的长度
 * @param {any} circleNumOfLine 每一行有多少个圆圈
 */
let GesturePassword = function (canvasID, passwordLength, circleNumOfLine) {
    this.canvasID = canvasID; // 页面中canvas的ID
    this.canvas = document.getElementById(this.canvasID); // 获取canvas的DOM元素
    this.context = this.canvas.getContext('2d'); // 设置canvas的上下文为2d渲染对象
    this.passwordLength = passwordLength || 4; // 设置密码的长度
    this.circleNumOfLine = circleNumOfLine || 3; // 设置每行的圆圈个数
    this.circles = []; // 所有的圆圈
    this.radioType; // 是否进行密码验证标志
    this.isPressed; // 是否按下鼠标标志
    this.savedCircles = []; // 本次划过所保存的圆圈
    this.firstSavedCircles = []; // 第一次输入的密码
}
// 定义手势密码类的原型链方法
GesturePassword.prototype = {
    // 初始化画布
    init: function (obj) {
        if (!this.canvasID) throw new Error('don\'t get the right canvasID,please check it');
        // 初始化所有的事件监听
        this.initAllEvents(obj);

        // 画圆
        this.initCircles();

        // 开始前都清空本地localStorage存储的密码
        localStorage.removeItem('gesturepassword');

    },

    // 初始化所有圆圈
    initCircles: function () {

        let pieceWidth = this.canvas.width / (this.circleNumOfLine + 1);
        let pieceHeight = this.canvas.height / (this.circleNumOfLine + 1);
        let r = Math.min(pieceWidth, pieceHeight) / 4;
        for (let i = 1; i <= this.circleNumOfLine; i++) {
            for (let j = 1; j <= this.circleNumOfLine; j++) {
                let circle = new Circle(pieceWidth * i, pieceHeight * j, r);
                circle.draw(this.context);
                this.circles.push(circle);
            }
        }
    },

    // 初始化所有的事件监听
    initAllEvents: function (obj) {
        let length = Math.min(document.body.scrollWidth, document.body.scrollHeight);
        this.canvas.width = length;
        this.canvas.height = length;
        this.radioType = 'setGesture';
        this.canvas.addEventListener('touchstart', (e) => {
            obj.mouseDown(e);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            obj.mouseMove(e);
        });
        this.canvas.addEventListener('touchend', (e) => {
            obj.mouseUp(e);
        });
        // 初始化时对单选按钮的时间监听
        const setGestureRadio = document.querySelector('#setGesture');
        const verifyGestureRadio = document.querySelector('#verifyGesture');
        const titleElem = document.getElementById('title');
        const remindElem = document.getElementById('remind');
        setGestureRadio.addEventListener('touchend', () => {
            localStorage.removeItem('gesturepassword');
            titleElem.innerHTML = '你好，请先绘制解锁图案！';
            remindElem.innerHTML = ' ';
        });
        verifyGestureRadio.addEventListener('touchend', () => {
            if (!localStorage.getItem('gesturepassword')) {
                titleElem.innerHTML = '您还未设置密码呢，请先设置密码哦！';
                remindElem.innerHTML = ' ';
            } else {
                titleElem.innerHTML = '请输入手势密码进行解锁！';
                remindElem.innerHTML = ' ';
            }
        });
    },

    // touchstart，相当于鼠标按下
    mouseDown: function (e) {
        e.preventDefault();
        if (document.getElementById('setGesture').checked) {
            this.radioType = 'setGesture';
        }
        if (document.getElementById('verifyGesture').checked) {
            this.radioType = 'verifyGesture';
        }
        this.isPressed = true; // 标志位鼠标已经按下
        this.savedCircles = []; // 在新的一次点击之前，清除上一次的划过的痕迹
    },

    // touchmove,相当于鼠标移动
    mouseMove: function (e) {
        if (!this.isPressed) {
            return;
        }
        this.throughCircle(e);
        this.fixDraw();
        if (this.savedCircles.length > 0) {
            let start = this.savedCircles[this.savedCircles.length - 1];
            let end = this.getCursorPos(e);
            this.drawLine(start, end);
        }
    },

    // touchend,相当于鼠标抬起
    mouseUp: function (e) {
        const titleElem = document.getElementById('title');
        const remindElem = document.getElementById('remind');
        this.isPressed = false;
        // 判断本地是否有密码缓存
        if (!localStorage.getItem('gesturepassword')) {
            // 保存密码的环节
            if (this.savedCircles.length < this.passwordLength) {
                this.savedCircles = [];
                remindElem.innerHTML = '手势密码必须大于' + this.passwordLength + '个节点哦！';
            } else if (this.firstSavedCircles.length != 0) {
                if (this.savedCircles.length != this.firstSavedCircles.length) {
                    this.firstSavedCircles = this.savedCircles = [];
                    remindElem.innerHTML = '两次输入的密码不同，请重新输入！';
                    remindElem.style.color = 'red';
                    this.fixDraw();
                } else {
                    for (let i = 0; i < this.savedCircles.length; i++) {
                        if (!this.savedCircles[i].isEquals(this.firstSavedCircles[i])) {
                            remindElem.innerHTML = '两次输入的密码不同，请重新输入！';
                            remindElem.style.color = 'red';
                            this.firstSavedCircles = this.savedCircles = [];
                            this.fixDraw();
                            break;
                        } else {
                            // 两次输入的密码相同，保存密码
                            localStorage.setItem('gesturepassword', hex_sha1(JSON.stringify(this.savedCircles)));
                            remindElem.innerHTML = '手势密码保存成功！';
                            titleElem.innerHTML = '请进行手势密码验证！';
                            document.querySelector('#verifyGesture').checked = true;
                            remindElem.style.color = 'green';
                            this.context.strokeStyle = "green";
                            this.savedCircles = this.firstSavedCircles = [];
                            break;
                        }
                    }
                }
            }
            // 第一次登录，存储其手势密码
            else {
                this.firstSavedCircles = this.savedCircles;
                remindElem.innerHTML = '请再次输入确认密码！';
                this.fixDraw();
                this.savedCircles = [];
            }
        }
        // 已经存储过密码了，直接进行验证
        else {
            if (this.radioType != 'setGesture') {
                if (hex_sha1(JSON.stringify(this.savedCircles)) == localStorage.getItem('gesturepassword')) {
                    remindElem.innerHTML = '密码正确！';
                    remindElem.style.color = 'green';
                    titleElem.innerHTML = '恭喜你，验证通过！';
                    this.savedCircles = [];
                    this.context.strokeStyle = 'green';
                } else {
                    remindElem.innerHTML = '您输入的手势密码不正确，请重新输入！';
                    remindElem.style.color = 'red';
                    titleElem.innerHTML = '请再次验证手势密码！'
                    this.context.strokeStyle = 'red';
                    this.savedCircles = [];
                }
            } else {
                remindElem.innerHTML = '您已经设置过手势密码，请进行手势密码验证或重设手势密码！';
                remindElem.style.color = 'green';
                document.querySelector('#verifyGesture').checked = true;
                this.savedCircles = this.firstSavedCircles = [];
            }
        }
        this.fixDraw();
        this.context.font = '14px';
        this.context.strokeStyle = '#7289da';
    },

    // 是否划过圆圈，若划过圆圈，则记录该圆圈，并连接两个圆圈的圆心
    throughCircle: function (e) {
        let cursorPos = this.getCursorPos(e);
        // 如果改点已经划过了，就不允许再划了
        for (let i = 0; i < this.savedCircles.length; i++) {
            if (this.savedCircles[i].isContain(cursorPos.x, cursorPos.y)) {
                return;
            }
        }
        // 如果改点尚未划过，则第一次划过后就保存该点
        for (let i = 0; i < this.circles.length; i++) {
            if (this.circles[i].isContain(cursorPos.x, cursorPos.y)) {
                this.savedCircles.push(this.circles[i]);
            }
        }
    },

    // 返回当前鼠标点的坐标
    getCursorPos: function (e) {
        e.preventDefault();
        let touch = e.targetTouches[0];
        let x = touch.pageX - this.canvas.offsetLeft;
        let y = touch.pageY - this.canvas.offsetTop;
        return new Point(x, y);
    },

    // 画出连接两点的线
    drawLine: function (start, end) {
        this.context.beginPath();
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
        this.context.stroke();
    },

    // 修复两点间连线的问题
    fixDraw: function () {
        this.rebuiltCanvas();
        for (let i = 0; i < this.circles.length; i++) {
            this.circles[i].draw(this.context);
        }
        for (let i = 1; i < this.savedCircles.length; i++) {
            this.drawLine(this.savedCircles[i - 1], this.savedCircles[i]);
        }
    },

    // 清除canvas
    rebuiltCanvas: function () {
        let lineGradient = this.context.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        lineGradient.addColorStop(0, '#e5eff3');
        lineGradient.addColorStop(1, '#FFFFFF');
        this.context.fillStyle = lineGradient;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

/**
 * 手势密码的设定与初始化方法
 * 
 * @param {any} canvasID 页面中canvas的ID
 * @param {any} passwordLength 手势密码的长度
 * @param {any} circleNumOfLine 每一行有多少个圆圈
 */
function GesturesPasswordInit(canvasID, passwordLength, circleNumOfLine) {
    let gesturePassword = new GesturePassword(canvasID, passwordLength, circleNumOfLine);
    gesturePassword.init(gesturePassword);
}

window.onload = function () {
    // CanvasID,密码的长度,每行圆圈的个数
    GesturesPasswordInit('password', 5, 3);
}