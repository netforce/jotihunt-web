function initCollections(args)
{
  if (args)
    Backbone = args.Backbone;


  //////////////////////////////////////////////////////////////////////////////
  //
  // General
  //

  // Override Backbone Model's parse function to convert strings attributes back to Date attributes
  Backbone.Model.prototype._parse = Backbone.Model.prototype.parse;
  Backbone.Model.prototype.parse = function()
  {
    var attrs = Backbone.Model.prototype._parse.apply(this, arguments);
    if (!this.dateFields)
      return attrs;
    for (var k in this.dateFields)
      if (this.dateFields.hasOwnProperty(k))
        if (typeof attrs[this.dateFields[k]] === 'string')
          attrs[this.dateFields[k]] = new Date(attrs[this.dateFields[k]]);
    return attrs;
  };


  //////////////////////////////////////////////////////////////////////////////
  //
  // Deelnemers
  //

  var DeelnemerModel = Backbone.Model.extend(
    { urlRoot: '/deelnemers'
    , defaults:
      { naam: ''
      , telefoonnummer: ''
      , chauffeur: false
      }
    });

  var DeelnemersCollection = Backbone.Collection.extend(
    { url: '/deelnemers'
    , model: DeelnemerModel
    });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Activiteiten
  //

  var ActiviteitModel = Backbone.Model.extend(
    { urlRoot: '/activiteiten'
    , defaults:
      { uur: 0
      , deelnemer: 0
      , type: ''
      }
    });

  var ActiviteitenCollection = Backbone.Collection.extend(
    { url: '/activiteiten'
    , model: ActiviteitModel
    });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Autoritten
  //

  var AutoritModel = Backbone.Model.extend(
    { urlRoot: '/autoritten'
    , defaults:
      { chauffeur: 0
      , bijrijder_1: null
      , bijrijder_2: null
      , bijrijder_3: null
      , deelgebied: ''
      , instamapper: false
      , weer_terug: false
      }
    });

  var AutorittenCollection = Backbone.Collection.extend(
    { url: '/autoritten'
    , model: AutoritModel
    });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Hints
  //

  var HintModel = Backbone.Model.extend(
    { urlRoot: '/hints'
    , defaults:
      { hintnaam: ''
      , tijdstip: new Date()
      , alpha_opgelost: false
      , bravo_opgelost: false
      , charlie_opgelost: false
      , delta_opgelost: false
      , echo_opgelost: false
      , foxtrot_opgelost: false
      }
    , dateFields: [ 'tijdstip' ]
    });

  var HintsCollection = Backbone.Collection.extend(
    { url: '/hints'
    , model: HintModel
    });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Hunts
  //

  var HuntModel = Backbone.Model.extend(
    { urlRoot: '/hunts'
    , defaults:
      { vossenteam: ''
      , vossencode: ''
      , tijdstip: new Date()
      , locatie: ''
      , status: ''
      , punten: 0
      }
    , dateFields: [ 'tijdstip' ]
    });

  var HuntsCollection = Backbone.Collection.extend(
    { url: '/hunts'
    , model: HuntModel
    });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Opdrachten
  //

  var OpdrachtModel = Backbone.Model.extend(
    { urlRoot: '/opdrachten'
    , defaults:
      { coordinator: 0
      , deadline: new Date()
      , status: ''
      , punten: 0
      }
    , dateFields: [ 'deadline' ]
    });

  var OpdrachtenCollection = Backbone.Collection.extend(
    { url: '/opdrachten'
    , model: OpdrachtModel
    });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Foto-opdrachten
  //

  var FotoOpdrachtModel = Backbone.Model.extend(
    { urlRoot: '/foto_opdrachten'
    , defaults:
      { locatie: ''
      , status: ''
      , punten: 0
      }
    });

  var FotoOpdrachtenCollection = Backbone.Collection.extend(
    { url: '/foto_opdrachten'
    , model: FotoOpdrachtModel
    });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Vossenlocaties
  //

  var VossenlocatieModel = Backbone.Model.extend(
    { urlRoot: '/vossenlocaties'
    , defaults:
      { vossenteam: ''
      , tijdstip: new Date()
      , coordinaat: ''
      , adres: ''
      }
    , dateFields: [ 'tijdstip' ]

    });

  var VossenlocatiesCollection = Backbone.Collection.extend(
    { url: '/vossenlocaties'
    , model: VossenlocatieModel
    });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Tegenhunts
  //

  var TegenhuntModel = Backbone.Model.extend(
    { urlRoot: '/tegenhunts'
    , defaults:
      { gebeurtenis: ''
      , tijdstip: new Date()
      , punten: 0
      }
    , dateFields: [ 'tijdstip' ]
    });

  var TegenhuntsCollection = Backbone.Collection.extend(
    { url: '/tegenhunts'
    , model: TegenhuntModel
    });


  //////////////////////////////////////////////////////////////////////////////
  //
  // Export the Collections and Models
  //

  // If this file is require()'d, return an object with the initialized
  // Collections and Models, otherwise expose them directly in the window object
  var context = typeof module != 'undefined' ? {} : window;
  context.DeelnemerModel = DeelnemerModel;
  context.DeelnemersCollection = DeelnemersCollection;
  context.ActiviteitModel = ActiviteitModel;
  context.ActiviteitenCollection = ActiviteitenCollection;
  context.AutoritModel = AutoritModel;
  context.AutorittenCollection = AutorittenCollection;
  context.HintModel = HintModel;
  context.HintsCollection = HintsCollection;
  context.HuntModel = HuntModel;
  context.HuntsCollection = HuntsCollection;
  context.OpdrachtModel = OpdrachtModel;
  context.OpdrachtenCollection = OpdrachtenCollection;
  context.FotoOpdrachtModel = FotoOpdrachtModel;
  context.FotoOpdrachtenCollection = FotoOpdrachtenCollection;
  context.VossenlocatieModel = VossenlocatieModel;
  context.VossenlocatiesCollection = VossenlocatiesCollection;
  context.TegenhuntModel = TegenhuntModel;
  context.TegenhuntsCollection = TegenhuntsCollection;

  return context;
}

// If this file is require()'d, export the initialization function so the
// Backbone reference can be passed as an argument, otherwise call the
// initialization function directly (Backbone is already available)
if (typeof module != 'undefined')
  module.exports = initCollections;
else
  initCollections();
