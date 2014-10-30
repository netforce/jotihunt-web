var Express = require('express');
var BodyParser = require('body-parser');
var Backbone = require('backbone-mysql');
var MySQL = require('mysql');
var JotiHunt = require('js/jotihunt')({ Backbone: Backbone });

////////////////////////////////////////////////////////////////////////////////
//
// Initialization
//

// Initialize the MySQL backend connection
Backbone.client = MySQL.createConnection(
  { host    : 'localhost'
  , user    : 'krisb'
  , password: 'Koekje!@#'
  , database: 'jotihunt'
  });

// Initialize the application
var app = Express();
// Parse the request body as JSON object
app.use(BodyParser.json());
// Server all files within the 'public' directory as-is
app.use(Express.static('public'));


////////////////////////////////////////////////////////////////////////////////
//
// Deelnemers
//

// Return all deelnemers
app.get('/deelnemers', function(req, res)
{
  var deelnemers = new JotiHunt.DeelnemersCollection();
  deelnemers.fetch(
    { success: function (collection, response, options)
      {
        var value = [];
        for (var i = 0; i < collection.length; ++i)
        {
          var model = collection.at(i);
          value.push({ naam: model.get('naam')
                     , id: model.get('id')
                     , telefoonnummer: model.get('telefoonnummer')
                     , chauffeur: !!model.get('chauffeur')
                     });
        }
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Return a specific deelnemer
app.get('/deelnemers/:id', function(req, res)
{
  var deelnemer = new JotiHunt.DeelnemerModel({ id: req.params.id });
  deelnemer.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , naam: model.get('naam')
                    , telefoonnummer: model.get('telefoonnummer')
                    , chauffeur: !!model.get('chauffeur')
                    };
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Create a new deelnemer
app.post('/deelnemers', function(req, res)
{
  var deelnemer = new JotiHunt.DeelnemerModel(req.body);
  deelnemer.save(null,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Update an existing deelnemer
app.put('/deelnemers/:id', function(req, res)
{
  var deelnemer = new JotiHunt.DeelnemerModel({ id: req.params.id });
  deelnemer.save(req.body,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Delete an existing deelnemer
app.delete('/deelnemers/:id', function(req, res)
{
  var deelnemer = new JotiHunt.DeelnemerModel({ id: req.params.id });
  deelnemer.destroy(
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});


////////////////////////////////////////////////////////////////////////////////
//
// Activiteiten
//

// Return all activiteiten
app.get('/activiteiten', function(req, res)
{
  var activiteiten = new JotiHunt.ActiviteitenCollection();
  activiteiten.fetch(
    { success: function (collection, response, options)
      {
        var value = [];
        for (var i = 0; i < collection.length; ++i)
        {
          var model = collection.at(i);
          value.push({ id: model.get('id')
                     , uur: model.get('uur')
                     , deelnemer: model.get('deelnemer')
                     , type: model.get('type')
                     });
        }
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Create a new activiteit
app.post('/activiteiten', function(req, res)
{
  var activiteit = new JotiHunt.ActiviteitModel(req.body);
  activiteit.save(null,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Update an existing activiteit
app.put('/activiteiten/:id', function(req, res)
{
  var activiteit = new JotiHunt.ActiviteitModel({ id: req.params.id });
  activiteit.save(req.body,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Delete an existing activiteit
app.delete('/activiteiten/:id', function(req, res)
{
  var activiteit = new JotiHunt.ActiviteitModel({ id: req.params.id });
  activiteit.destroy(
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});


////////////////////////////////////////////////////////////////////////////////
//
// Autoritten
//

// Return all autoritten
app.get('/autoritten', function(req, res)
{
  var autoritten = new JotiHunt.AutorittenCollection();
  autoritten.fetch(
    { success: function (collection, response, options)
      {
        var value = [];
        for (var i = 0; i < collection.length; ++i)
        {
          var model = collection.at(i);
          value.push({ id: model.get('id')
                     , chauffeur: model.get('chauffeur')
                     , bijrijder_1: model.get('bijrijder_1')
                     , bijrijder_2: model.get('bijrijder_2')
                     , bijrijder_3: model.get('bijrijder_3')
                     , deelgebied: model.get('deelgebied')
                     , instamapper: model.get('instamapper')
                     , weer_terug: model.get('weer_terug')
                     });
        }
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Return a specific autorit
app.get('/autoritten/:id', function(req, res)
{
  var autorit = new JotiHunt.AutoritModel({ id: req.params.id });
  autorit.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , chauffeur: model.get('chauffeur')
                    , bijrijder_1: model.get('bijrijder_1')
                    , bijrijder_2: model.get('bijrijder_2')
                    , bijrijder_3: model.get('bijrijder_3')
                    , deelgebied: model.get('deelgebied')
                    , instamapper: model.get('instamapper')
                    , weer_terug: model.get('weer_terug')
                    };
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Create a new autorit
app.post('/autoritten', function(req, res)
{
  var autorit = new JotiHunt.AutoritModel(req.body);
  autorit.save(null,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Partially update an existing autorit
app.patch('/autoritten/:id', function(req, res)
{
  var autorit = new JotiHunt.AutoritModel({ id: req.params.id });
  autorit.fetch(
    { success: function (model, response, options)
      {
        var value = { id: req.params.id
                    , chauffeur: model.get('chauffeur')
                    , bijrijder_1: model.get('bijrijder_1')
                    , bijrijder_2: model.get('bijrijder_2')
                    , bijrijder_3: model.get('bijrijder_3')
                    , deelgebied: model.get('deelgebied')
                    , instamapper: model.get('instamapper')
                    , weer_terug: model.get('weer_terug')
                    };
        for (var k in req.body)
          if (req.body.hasOwnProperty(k))
            value[k] = req.body[k];
        autorit.save(value,
          { success: function (model, response, options)
            {
              res.json({ success: true });
            }
          , error: function(collection, response, options)
            {
              res.status(500).send(response.responseText);
            }
          });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Delete an existing autorit
app.delete('/autoritten/:id', function(req, res)
{
  var autorit = new JotiHunt.AutoritModel({ id: req.params.id });
  autorit.destroy(
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});


////////////////////////////////////////////////////////////////////////////////
//
// Hints
//

// Return all hints
app.get('/hints', function(req, res)
{
  var hints = new JotiHunt.HintsCollection();
  hints.fetch(
    { success: function (collection, response, options)
      {
        var value = [];
        for (var i = 0; i < collection.length; ++i)
        {
          var model = collection.at(i);
          value.push({ id: model.get('id')
                     , hintnaam: model.get('hintnaam')
                     , tijdstip: model.get('tijdstip')
                     , alpha_opgelost: model.get('alpha_opgelost')
                     , bravo_opgelost: model.get('bravo_opgelost')
                     , charlie_opgelost: model.get('charlie_opgelost')
                     , delta_opgelost: model.get('delta_opgelost')
                     , echo_opgelost: model.get('echo_opgelost')
                     , foxtrot_opgelost: model.get('foxtrot_opgelost')
                     });
        }
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Return a specific hint
app.get('/hints/:id', function(req, res)
{
  var hint = new JotiHunt.HintModel({ id: req.params.id });
  hint.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , hintnaam: model.get('hintnaam')
                    , tijdstip: model.get('tijdstip')
                    , alpha_opgelost: model.get('alpha_opgelost')
                    , bravo_opgelost: model.get('bravo_opgelost')
                    , charlie_opgelost: model.get('charlie_opgelost')
                    , delta_opgelost: model.get('delta_opgelost')
                    , echo_opgelost: model.get('echo_opgelost')
                    , foxtrot_opgelost: model.get('foxtrot_opgelost')
                    };
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Create a new hint
app.post('/hints', function(req, res)
{
  var hint = new JotiHunt.HintModel(req.body);
  hint.save(null,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Partially update an existing hint
app.patch('/hints/:id', function(req, res)
{
  var hint = new JotiHunt.HintModel({ id: req.params.id });
  hint.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , hintnaam: model.get('hintnaam')
                    , tijdstip: model.get('tijdstip')
                    , alpha_opgelost: model.get('alpha_opgelost')
                    , bravo_opgelost: model.get('bravo_opgelost')
                    , charlie_opgelost: model.get('charlie_opgelost')
                    , delta_opgelost: model.get('delta_opgelost')
                    , echo_opgelost: model.get('echo_opgelost')
                    , foxtrot_opgelost: model.get('foxtrot_opgelost')
                    };
        for (var k in req.body)
          if (req.body.hasOwnProperty(k))
            value[k] = req.body[k];
        hint.save(value,
          { success: function (model, response, options)
            {
              res.json({ success: true });
            }
          , error: function(collection, response, options)
            {
              res.status(500).send(response.responseText);
            }
          });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Delete an existing hint
app.delete('/hints/:id', function(req, res)
{
  var hint = new JotiHunt.HintModel({ id: req.params.id });
  hint.destroy(
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});


////////////////////////////////////////////////////////////////////////////////
//
// Hunts
//

// Return all hunts
app.get('/hunts', function(req, res)
{
  var hunts = new JotiHunt.HuntsCollection();
  hunts.fetch(
    { success: function (collection, response, options)
      {
        var value = [];
        for (var i = 0; i < collection.length; ++i)
        {
          var model = collection.at(i);
          value.push({ id: model.get('id')
                     , vossenteam: model.get('vossenteam')
                     , vossencode: model.get('vossencode')
                     , tijdstip: model.get('tijdstip')
                     , locatie: model.get('locatie')
                     , status: model.get('status')
                     , punten: model.get('punten')
                     });
        }
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Return a specific hunt
app.get('/hunts/:id', function(req, res)
{
  var hunt = new JotiHunt.HuntModel({ id: req.params.id });
  hunt.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , vossenteam: model.get('vossenteam')
                    , vossencode: model.get('vossencode')
                    , tijdstip: model.get('tijdstip')
                    , locatie: model.get('locatie')
                    , status: model.get('status')
                    , punten: model.get('punten')
                    };
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Create a new hunt
app.post('/hunts', function(req, res)
{
  var hunt = new JotiHunt.HuntModel(req.body);
  hunt.save(null,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Partially update an existing hunt
app.patch('/hunts/:id', function(req, res)
{
  var hunt = new JotiHunt.HuntModel({ id: req.params.id });
  hunt.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , vossenteam: model.get('vossenteam')
                    , vossencode: model.get('vossencode')
                    , tijdstip: model.get('tijdstip')
                    , locatie: model.get('locatie')
                    , status: model.get('status')
                    , punten: model.get('punten')
                    };
        for (var k in req.body)
          if (req.body.hasOwnProperty(k))
            value[k] = req.body[k];
        hunt.save(value,
          { success: function (model, response, options)
            {
              res.json({ success: true });
            }
          , error: function(collection, response, options)
            {
              res.status(500).send(response.responseText);
            }
          });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Delete an existing hunt
app.delete('/hunts/:id', function(req, res)
{
  var hunt = new JotiHunt.HuntModel({ id: req.params.id });
  hunt.destroy(
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});


////////////////////////////////////////////////////////////////////////////////
//
// Opdrachten
//

// Return all opdrachten
app.get('/opdrachten', function(req, res)
{
  var opdrachten = new JotiHunt.OpdrachtenCollection();
  opdrachten.fetch(
    { success: function (collection, response, options)
      {
        var value = [];
        for (var i = 0; i < collection.length; ++i)
        {
          var model = collection.at(i);
          value.push({ id: model.get('id')
                     , coordinator: model.get('coordinator')
                     , deadline: model.get('deadline')
                     , status: model.get('status')
                     , punten: model.get('punten')
                     });
        }
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Return a specific opdracht
app.get('/opdrachten/:id', function(req, res)
{
  var opdracht = new JotiHunt.OpdrachtModel({ id: req.params.id });
  opdracht.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , coordinator: model.get('coordinator')
                    , deadline: model.get('deadline')
                    , status: model.get('status')
                    , punten: model.get('punten')
                    };
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Create a new opdracht
app.post('/opdrachten', function(req, res)
{
  var opdracht = new JotiHunt.OpdrachtModel(req.body);
  opdracht.save(null,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Partially update an existing opdracht
app.patch('/opdrachten/:id', function(req, res)
{
  var opdracht = new JotiHunt.OpdrachtModel({ id: req.params.id });
  opdracht.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , coordinator: model.get('coordinator')
                    , deadline: model.get('deadline')
                    , status: model.get('status')
                    , punten: model.get('punten')
                    };
        for (var k in req.body)
          if (req.body.hasOwnProperty(k))
            value[k] = req.body[k];
        opdracht.save(value,
          { success: function (model, response, options)
            {
              res.json({ success: true });
            }
          , error: function(collection, response, options)
            {
              res.status(500).send(response.responseText);
            }
          });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Delete an existing opdracht
app.delete('/opdrachten/:id', function(req, res)
{
  var opdracht = new JotiHunt.OpdrachtModel({ id: req.params.id });
  opdracht.destroy(
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});


////////////////////////////////////////////////////////////////////////////////
//
// Foto-opdrachten
//

// Return all foto-opdrachten
app.get('/foto_opdrachten', function(req, res)
{
  var fotoopdrachten = new JotiHunt.FotoOpdrachtenCollection();
  fotoopdrachten.fetch(
    { success: function (collection, response, options)
      {
        var value = [];
        for (var i = 0; i < collection.length; ++i)
        {
          var model = collection.at(i);
          value.push({ id: model.get('id')
                     , locatie: model.get('locatie')
                     , status: model.get('status')
                     , punten: model.get('punten')
                     });
        }
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Return a specific foto-opdracht
app.get('/foto_opdrachten/:id', function(req, res)
{
  var fotoopdracht = new JotiHunt.FotoOpdrachtModel({ id: req.params.id });
  fotoopdracht.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , locatie: model.get('locatie')
                    , status: model.get('status')
                    , punten: model.get('punten')
                    };
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Create a new foto-opdracht
app.post('/foto_opdrachten', function(req, res)
{
  var fotoopdracht = new JotiHunt.FotoOpdrachtModel(req.body);
  fotoopdracht.save(null,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Partially update an existing foto-opdracht
app.patch('/foto_opdrachten/:id', function(req, res)
{
  var fotoopdracht = new JotiHunt.FotoOpdrachtModel({ id: req.params.id });
  fotoopdracht.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , locatie: model.get('locatie')
                    , status: model.get('status')
                    , punten: model.get('punten')
                    };
        for (var k in req.body)
          if (req.body.hasOwnProperty(k))
            value[k] = req.body[k];
        fotoopdracht.save(value,
          { success: function (model, response, options)
            {
              res.json({ success: true });
            }
          , error: function(collection, response, options)
            {
              res.status(500).send(response.responseText);
            }
          });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Delete an existing foto-opdracht
app.delete('/foto_opdrachten/:id', function(req, res)
{
  var fotoopdracht = new JotiHunt.FotoOpdrachtModel({ id: req.params.id });
  fotoopdracht.destroy(
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});


////////////////////////////////////////////////////////////////////////////////
//
// Vossenlocaties
//

// Return all vossenlocaties
app.get('/vossenlocaties', function(req, res)
{
  var vossenlocaties = new JotiHunt.VossenlocatiesCollection();
  vossenlocaties.fetch(
    { success: function (collection, response, options)
      {
        var value = [];
        for (var i = 0; i < collection.length; ++i)
        {
          var model = collection.at(i);
          value.push({ id: model.get('id')
		     , vossenteam: model.get('vossenteam')
		     , tijdstip: model.get('tijdstip')
                     , coordinaat: model.get('coordinaat')
                     , adres: model.get('adres')
                     });
        }
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Return a specific vossenlocatie
app.get('/vossenlocaties/:id', function(req, res)
{
  var vossenlocatie = new JotiHunt.VossenlocatieModel({ id: req.params.id });
  vossenlocatie.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
		    , vossenteam: model.get('vossenteam')
                    , tijdstip: model.get('tijdstip')
                    , coordinaat: model.get('coordinaat')
                    , adres: model.get('adres')
                    };
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Create a new vossenlocatie
app.post('/vossenlocaties', function(req, res)
{
  var vossenlocatie = new JotiHunt.VossenlocatieModel(req.body);
  vossenlocatie.save(null,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Delete an existing vossenlocatie
app.delete('/vossenlocaties/:id', function(req, res)
{
  var vossenlocatie = new JotiHunt.VossenlocatieModel({ id: req.params.id });
  vossenlocatie.destroy(
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});


////////////////////////////////////////////////////////////////////////////////
//
// Tegenhunts
//

// Return all tegenhunts
app.get('/tegenhunts', function(req, res)
{
  var tegenhunts = new JotiHunt.TegenhuntsCollection();
  tegenhunts.fetch(
    { success: function (collection, response, options)
      {
        var value = [];
        for (var i = 0; i < collection.length; ++i)
        {
          var model = collection.at(i);
          value.push({ id: model.get('id')
                     , gebeurtenis: model.get('gebeurtenis')
                     , tijdstip: model.get('tijdstip')
                     , punten: model.get('punten')
                     });
        }
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Return a specific tegenhunt
app.get('/tegenhunts/:id', function(req, res)
{
  var tegenhunt = new JotiHunt.TegenhuntModel({ id: req.params.id });
  tegenhunt.fetch(
    { success: function (model, response, options)
      {
        var value = { id: model.get('id')
                    , gebeurtenis: model.get('gebeurtenis')
                    , tijdstip: model.get('tijdstip')
                    , punten: model.get('punten')
                    };
        res.json(value);
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Create a new tegenhunt
app.post('/tegenhunts', function(req, res)
{
  var tegenhunt = new JotiHunt.TegenhuntModel(req.body);
  tegenhunt.save(null,
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});

// Delete an existing tegenhunt
app.delete('/tegenhunts/:id', function(req, res)
{
  var tegenhunt = new JotiHunt.TegenhuntModel({ id: req.params.id });
  tegenhunt.destroy(
    { success: function (model, response, options)
      {
        res.json({ success: true });
      }
    , error: function(collection, response, options)
      {
        res.status(500).send(response.responseText);
      }
    });
});


////////////////////////////////////////////////////////////////////////////////
//
// Server
//

// Start the application
var server = app.listen(3030, function()
{
	console.log("Listening on port %d", server.address().port);
});

