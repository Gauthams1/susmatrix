var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var routes = require('./routes/index');
 var routes2 = require('./routes/temp');
var mongo = require('mongodb');
var mongoose = require('mongoose');

// Init App
var app = express();
//mongoose.connect('mongodb://gauth:1234@ds131989.mlab.com:31989/susmatrix');
// mongoose.connect('mongodb://localhost/susmatrix');
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));




app.use('/', routes);
app.use('/t', routes2);
app.set('port', (process.env.PORT || 3001));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
