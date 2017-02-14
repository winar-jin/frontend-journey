let cheerio = require('cheerio');
let dom = `
    <ul id="fruits">
        <li class="apple">Apple</li>
        <li class="orange">Orange</li>
        <li class="pear">Pear</li>
    </ul>`;

let $ = cheerio.load(dom);
console.log($.html());

console.log($('.apple','#fruits').text());

$('ul').attr('id');
let favorite = $('ul .orange').attr('id','favorite').html();
console.log($('.pear').hasClass('pear'));
console.log($('.pear').removeAttr('class').html());
console.log($('#fruits').find('li').length);
console.log($('.pear').parents().html());
console.log($('#fruits').children().first().text());
$('ul').append('<li class="plum">Plum</li>')
console.log($.html());
console.log($('#fruits').html('<li class="mango">Mango</li>').html());
console.log($.html());
console.log($('li').toArray());