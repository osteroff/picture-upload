var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

app.use(cookieParser('fadfsdafdsa#@!#!@dfafd'));  // 쿠키를 암호화 하기 위해 key값을 인자로 준다.

var products = {
  1: {title: 'The history of web 1'},
  2: {title: 'The next web'},
  3: {title: 'The next next web'}
}

app.get('/products', function(req, res) {
  var output = '';
  for (var name in products) {
    output += `<li>
      <a href="/cart/${name}">${products[name].title}</a>
    </li>`
    console.log(products[name]);
  }
  res.send(`<h1>Product</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});

app.get('/cart', function(req, res) {
  var cart = req.cookies.cart;
  if (!cart) {
    res.send('Empty!');
  }
  else {
    var output = '';
    for (var id in cart) {
      console.log(products[id].title);
      output += `<li>${products[id].title} (${cart[id]})</li>`
    }
  }
  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul><a href="/products">Products List</a>`);
})
app.get('/cart/:id', function(req, res) {
  var id = req.params.id;
  if (req.cookies.cart) {
    var cart = req.cookies.cart;
  } else {
    var cart = {};
  }
  if (!cart[id])
    cart[id] = 0;
  cart[id] = parseInt(cart[id]) + 1;

  res.cookie('cart', cart);
  res.redirect('/cart');;
});
app.get('/count', function(req, res) {
  if (req.signedCookies.count) {  // 암호화된 쿠키를 해석
    var count = parseInt(req.signedCookies.count);
  } else {
    var count = 0;
  }

  count = count + 1;
  res.cookie('count', count, {signed:true});
  res.send('count : ' + req.cookies.count);
});

app.listen(3003, function() {
  console.log('Connected 3003 port!!!');
})
