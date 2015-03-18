/* ========================================
 * @project = Linked Data Geovisualizer
 * @author = Grant McKenzie
 * @contact = grant.mckenzie@geog.ucsb.edu
 * @date = October, 2014
 * @lab = http://stko.geog.ucsb.edu
 * ======================================== */

  // Load the Classes and SubClasses from the given data
  _STKO.loadClasses = function() {
     $('#doQuery').html("<img src='img/loading.gif'/>");
     this.endpoints.sparql = $('#sparql').val();
     this.endpoints.graph = $('#graph').val();
     this.endpoints.baseclass = $('#ont').val();
     this.params.format = "application/sparql-results+json";
     this.params.limit = 100;
     //this.query.loadClasses = "select ?child ?parent (count(?b) as ?count) where {?child rdfs:subClassOf <" + this.endpoints.baseclass + "> option(transitive) . ?child rdfs:subClassOf ?parent . ?b a ?child} group by ?child ?parent";
     this.query.loadClasses = "select ?child ?parent (0) as ?count where {?child rdfs:subClassOf <" + this.endpoints.baseclass + "> option(transitive) . ?child rdfs:subClassOf ?parent} group by ?child ?parent";
      
      var url = this.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(this.endpoints.graph) + "&query=" + encodeURIComponent(this.prefixes.rdfs + " " + this.query.loadClasses + " order by ?child") + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on";
      
      
      
      $.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'jsonp',
	    success: function(data, textStatus, xhr) {
		_STKO.display.loadClasses(data.results.bindings);
		$('#doQuery').html("QUERY");
	    },
	    error: function(xhr, textStatus, errorThrown) {
		_UTILS.showModal("error", textStatus, 300, 100);
	    }
	});
  }
  
  // Load all the properties for the selected class
  _STKO.loadProperties = function(oClass) {
      this.endpoints.baseClass = oClass;
      this.query.loadProperties = "select ?prop (count(?prop) as ?count) WHERE {?a ?prop ?c . ?a a <" + oClass + ">} order by desc (?count)";
      
      var url = this.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(this.endpoints.graph) + "&query=" + encodeURIComponent(this.prefixes.rdfs + " " + this.query.loadProperties) + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on";

      $.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'jsonp',
	    success: function(data, textStatus, xhr) {
		_STKO.display.loadProperties(data.results.bindings);
		_STKO.loadCount();
	    },
	    error: function(xhr, textStatus, errorThrown) {
		_UTILS.showModal("error", textStatus);
	    }
	});
    
  }
  
  // Load all entities based on the selected class and property criteria
  _STKO.loadEntities = function(url) {
      /* $('#doQueryEntities').html("<img src='img/loading.gif'/>");
      var filter = "";
      var property = "";
      var count = 0;
      for(var key in _STKO.params.restrictions) {
	  var filtertype = _STKO.params.restrictions[key][0][2];
	  property = key;
	  if (filtertype == "Literal (int" || filtertype == "Literal (flo" || filtertype == "Literal (dou") {
	    filter += " . ?a <"+key+"> ?b"+count+" . FILTER (";
	    for(var i=0;i<_STKO.params.restrictions[key].length;i++) {
		if (_STKO.params.restrictions[key][i][0] == "≠")
		    var asdf = "!=";
		else
		    var asdf = $("<div/>").html(_STKO.params.restrictions[key][i][0]).text();
		filter += "?b"+count+" " + asdf + " " + _STKO.params.restrictions[key][i][1] + " && ";
	    }
	    filter = filter.substr(0, filter.length-4);
	    filter += ")";
	  } else if (filtertype == "Literal (Str") {
	    filter += " . ?a <"+key+"> ?b"+count+" . FILTER (";
	    for(var i=0;i<_STKO.params.restrictions[key].length;i++) {
		if (_STKO.params.restrictions[key][i][0] == "≠") {
		    var asdf = "!=";
		    filter += "!regex(str(?b"+count+"),'"+_STKO.params.restrictions[key][i][1]+"','i') && ";
		} else {
		    var asdf = $("<div/>").html(_STKO.params.restrictions[key][i][0]).text();
		    filter += "regex(str(?b"+count+"),'"+_STKO.params.restrictions[key][i][1]+"','i') && ";
		}
	    }
	    filter = filter.substr(0, filter.length-4);
	    filter += ")";
	  }
	  count++;
      }
      
      var extent = " . ?a <http://adl-gazetteer.geog.ucsb.edu/ONT/ADL#centerLatitude> ?lat . ?a <http://adl-gazetteer.geog.ucsb.edu/ONT/ADL#centerLongitude> ?long . FILTER ( ?long > \""+Math.round(_MAP.map.getBounds().getWest()*100)/100+"\"^^xsd:float && ?long < \""+Math.round(_MAP.map.getBounds().getEast()*100)/100+"\"^^xsd:float && ?lat > \""+Math.round(_MAP.map.getBounds().getSouth()*100)/100+"\"^^xsd:float && ?lat < \""+Math.round(_MAP.map.getBounds().getNorth()*100)/100+"\"^^xsd:float)";
      
      this.query.loadEntities = "select ?a ?lat ?long where {?a a <"+this.endpoints.baseClass+"> option(transitive)"+filter+extent+"}";

      var url = this.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(this.endpoints.graph) + "&query=" + encodeURIComponent(this.prefixes.geo + " " + this.query.loadEntities) + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on"; */
    
      
      $.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'jsonp',
	    success: function(data, textStatus, xhr) {
		// _STKO.display.loadEntities(data.results.bindings);
		_MAP.mapEntities(data.results.bindings);
		// $('#doQueryEntities').html("ADD TO LAYERS");
	    },
	    error: function(xhr, textStatus, errorThrown) {
		_UTILS.showModal("error", textStatus);
	    }
	}); 
  }
  
  // Load Details of a specific entity.  All properties and values
  _STKO.loadDetails = function(uri, id, graph, endpoint) {
      this.query.loadDetails = "select ?a ?b where {<" + uri + "> ?a ?b}";
      var url = endpoint + "?default-graph-uri=" + encodeURIComponent(graph) + "&query=" + encodeURIComponent(this.query.loadDetails + " limit " + this.params.limit) + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on";
    
      $.ajax({
	    url: url,
	    urig: id,
	    type: 'GET',
	    dataType: 'jsonp',
	    success: function(data, textStatus, xhr) {
		_MAP.displayPopup(data.results.bindings, this.urig);
	    },
	    error: function(xhr, textStatus, errorThrown) {
		_UTILS.showModal("error", textStatus);
	    }
	});
	
  }  
  
  _STKO.loadDateType = function(uri, id) {
      // $('#sub_'+id).html(uri);
    
      _UTILS.toggleProperty(id);
	  
      if ($('#'+id).hasClass('propertyon')) {
	this.query.loadDateType = "select str(datatype(?c)) as ?dt count(?c) as ?cnt max(?c) as ?max min(?c) as ?min WHERE {?a <"+uri+"> ?c . ?a a <"+this.endpoints.baseClass+">} group by datatype(?c) order by desc(?cnt) limit 1";
	$('#loadingSide').show();
	
	var url = this.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(this.endpoints.graph) + "&query=" + encodeURIComponent(this.prefixes.geo + " " + this.query.loadDateType) + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on";
      
	
	$.ajax({
	      url: url,
	      type: 'GET',
	      dataType: 'jsonp',
	      success: function(data, textStatus, xhr) {
		  $('#loadingSide').hide();
		if (data.results.bindings[0].hasOwnProperty('dt')) {
		  var n = _UTILS.getname(data.results.bindings[0].dt.value, "#");
		  if (n.name != "string") 
		    $('#sub_'+id+'_').html("Data Type: Literal ("+n.name + ")<br/>Value Range: "+data.results.bindings[0].max.value + " to "+data.results.bindings[0].min.value);
		  else
		      $('#sub_'+id+'_').html("Data Type: Literal (String)");
		} else {
		    if (data.results.bindings[0].max.type == "uri")
		      $('#sub_'+id+'_').html("Data Type: URI");
		    else
		      $('#sub_'+id+'_').html("Data Type: Literal (String)");
		}
		
		$('#input_'+id+'_').slideDown();
		$('#equals_'+id+'_').slideDown();
		$('#sub_'+id+'_').slideDown();
	      },
	      error: function(xhr, textStatus, errorThrown) {
		  _UTILS.showModal("error", textStatus);
	      }
	  }); 
      } else {
	  
	  $('#input_'+id+'_').slideUp();
	  $('#sub_'+id+'_').slideUp();
	  $('#equals_'+id+'_').slideUp();
      }
  }
  
  _STKO.loadCount = function() {
      if (!this.endpoints.baseClass)
	  return;
      
      $('#wrapperCount').html("<img src='img/loading-mini.gif'/>");
      var filter = "";
      var property = "";
      var count = 0;
      for(var key in _STKO.params.restrictions) {
	  var filtertype = _STKO.params.restrictions[key][0][2];
	  property = key;
	  if (filtertype == "Literal (int" || filtertype == "Literal (flo" || filtertype == "Literal (dou") {
	    filter += " . ?a <"+key+"> ?b"+count+" . FILTER (";
	    for(var i=0;i<_STKO.params.restrictions[key].length;i++) {
		if (_STKO.params.restrictions[key][i][0] == "≠")
		    var asdf = "!=";
		else
		    var asdf = $("<div/>").html(_STKO.params.restrictions[key][i][0]).text();
		filter += "?b"+count+" " + asdf + " " + _STKO.params.restrictions[key][i][1] + " && ";
	    }
	    filter = filter.substr(0, filter.length-4);
	    filter += ")";
	  } else if (filtertype == "Literal (Str") {
	    filter += " . ?a <"+key+"> ?b"+count+" . FILTER (";
	    for(var i=0;i<_STKO.params.restrictions[key].length;i++) {
		if (_STKO.params.restrictions[key][i][0] == "≠") {
		    var asdf = "!=";
		    filter += "!regex(str(?b"+count+"),'"+_STKO.params.restrictions[key][i][1]+"','i') && ";
		} else {
		    var asdf = $("<div/>").html(_STKO.params.restrictions[key][i][0]).text();
		    filter += "regex(str(?b"+count+"),'"+_STKO.params.restrictions[key][i][1]+"','i') && ";
		}
	    }
	    filter = filter.substr(0, filter.length-4);
	    filter += ")";
	  }
	  count++;
      }
      
      var extent = " . ?a <http://adl-gazetteer.geog.ucsb.edu/ONT/ADL#centerLatitude> ?lat . ?a <http://adl-gazetteer.geog.ucsb.edu/ONT/ADL#centerLongitude> ?long . FILTER ( ?long > \""+Math.round(_MAP.map.getBounds().getWest()*100)/100+"\"^^xsd:float && ?long < \""+Math.round(_MAP.map.getBounds().getEast()*100)/100+"\"^^xsd:float && ?lat > \""+Math.round(_MAP.map.getBounds().getSouth()*100)/100+"\"^^xsd:float && ?lat < \""+Math.round(_MAP.map.getBounds().getNorth()*100)/100+"\"^^xsd:float)";
      
      this.query.loadCount = "select count(distinct ?a) as ?cnt WHERE {?a a <"+this.endpoints.baseClass+"> option(transitive)"+filter+extent+"}";
	
      
      var url = this.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(this.endpoints.graph) + "&query=" + encodeURIComponent(this.prefixes.geo + " " + this.query.loadCount) + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on";

      $.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'jsonp',
	    success: function(data, textStatus, xhr) {
		var cnt = -99;
		var infite = '&infin;';
		if (data.results.bindings.length > 0 && data.results.bindings[0].hasOwnProperty('cnt')) {
		  cnt = data.results.bindings[0].cnt.value;
		}
		// var symb = cnt == -99 ? infite : cnt;
		$('#wrapperCount').html("Number of matching entities: <b>"+cnt)+"</b>";
		if (cnt > 2000 || cnt == -99) {
		    $('#doQueryEntities').addClass('btndisabled');
		    $('#doQueryEntities').html('TO MANY ENTITIES, ZOOM IN');
		} else if (cnt = 0) {
		    $('#doQueryEntities').addClass('btndisabled');
		    $('#doQueryEntities').html('NO ENTITIES IN MAP EXTENT');
		} else {
		    $('#doQueryEntities').removeClass('btndisabled');
		    $('#doQueryEntities').html('ADD TO LAYERS');
		}
	      
	    },
	    error: function(xhr, textStatus, errorThrown) {
		_UTILS.showModal("error", textStatus);
	    }
	}); 
      // select count(distinct ?a) WHERE { ?a a <http://dbpedia.org/ontology/Garden> . ?a <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?b . FILTER (?b > 40.00)}
    
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  