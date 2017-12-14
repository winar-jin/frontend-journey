function countDown(count, interval, callback) {
  if (count <= 0) return;
  callback(count);
  setTimeout(function update() {
    if (--count > 0) {
      setTimeout(update, interval);
    }
    callback(count);
  }, interval)
}

// countDown(10, 1000, t => console.log(t));

function __matchArgs__(fn) {
  return function (...args) {
    if (args.length !== fn.length) {
      throw RangeError('Arguments not match');
    }
    return fn.apply(this, args);
  }
}

var add = __matchArgs__((a, b, c) => a + b + c);

// console.log(add(1, 2, 3));
// console.log(add(4, 5));

function restAdd(...number) {
  return number.reduce((a, b) => a + b);
}

// console.log(restAdd(1, 2, 3, 4));

function __rest__(fn) {
  let length = fn.length;
  return function () {
    let args = [].slice.call(arguments, 0, length - 1);
    let rest = [].slice.call(arguments, length - 1);
    console.log(args, rest);
    return fn.apply(this, args.concat([rest]));
  }
}

let restLikeAdd = __rest__(function (num) {
  return num.reduce((a, b) => a + b);
});

// console.log(restLikeAdd(1, 2, 3, 4));

// function addthrow(x = (() =>throw new Error('args not match');),y = 0){
//   return x + y;
// }
// console.log(addthrow());

let Class = (function () {
  let privateVar = 'privateVar';

  function Class() {
    this.publicVar = 'publicVar';
  }

  Class.prototype.getPrivate = function () {
    return privateVar;
  };
  return Class;
})();

let newclass = new Class();

// console.log(newclass.publicVar, newclass.privateVar, newclass.getPrivate());

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// wait(500).then(() => {
//   console.log('step 1');
//   return wait(1000);
// }).then(() => {
//   console.log('step 2');
// });

// (async function () {
//   await wait(500);
//   console.log('step 3');
//   await wait(1000);
//   console.log('step 4');
// })();

function __multi__(fn) {
  return function (arrayLike, ...args) {
    console.log([...args]);
    return Array.from(arrayLike).map(item => fn(item, ...args));
  }
}

let multiAdd = __multi__((a, b, c) => a + b + c);

// console.log(multiAdd([1, 2, 3, 4], 3, 4));

console.log('hello world!');