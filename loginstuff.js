var CookieParser = require('cookie-parser');
var Session = require('session');
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Initialize login
Passport.use(new LocalStrategy(
  { usernameField: 'username'
  , passwordField: 'password'
  }, function(username, password, done)
  {
    if (username === 'jotihunt' && password === 'Vos1@Hunt!')
      return done(null, { id: 1 });
    else
      return done(null, false, { message: 'Verkeerde gebruikersnaam en/of wachtwoord' });
  }));

Passport.serializeUser(function(user, done)
{
  done(null, user.id);
});

Passport.deserializeUser(function(id, done)
{
  if (id === 1)
    done(null, { id: 1});
  else
    done(null, false, { message: 'Ongeldige userid' });
});

app.use(CookieParser());
app.use(Session.Session({ secret: "This is a secret" }));

// Require login for certain pages
app.use(function(req, res, next)
{
  console.log(req.path);
  if (req.user == null && req.path === '/map.html')
    res.redirect('/login');
  next();
});


////////////////////////////////////////////////////////////////////////////////
//
// Inloggen/uitloggen
//

app.get('/login', function(req, res)
{
  if (req.user)
    res.redirect('/');
  else
  {
    var loginform = '<!doctype html>'
                  + '<head>'
                  + '<title>JotiHunt</title>'
                  + '<meta name="viewport" content="width=device-width, user-scalable=no">'
                  + '<link href="css/jotihunt.css" rel="stylesheet">'
                  + '</head>'
                  + '<body>'
                  + '<h1>JotiHunt</h1>'
                  + (req.session && req.session.messages ? '<p>' + req.session.messages + '</p>' : '')
                  + '<form action="/login" method="post">'
                  + '<input name="username" type="text" placeholder="Gebruikersnaam" />'
                  + '<input name="password" type="password" placeholder="Wachtwoord" />'
                  + '<button><span class="entypo-key"></span></button>'
                  + '</form>'
                  + '</body>'
                  + '</html>';
    if (req.session)
      req.session.messages = null;
    res.send(loginform);
  }
});

app.post('/login', function(req, res, next)
{
  Passport.authenticate('local', function(err, user, info)
  {
    if (err)
      return next(err);

    if (!user)
    {
      req.session.messages = info.message;
      return res.redirect('/login');
    }

    req.logIn(user, function(err)
    {
      if (err)
      {
        req.session.messages = 'Er is een fout opgetreden';
        return next(err);
      }

      return res.redirect('/');
    });
  })(req, res, next);
});

function requireAuth(req, res, next)
{
  if (!req.isAuthenticated())
  {
    req.session.messages = 'Je moet inloggen om deze pagina te bekijken';
    res.redirect('/login');
  }
  next();
}
