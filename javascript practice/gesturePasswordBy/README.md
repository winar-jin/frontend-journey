# 手势密码实现思路
> Author:  xuJin
> Date: 2017-03-28

[预览地址](http://password.xujin.pro/)(建议在移动端查看)

## 实现思路
首先主要依托于Canvas技术，密码面板和手指滑动的时候所连成的线都是基于Canvas所实现的。
在此基础上，对手指的`touchstart`,`touchmove`,`touchend`事件进行监听，当手指按下时判断当前所处的状态，若未设置密码，则进行密码的设置，两次输入确认手势密码；若密码已经设置，则进行密码的验证，输入的手势密码和所保存的密码相同则验证通过。
手势密码存储在本地 localStorage 中，为确保密码的安全，不保存明文密码，采用安全哈希算法（sha1）进行密码的加密，在本地localStorage中存储其Hash值。

## 具体实现
### 圆圈类 Circle
将手势面板的的所有密码圆圈抽象成Circle类，它主要具备以下三个功能：画圆圈、判断当前坐标是否在圆圈内、判断设定和验证是的圆圈是不是一个圆。
Circle类原型如下：
```javascript
/**
 * 圆圈类：解锁屏幕的每一个圆圈
 * 
 * @param {any} x x坐标
 * @param {any} y y坐标
 * @param {any} r 半径
 * @param {number} [borderWidth=3] 圆的宽度
 */
let Circle = function (x, y, r, borderWidth){...};
Circle.prototype = {
	// 画圆
	draw: function(obj){...},
	// 判断坐标是否在当前的圆内
	isContain: function (x, y){...},
	// 判断前后两个圆是否相等
	isEquals:function (lastCircle){...}
};
```
### 坐标类 Point
由于在接下来对手势密码的验证，存储等过程中主要依赖点的坐标，根据点的坐标来判断两次输入的密码是否相同，并且在localStorage中为hash前存储的也是密码的点坐标数组，因此，我认为有必要将坐标抽象为一个类。
Point类的原型如下：
```javascript
/**
 * 坐标类
 * 
 * @param {any} x x坐标
 * @param {any} y y坐标
 */
let Point = function (x, y){...}
```
### 手势密码类 GesturePassword
该类包含了手势密码的所有主逻辑，主要包含在页面加载完成后对页面的初始化操作（手势密码面板的圆圈绘制，初始化所有的DOM元素的事件监听），手指划过的事件判断（保存密码或是验证密码），以及手指划过时两点之间的连线等。
其中手指结束滑动（`touchend`事件）的逻辑最为复杂，主要做了以下工作：首先判断本地localStorage是否缓存了手势密码，若已经缓存过密码，则进行密码的判断；若本地没有缓存过密码，则进行密码的存储于判断，若密码长度小于5，设置失败，若密码长度大于5，且前后两次输入的密码相同，则存储被hash过得密码值。
其中，密码的加密主要使用了sha1.js的加密算法，在页面中引入该js文件，通过`hex_sha1(‘待加密字符串’)`即可对待加密的字符串进行hash加密。
GesturePassword类原型如下：
```javascript
/**
 * 主逻辑： 手势密码类
 * 
 * @param {any} canvasID canvas的ID值
 * @param {any} passwordLength 手势密码的长度
 * @param {any} circleNumOfLine 每一行有多少个圆圈
 */
let GesturePassword = function (canvasID, passwordLength, circleNumOfLine) {...}
GesturePassword.prototype = {
	// 初始化画布
  init: function (obj) {...},
	// 初始化所有圆圈
  initCircles: function () {...},
	// 初始化所有的事件监听
	initAllEvents: function (obj) {...},
	// touchstart，相当于鼠标按下
  mouseDown: function (e) {...},
	// touchmove,相当于鼠标移动
  mouseMove: function (e) {...},
	// touchend,相当于鼠标抬起
  mouseUp: function (e) {...},
	// 是否划过圆圈，若划过圆圈，则记录该圆圈，并连接两个圆圈的圆心
  throughCircle: function (e) {...},
	// 返回当前鼠标点的坐标
  getCursorPos: function (e) {...},
	// 画出连接两点的线
  drawLine: function (start, end) {...},
	// 修复两点间连线的问题
  fixDraw: function () {...},
	// 清除canvas
  rebuiltCanvas: function () {...}
};
```
### 手势密码的设定与初始化 GesturesPasswordInit
通过以上Circle类，Point类以及GesturePassword类的实现，已经实现了手势密码的设定与验证的主要工作，最后是把对整个手势密码类进行抽象与封装，这样只要在使用的时候给GesturesPasswordInit方法传入canvas画布ID，密码的长度，每一行圆圈的个数，即可初始化完成一个手势密码的业务功能。
GesturesPasswordInit类的原型如下：
```javascript
/**
 * 手势密码的设定与初始化方法：
 * 
 * @param {any} canvasID 页面中canvas的ID
 * @param {any} passwordLength 手势密码的长度
 * @param {any} circleNumOfLine 每一行有多少个圆圈
 */
function GesturesPasswordInit(canvasID, passwordLength, circleNumOfLine){...}
```
最后在页面加载完成后，只要调用GesturesPasswordInit函数即可初始化成功一个手势密码的实现。
```javascript
window.onload = function () {
	// CanvasID,密码的长度,每行圆圈的个数
  GesturesPasswordInit('password', 5, 3);
}
```

2017.03.28