////////////////////////////////////////////////////////////////////////////////
//
// Initialization
//

var alldeelnemers = {};
var allstatuses = { O: 'Open'
                  , P: 'Opgepakt'
                  , L: 'Opgelost'
                  , W: 'Onderweg'
                  , B: 'Bezig'
                  , I: 'Ingezonden'
                  , G: 'Goedgekeurd'
                  , A: 'Afgekeurd'
                  };

function run()
{
  refreshDeelnemers();
  refreshHints();
  refreshHunts();
  refreshFotoOpdrachten();
  refreshVossenlocaties();
  refreshTegenhunts();
}
$(document).ready(run);

function formatDate(date)
{
  return date.getDate() + "-" + (date.getMonth() + 1) + " " + date.getHours() + ":" + ("0" + date.getMinutes()).substr(-2);
}


////////////////////////////////////////////////////////////////////////////////
//
// Deelnemers
//

function refreshDeelnemers()
{
  var list = $('#deelnemers_list');
  list.empty();
  alldeelnemers = {};

  var deelnemers = new DeelnemersCollection();
  deelnemers.fetch(
    { success: function(collection, response, options)
      {
        for (var i = 0; i < collection.length; ++i)
        {
          var obj = collection.at(i);
          alldeelnemers[obj.get('id')] = obj;
          list.append('<tr id="deelnemer_' + obj.get('id') + '"><td>' + obj.get('naam') + '</td>'
                    + '<td>' + obj.get('telefoonnummer') + '</td>'
                    + '<td>' + (obj.get('chauffeur') ? 'ja' : 'nee') + '</td>'
                    + '<td>'
                    +   '<button onclick="deleteDeelnemer(' + obj.get('id') + '); return false;"><span class="entypo-trash"></span></button>'
                    + '</td></tr>');
        }
        // Update all pulldowns selecting deelnemers
        $.each($('.deelnemerselect, .chauffeurselect'), function(selectidx, select)
        {
          var chauffeurs = $(select).hasClass('chauffeurselect');
          $(select).empty().append($('<option value="">–</option>'));
          $.each(alldeelnemers, function(deelnemerid, deelnemer)
          {
            if (chauffeurs && !deelnemer.get('chauffeur'))
              return;
            var option = $('<option></option>').attr('value', deelnemer.get('id')).text(deelnemer.get('naam'));
            $(select).append(option);
          });
        });
        refreshActiviteiten();
        refreshAutoritten();
        refreshOpdrachten();
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}

function newDeelnemer()
{
  $('#deelnemers_form')[0].reset();
  $('#deelnemers_new').removeClass("hidden");
  $('#deelnemers_add').addClass("hidden");
}

function cancelDeelnemer()
{
  $('#deelnemers_new').addClass("hidden");
  $('#deelnemers_add').removeClass("hidden");
}

function addDeelnemer()
{
  var value = { naam: null
              , telefoonnummer: null
              , chauffeur: false
              };
  $.each($('#deelnemers_form').serializeArray(), function()
  {
    if (this.name === 'naam')
      value.naam = this.value;
    else if (this.name === 'telefoonnummer')
      value.telefoonnummer = this.value;
    else if (this.name === 'chauffeur')
      value.chauffeur = !!this.value;
  });

  if (value.naam)
  {
    var deelnemer = new DeelnemerModel(value);
    deelnemer.save(null,
      { success: function(model, response, options)
        {
          $('#deelnemers_new').addClass("hidden");
          $('#deelnemers_add').removeClass("hidden");
          refreshDeelnemers();
        }
      , error: function(model, response, options)
        {
          alert(response.responseText);
        }
      });
  }
}

function deleteDeelnemer(id)
{
  if (confirm("Weet je zeker dat je deze deelnemer wilt verwijderen?"))
  {
    var deelnemer = new DeelnemerModel({ id: id });
    deelnemer.destroy(
      { success: function(model, response, options)
        {
          refreshDeelnemers();
        }
      , error: function(model, response, options)
        {
          alert(response.responseText);
        }
      });
  }
}


////////////////////////////////////////////////////////////////////////////////
//
// Activiteiten
//

function refreshActiviteiten()
{
  var list = $('#activiteiten_list');
  list.empty();

  var activiteiten = new ActiviteitenCollection();
  activiteiten.fetch(
    { success: function(collection, response, options)
      {
        $.each(alldeelnemers, function(deelnemerid, deelnemer)
        {
          var row = '<tr><td>' + deelnemer.get('naam') + '</td>';
          var uren = {};

          var deelnemeractiviteiten = collection.where({ deelnemer: deelnemer.get('id') });
          for (var i = 0; i < deelnemeractiviteiten.length; ++i)
          {
            var obj = deelnemeractiviteiten[i];
            uren[obj.get('uur')] = obj;
          }

          for (var u = 0; u < 30; ++u)
          {
            row += '<td><span class="action" onclick="showActiviteit(' + u + ', ' + deelnemer.get('id') + ', \'' + (uren[u] ? uren[u].get('type') : '') + '\'' + (uren[u] ? ', ' + uren[u].get('id') : '') + ')">' + (uren[u] ? uren[u].get('type') : '–') + '</span></td>';
          }
          row += '</tr>';
          list.append(row);
        });
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}

function showActiviteit(uur, deelnemer, type, id)
{
  $('#activiteiten_form')[0].reset();
  $('#activiteiten_form_id').val(id);
  $('#activiteiten_form_uur').val(uur);
  $('#activiteiten_form_deelnemer').val(deelnemer);
  $('#activiteiten_form_type').val(type);
  $('#activiteiten_edit').removeClass("hidden");
}

function cancelActiviteit()
{
  $('#activiteiten_edit').addClass("hidden");
}

function editActiviteit()
{
  var value = { uur: 0
              , deelnemer: 0
              , type: ''
              };
  $.each($('#activiteiten_form').serializeArray(), function()
  {
    if (this.name === 'id' && this.value)
      value.id = parseInt(this.value);
    else if (this.name === 'uur' && this.value)
      value.uur = parseInt(this.value);
    else if (this.name === 'deelnemer' && this.value)
      value.deelnemer = parseInt(this.value);
    else if (this.name === 'type')
      value.type = this.value;
  });

  if (value.deelnemer)
  {
    var activiteit = new ActiviteitModel(value);
    if (value.type)
    {
      activiteit.save(null,
        { success: function(model, response, options)
          {
            $('#activiteiten_edit').addClass("hidden");
            refreshActiviteiten();
          }
        , error: function(model, response, options)
          {
            alert(response.responseText);
          }
        });
    }
    else
    {
      activiteit.destroy(
        { success: function(model, response, options)
          {
            $('#activiteiten_edit').addClass("hidden");
            refreshActiviteiten();
          }
        , error: function(model, response, options)
          {
            alert(response.responseText);
          }
        });
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
//
// Autoritten
//

function refreshAutoritten()
{
  var list = $('#autoritten_list');
  list.empty();

  var autoritten = new AutorittenCollection();
  autoritten.fetch(
    { success: function(collection, response, options)
      {
        for (var i = 0; i < collection.length; ++i)
        {
          var obj = collection.at(i);
          list.append('<tr id="autorit_' + obj.get('id') + '"><td>' + (obj.get('chauffeur') ? alldeelnemers[obj.get('chauffeur')].get('naam') : '&nbsp;') + '</td>'
                    + '<td>' + (obj.get('bijrijder_1') ? alldeelnemers[obj.get('bijrijder_1')].get('naam') : '&nbsp;') + '</td>'
                    + '<td>' + (obj.get('bijrijder_2') ? alldeelnemers[obj.get('bijrijder_2')].get('naam') : '&nbsp;') + '</td>'
                    + '<td>' + (obj.get('bijrijder_3') ? alldeelnemers[obj.get('bijrijder_3')].get('naam') : '&nbsp;') + '</td>'
                    + '<td>' + obj.get('deelgebied') + '</td>'
                    + '<td>' + (obj.get('instamapper') ? 'ja' : 'nee') + '</td>'
                    + '<td><span class="action" onclick="switchAutoritWeerTerug(' + obj.get('id') + ', ' + (obj.get('weer_terug') ? 'false' : 'true') + ')">' + (obj.get('weer_terug') ? 'ja' : 'nee') + '</span></td>'
                    + '<td>'
                    +   '<button onclick="deleteAutorit(' + obj.get('id') + '); return false;"><span class="entypo-trash"></span></button>'
                    + '</td></tr>');
        }
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}

function newAutorit()
{
  $('#autoritten_form')[0].reset();
  $('#autoritten_new').removeClass("hidden");
  $('#autoritten_add').addClass("hidden");
}

function cancelAutorit()
{
  $('#autoritten_new').addClass("hidden");
  $('#autoritten_add').removeClass("hidden");
}

function addAutorit()
{
  var value = { chauffeur: 0
              , deelgebied: ''
              , instamapper: false
              , weer_terug: false
              };
  $.each($('#autoritten_form').serializeArray(), function()
  {
    if (this.name === 'chauffeur' && this.value)
      value.chauffeur = parseInt(this.value);
    else if (this.name === 'bijrijder_1' && this.value)
      value.bijrijder_1 = parseInt(this.value);
    else if (this.name === 'bijrijder_2' && this.value)
      value.bijrijder_2 = parseInt(this.value);
    else if (this.name === 'bijrijder_3' && this.value)
      value.bijrijder_3 = parseInt(this.value);
    else if (this.name === 'deelgebied')
      value.deelgebied = this.value;
    else if (this.name === 'instamapper')
      value.instamapper = !!this.value;
    else if (this.name === 'weer_terug')
      value.weer_terug = !!this.value;
  });

  if (value.chauffeur)
  {
    var autorit = new AutoritModel(value);
    autorit.save(null,
      { success: function(model, response, options)
        {
          $('#autoritten_new').addClass("hidden");
          $('#autoritten_add').removeClass("hidden");
          refreshAutoritten();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function deleteAutorit(id)
{
  if (confirm("Weet je zeker dat je deze autorit wilt verwijderen?"))
  {
    var autorit = new AutoritModel({ id: id });
    autorit.destroy(
      { success: function(model, response, options)
        {
          refreshAutoritten();
        }
      , error: function(model, response, options)
        {
          alert(response.responseText);
        }
      });
  }
}

function switchAutoritWeerTerug(id, weer_terug)
{
  var autorit = new AutoritModel({ id: id });
  autorit.save({ weer_terug: weer_terug },
    { patch: true
    , success: function(model, response, options)
      {
        refreshAutoritten();
      }
    , error: function(model, response, options)
      {
        console.error(response);
        alert(response.responseText);
      }
    });
}


////////////////////////////////////////////////////////////////////////////////
//
// Hints
//

function refreshHints()
{
  var list = $('#hints_list');
  list.empty();

  var hints = new HintsCollection();
  hints.fetch(
    { success: function(collection, response, options)
      {
        for (var i = 0; i < collection.length; ++i)
        {
          var obj = collection.at(i);
          list.append('<tr id="hint_' + obj.get('id') + '"><td>' + obj.get('hintnaam') + '</td><td>' + formatDate(obj.get('tijdstip')) + '</td>'
                    + '<td><span class="action" onclick="switchHintOpgelost(' + obj.get('id') + ', \'alpha\', ' + (obj.get('alpha_opgelost') ? 'false' : 'true') + ')">' + (obj.get('alpha_opgelost') ? 'ja' : 'nee') + '</span></td>'
                    + '<td><span class="action" onclick="switchHintOpgelost(' + obj.get('id') + ', \'bravo\', ' + (obj.get('bravo_opgelost') ? 'false' : 'true') + ')">' + (obj.get('bravo_opgelost') ? 'ja' : 'nee') + '</span></td>'
                    + '<td><span class="action" onclick="switchHintOpgelost(' + obj.get('id') + ', \'charlie\', ' + (obj.get('charlie_opgelost') ? 'false' : 'true') + ')">' + (obj.get('charlie_opgelost') ? 'ja' : 'nee') + '</span></td>'
                    + '<td><span class="action" onclick="switchHintOpgelost(' + obj.get('id') + ', \'delta\', ' + (obj.get('delta_opgelost') ? 'false' : 'true') + ')">' + (obj.get('delta_opgelost') ? 'ja' : 'nee') + '</span></td>'
                    + '<td><span class="action" onclick="switchHintOpgelost(' + obj.get('id') + ', \'echo\', ' + (obj.get('echo_opgelost') ? 'false' : 'true') + ')">' + (obj.get('echo_opgelost') ? 'ja' : 'nee') + '</span></td>'
                    + '<td><span class="action" onclick="switchHintOpgelost(' + obj.get('id') + ', \'foxtrot\', ' + (obj.get('foxtrot_opgelost') ? 'false' : 'true') + ')">' + (obj.get('foxtrot_opgelost') ? 'ja' : 'nee') + '</span></td>'
                    + '<td>'
                    +   '<button onclick="deleteHint(' + obj.get('id') + '); return false;"><span class="entypo-trash"></span></button>'
                    + '</td></tr>');
        }
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}

function newHint()
{
  $('#hints_form')[0].reset();
  $('#hints_new').removeClass("hidden");
  $('#hints_add').addClass("hidden");
}

function cancelHint()
{
  $('#hints_new').addClass("hidden");
  $('#hints_add').removeClass("hidden");
}

function addHint()
{
  var value = { hintnaam: ''
              , tijdstip: null
              , alpha_opgelost: false
              , bravo_opgelost: false
              , charlie_opgelost: false
              , delta_opgelost: false
              , echo_opgelost: false
              , foxtrot_opgelost: false
              };
  var tijdstip_date = null;
  $.each($('#hints_form').serializeArray(), function()
  {
    if (this.name === 'hintnaam')
      value.hintnaam = this.value;
    else if (this.name === 'tijdstip_date')
      tijdstip_date = this.value;
    else if (this.name === 'tijdstip_time')
      value.tijdstip = new Date(tijdstip_date + "T" + this.value + "Z");
    else if (this.name === 'alpha_opgelost')
      value.alpha_opgelost = !!this.value;
    else if (this.name === 'bravo_opgelost')
      value.bravo_opgelost = !!this.value;
    else if (this.name === 'charlie_opgelost')
      value.charlie_opgelost = !!this.value;
    else if (this.name === 'delta_opgelost')
      value.delta_opgelost = !!this.value;
    else if (this.name === 'echo_opgelost')
      value.echo_opgelost = !!this.value;
    else if (this.name === 'foxtrot_opgelost')
      value.foxtrot_opgelost = !!this.value;
  });

  if (value.hintnaam && value.tijdstip && !isNaN(value.tijdstip.getTime()))
  {
    var hint = new HintModel(value);
    hint.save(null,
      { success: function(model, response, options)
        {
          $('#hints_new').addClass("hidden");
          $('#hints_add').removeClass("hidden");
          refreshHints();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function deleteHint(id)
{
  if (confirm("Weet je zeker dat je deze hint wilt verwijderen?"))
  {
    var hint = new HintModel({ id: id });
    hint.destroy(
      { success: function(model, response, options)
        {
          refreshHints();
        }
      , error: function(model, response, options)
        {
          alert(response.responseText);
        }
      });
  }
}

function switchHintOpgelost(id, deelgebied, opgelost)
{
  var hint = new HintModel({ id: id });
  value = {};
  value[deelgebied + '_opgelost'] = opgelost;
  hint.save(value,
    { patch: true
    , success: function(model, response, options)
      {
        refreshHints();
      }
    , error: function(model, response, options)
      {
        console.error(response);
        alert(response.responseText);
      }
    });
}


////////////////////////////////////////////////////////////////////////////////
//
// Hunts
//

function refreshHunts()
{
  var list = $('#hunts_list');
  list.empty();

  var hunts = new HuntsCollection();
  hunts.fetch(
    { success: function(collection, response, options)
      {
        for (var i = 0; i < collection.length; ++i)
        {
          var obj = collection.at(i);
          list.append('<tr id="hint_' + obj.get('id') + '"><td>' + obj.get('vossenteam') + '</td><td>' + obj.get('vossencode') + '</td>'
                    + '<td>' + formatDate(obj.get('tijdstip')) + '</td><td>' + obj.get('locatie') + '</td>'
                    + '<td><span class="action" onclick="showHunt(' + obj.get('id') + ', \'' + obj.get('status') + '\', ' + obj.get('punten') + ');">' + (obj.get('status') ? allstatuses[obj.get('status')] : '–') + '</span></td>'
                    + '<td><span class="action" onclick="showHunt(' + obj.get('id') + ', \'' + obj.get('status') + '\', ' + obj.get('punten') + ');">' + obj.get('punten') + '</span></td>'
                    + '<td>'
                    +   '<button onclick="deleteHunt(' + obj.get('id') + '); return false;"><span class="entypo-trash"></span></button>'
                    + '</td></tr>');
        }
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}

function newHunt()
{
  $('#hunts_form')[0].reset();
  $('#hunts_new').removeClass("hidden");
  $('#hunts_add').addClass("hidden");
}

function cancelHunt()
{
  $('#hunts_new').addClass("hidden");
  $('#hunt_edit').addClass("hidden");
  $('#hunts_add').removeClass("hidden");
}

function addHunt()
{
  var value = { vossenteam: ''
              , vossencode: ''
              , tijdstip: null
              , locatie: ''
              , status: ''
              , punten: 0
              };
  var tijdstip_date = "";
  $.each($('#hunts_form').serializeArray(), function()
  {
    if (this.name === 'vossenteam')
      value.vossenteam = this.value;
    else if (this.name === 'vossencode')
      value.vossencode = this.value;
    else if (this.name === 'tijdstip_date')
      tijdstip_date = this.value;
    else if (this.name === 'tijdstip_time')
      value.tijdstip = new Date(tijdstip_date + "T" + this.value + "Z");
    else if (this.name === 'locatie')
      value.locatie = this.value;
    else if (this.name === 'status')
      value.status = this.value;
    else if (this.name === 'punten' && this.value)
      value.punten = parseInt(this.value);
  });

  if (value.vossenteam && value.tijdstip && !isNaN(value.tijdstip.getTime()))
  {
    var hunt = new HuntModel(value);
    hunt.save(null,
      { success: function(model, response, options)
        {
          $('#hunts_new').addClass("hidden");
          $('#hunts_add').removeClass("hidden");
          refreshHunts();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function showHunt(id, status, punten)
{
  $('#hunt_form')[0].reset();
  $('#hunt_form_id').val(id);
  $('#hunt_form_status').val(status);
  $('#hunt_form_punten').val(punten);
  $('#hunt_edit').removeClass("hidden");
  $('#hunts_add').addClass("hidden");
}

function editHunt()
{
  var hunt_id = 0;
  var value = { status: ''
              , punten: 0
              };
  $.each($('#hunt_form').serializeArray(), function()
  {
    if (this.name === 'id' && this.value)
      hunt_id = parseInt(this.value);
    else if (this.name === 'status')
      value.status = this.value;
    else if (this.name === 'punten' && this.value)
      value.punten = parseInt(this.value);
  });

  if (hunt_id)
  {
    var hunt = new HuntModel({ id: hunt_id });
    hunt.save(value,
      { patch: true
      , success: function(model, response, options)
        {
          $('#hunt_edit').addClass("hidden");
          $('#hunts_add').removeClass("hidden");
          refreshHunts();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function deleteHunt(id)
{
  if (confirm("Weet je zeker dat je deze hunt wilt verwijderen?"))
  {
    var hunt = new HuntModel({ id: id });
    hunt.destroy(
      { success: function(model, response, options)
        {
          refreshHunts();
        }
      , error: function(model, response, options)
        {
          alert(response.responseText);
        }
      });
  }
}


////////////////////////////////////////////////////////////////////////////////
//
// Opdrachten
//

function refreshOpdrachten()
{
  var list = $('#opdrachten_list');
  list.empty();

  var opdrachten = new OpdrachtenCollection();
  opdrachten.fetch(
    { success: function(collection, response, options)
      {
        for (var i = 0; i < collection.length; ++i)
        {
          var obj = collection.at(i);
          list.append('<tr id="hint_' + obj.get('id') + '"><td>' + (obj.get('coordinator') ? alldeelnemers[obj.get('coordinator')].get('naam') : '&nbsp;') + '</td>'
                    + '<td>' + formatDate(obj.get('deadline')) + '</td>'
                    + '<td><span class="action" onclick="showOpdracht(' + obj.get('id') + ', \'' + obj.get('status') + '\', ' + obj.get('punten') + ');">' + (obj.get('status') ? allstatuses[obj.get('status')] : '–') + '</span></td>'
                    + '<td><span class="action" onclick="showOpdracht(' + obj.get('id') + ', \'' + obj.get('status') + '\', ' + obj.get('punten') + ');">' + obj.get('punten') + '</span></td>'
                    + '<td>'
                    +   '<button onclick="deleteOpdracht(' + obj.get('id') + '); return false;"><span class="entypo-trash"></span></button>'
                    + '</td></tr>');
        }
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}

function newOpdracht()
{
  $('#opdrachten_form')[0].reset();
  $('#opdrachten_new').removeClass("hidden");
  $('#opdrachten_add').addClass("hidden");
}

function cancelOpdracht()
{
  $('#opdrachten_new').addClass("hidden");
  $('#opdracht_edit').addClass("hidden");
  $('#opdrachten_add').removeClass("hidden");
}

function addOpdracht()
{
  var value = { coordinator: 0
              , deadline: null
              , status: ''
              , punten: 0
              };
  var deadline_date = "";
  $.each($('#opdrachten_form').serializeArray(), function()
  {
    if (this.name === 'coordinator' && this.value)
      value.coordinator = parseInt(this.value);
    else if (this.name === 'deadline_date')
      deadline_date = this.value;
    else if (this.name === 'deadline_time')
      value.deadline = new Date(deadline_date + "T" + this.value + "Z");
    else if (this.name === 'status')
      value.status = this.value;
    else if (this.name === 'punten' && this.value)
      value.punten = parseInt(this.value);
  });

  if (value.coordinator && value.deadline && !isNaN(value.deadline.getTime()))
  {
    var opdracht = new OpdrachtModel(value);
    opdracht.save(null,
      { success: function(model, response, options)
        {
          $('#opdrachten_new').addClass("hidden");
          $('#opdrachten_add').removeClass("hidden");
          refreshOpdrachten();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function showOpdracht(id, status, punten)
{
  $('#opdracht_form')[0].reset();
  $('#opdracht_form_id').val(id);
  $('#opdracht_form_status').val(status);
  $('#opdracht_form_punten').val(punten);
  $('#opdracht_edit').removeClass("hidden");
  $('#opdrachten_add').addClass("hidden");
}

function editOpdracht()
{
  var opdracht_id = 0;
  var value = { status: ''
              , punten: 0
              };
  $.each($('#opdracht_form').serializeArray(), function()
  {
    if (this.name === 'id' && this.value)
      opdracht_id = parseInt(this.value);
    else if (this.name === 'status')
      value.status = this.value;
    else if (this.name === 'punten' && this.value)
      value.punten = parseInt(this.value);
  });

  if (opdracht_id)
  {
    var opdracht = new OpdrachtModel({ id: opdracht_id });
    opdracht.save(value,
      { patch: true
      , success: function(model, response, options)
        {
          $('#opdracht_edit').addClass("hidden");
          $('#opdrachten_add').removeClass("hidden");
          refreshOpdrachten();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function deleteOpdracht(id)
{
  if (confirm("Weet je zeker dat je deze opdracht wilt verwijderen?"))
  {
    var opdracht = new OpdrachtModel({ id: id });
    opdracht.destroy(
      { success: function(model, response, options)
        {
          refreshOpdrachten();
        }
      , error: function(model, response, options)
        {
          alert(response.responseText);
        }
      });
  }
}


////////////////////////////////////////////////////////////////////////////////
//
// Foto-opdrachten
//

function refreshFotoOpdrachten()
{
  var list = $('#fotoopdrachten_list');
  list.empty();

  var fotoopdrachten = new FotoOpdrachtenCollection();
  fotoopdrachten.fetch(
    { success: function(collection, response, options)
      {
        for (var i = 0; i < collection.length; ++i)
        {
          var obj = collection.at(i);
          list.append('<tr id="hint_' + obj.get('id') + '"><td>' + obj.get('locatie') + '</td>'
                    + '<td><span class="action" onclick="showFotoOpdracht(' + obj.get('id') + ', \'' + obj.get('status') + '\', ' + obj.get('punten') + ');">' + (obj.get('status') ? allstatuses[obj.get('status')] : '–') + '</span></td>'
                    + '<td><span class="action" onclick="showFotoOpdracht(' + obj.get('id') + ', \'' + obj.get('status') + '\', ' + obj.get('punten') + ');">' + obj.get('punten') + '</span></td>'
                    + '<td>'
                    +   '<button onclick="deleteFotoOpdracht(' + obj.get('id') + '); return false;"><span class="entypo-trash"></span></button>'
                    + '</td></tr>');
        }
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}

function newFotoOpdracht()
{
  $('#fotoopdrachten_form')[0].reset();
  $('#fotoopdrachten_new').removeClass("hidden");
  $('#fotoopdrachten_add').addClass("hidden");
}

function cancelFotoOpdracht()
{
  $('#fotoopdrachten_new').addClass("hidden");
  $('#fotoopdracht_edit').addClass("hidden");
  $('#fotoopdrachten_add').removeClass("hidden");
}

function addFotoOpdracht()
{
  var value = { locatie: ''
              , status: ''
              , punten: 0
              };
  $.each($('#fotoopdrachten_form').serializeArray(), function()
  {
    if (this.name === 'locatie')
      value.locatie = this.value;
    else if (this.name === 'status')
      value.status = this.value;
    else if (this.name === 'punten' && this.value)
      value.punten = parseInt(this.value);
  });

  if (value.locatie)
  {
    var fotoopdracht = new FotoOpdrachtModel(value);
    fotoopdracht.save(null,
      { success: function(model, response, options)
        {
          $('#fotoopdrachten_new').addClass("hidden");
          $('#fotoopdrachten_add').removeClass("hidden");
          refreshFotoOpdrachten();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function showFotoOpdracht(id, status, punten)
{
  $('#fotoopdracht_form')[0].reset();
  $('#fotoopdracht_form_id').val(id);
  $('#fotoopdracht_form_status').val(status);
  $('#fotoopdracht_form_punten').val(punten);
  $('#fotoopdracht_edit').removeClass("hidden");
  $('#fotoopdrachten_add').addClass("hidden");
}

function editFotoOpdracht()
{
  var fotoopdracht_id = 0;
  var value = { status: ''
              , punten: 0
              };
  $.each($('#fotoopdracht_form').serializeArray(), function()
  {
    if (this.name === 'id' && this.value)
      fotoopdracht_id = parseInt(this.value);
    else if (this.name === 'status')
      value.status = this.value;
    else if (this.name === 'punten' && this.value)
      value.punten = parseInt(this.value);
  });

  if (fotoopdracht_id)
  {
    var fotoopdracht = new FotoOpdrachtModel({ id: fotoopdracht_id });
    fotoopdracht.save(value,
      { patch: true
      , success: function(model, response, options)
        {
          $('#fotoopdracht_edit').addClass("hidden");
          $('#fotoopdrachten_add').removeClass("hidden");
          refreshFotoOpdrachten();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function deleteFotoOpdracht(id)
{
  if (confirm("Weet je zeker dat je deze foto-opdracht wilt verwijderen?"))
  {
    var fotoopdracht = new FotoOpdrachtModel({ id: id });
    fotoopdracht.destroy(
      { success: function(model, response, options)
        {
          refreshFotoOpdrachten();
        }
      , error: function(model, response, options)
        {
          alert(response.responseText);
        }
      });
  }
}


////////////////////////////////////////////////////////////////////////////////
//
// Vossenlocaties
//

function refreshVossenlocaties()
{
  var list = $('#vossenlocaties_list');
  list.empty();

  var vossenlocaties = new VossenlocatiesCollection();
  vossenlocaties.fetch(
    { success: function(collection, response, options)
      {
        for (var i = 0; i < collection.length; ++i)
        {
          var obj = collection.at(i);
          list.append('<tr id="hint_' + obj.get('id') + '"><td>' + obj.get('coordinaat') + '</td><td>' + obj.get('adres') + '</td>'
                    + '<td>'
                    +   '<button onclick="deleteVossenlocatie(' + obj.get('id') + '); return false;"><span class="entypo-trash"></span></button>'
                    + '</td></tr>');
        }
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}

function newVossenlocatie()
{
  $('#vossenlocaties_form')[0].reset();
  $('#vossenlocaties_new').removeClass("hidden");
  $('#vossenlocaties_add').addClass("hidden");
}

function cancelVossenlocatie()
{
  $('#vossenlocaties_new').addClass("hidden");
  $('#vossenlocaties_add').removeClass("hidden");
}

function addVossenlocatie()
{
  var value = { coordinaat: ''
              , adres: ''
              };
  $.each($('#vossenlocaties_form').serializeArray(), function()
  {
    if (this.name === 'coordinaat')
      value.coordinaat = this.value;
    else if (this.name === 'adres')
      value.adres = this.value;
  });

  if (value.coordinaat)
  {
    var vossenlocatie = new VossenlocatieModel(value);
    vossenlocatie.save(null,
      { success: function(model, response, options)
        {
          $('#vossenlocaties_new').addClass("hidden");
          $('#vossenlocaties_add').removeClass("hidden");
          refreshVossenlocaties();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function deleteVossenlocatie(id)
{
  if (confirm("Weet je zeker dat je deze vossenlocatie wilt verwijderen?"))
  {
    var vossenlocatie = new VossenlocatieModel({ id: id });
    vossenlocatie.destroy(
      { success: function(model, response, options)
        {
          refreshVossenlocaties();
        }
      , error: function(model, response, options)
        {
          alert(response.responseText);
        }
      });
  }
}


////////////////////////////////////////////////////////////////////////////////
//
// Tegenhunts
//

function refreshTegenhunts()
{
  var list = $('#tegenhunts_list');
  list.empty();

  var tegenhunts = new TegenhuntsCollection();
  tegenhunts.fetch(
    { success: function(collection, response, options)
      {
        for (var i = 0; i < collection.length; ++i)
        {
          var obj = collection.at(i);
          list.append('<tr id="hint_' + obj.get('id') + '"><td>' + obj.get('gebeurtenis') + '</td><td>' + formatDate(obj.get('tijdstip')) + '</td><td>' + obj.get('punten') + '</td>'
                    + '<td>'
                    +   '<button onclick="deleteTegenhunt(' + obj.get('id') + '); return false;"><span class="entypo-trash"></span></button>'
                    + '</td></tr>');
        }
      }
    , error: function(collection, response, options)
      {
        console.error(response.status + ": " + response.responseText);
      }
    });
}

function newTegenhunt()
{
  $('#tegenhunts_form')[0].reset();
  $('#tegenhunts_new').removeClass("hidden");
  $('#tegenhunts_add').addClass("hidden");
}

function cancelTegenhunt()
{
  $('#tegenhunts_new').addClass("hidden");
  $('#tegenhunts_add').removeClass("hidden");
}

function addTegenhunt()
{
  var value = { gebeurtenis: ''
              , tijdstip: null
              , punten: 0
              };
  var tijdstip_date = null;
  $.each($('#tegenhunts_form').serializeArray(), function()
  {
    if (this.name === 'gebeurtenis')
      value.gebeurtenis = this.value;
    else if (this.name === 'tijdstip_date')
      tijdstip_date = this.value;
    else if (this.name === 'tijdstip_time')
      value.tijdstip = new Date(tijdstip_date + "T" + this.value + "Z");
    else if (this.name === 'punten' && this.value)
      value.punten = parseInt(this.value);
  });

  if (value.gebeurtenis && value.tijdstip && !isNaN(value.tijdstip.getTime()))
  {
    var tegenhunt = new TegenhuntModel(value);
    tegenhunt.save(null,
      { success: function(model, response, options)
        {
          $('#tegenhunts_new').addClass("hidden");
          $('#tegenhunts_add').removeClass("hidden");
          refreshTegenhunts();
        }
      , error: function(model, response, options)
        {
          console.error(response);
          alert(response.responseText);
        }
      });
  }
}

function deleteTegenhunt(id)
{
  if (confirm("Weet je zeker dat je deze tegenhunt wilt verwijderen?"))
  {
    var tegenhunt = new TegenhuntModel({ id: id });
    tegenhunt.destroy(null,
      { success: function(model, response, options)
        {
          refreshTegenhunts();
        }
      , error: function(model, response, options)
        {
          alert(response.responseText);
        }
      });
  }
}
