/* ========================================
 * @project = Linked Data Geovisualizer
 * @author = Grant McKenzie
 * @contact = grant.mckenzie@geog.ucsb.edu
 * @date = October, 2014
 * @lab = http://stko.geog.ucsb.edu
 * ======================================== */

  // Load the Classes and SubClasses from the given data
  _STKO.loadClasses = function() {
     this.endpoints.sparql = $('#sparql').val();
     this.endpoints.graph = $('#graph').val();
     this.endpoints.baseclass = $('#ont').val();
     this.params.format = "application/sparql-results+json";
     this.params.limit = 100;
     this.query.loadClasses = "select ?child ?parent (count(?b) as ?count) where {?child rdfs:subClassOf* <" + this.endpoints.baseclass + "> . ?child rdfs:subClassOf ?parent . ?b a ?child} group by ?child ?parent";
      
      var url = this.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(this.endpoints.graph) + "&query=" + encodeURIComponent(this.prefixes.rdfs + " " + this.query.loadClasses + " order by ?child") + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on";
      
      
      
      $.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data, textStatus, xhr) {
		_STKO.display.loadClasses(data.results.bindings);
	    },
	    error: function(xhr, textStatus, errorThrown) {
		_UTILS.showModal("error", textStatus, 300);
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
	    dataType: 'json',
	    success: function(data, textStatus, xhr) {
		_STKO.display.loadProperties(data.results.bindings);
	    },
	    error: function(xhr, textStatus, errorThrown) {
		_UTILS.showModal("error", textStatus);
	    }
	});
    
  }
  
  // Load all entities based on the selected class and property criteria
  _STKO.loadEntities = function() {
      $('#doQueryEntities').hide();
      $('#loadingbtn').show();

      var transitive = ($('#transitive').is(":checked")) ? "*" : "";
      var extent = ($('#extent').is(":checked")) ? " . ?e geo:lat ?lat . ?e geo:long ?long . FILTER ( ?long > "+_MAP.map.getBounds().getWest()+" && ?long < "+_MAP.map.getBounds().getEast()+" && ?lat > "+_MAP.map.getBounds().getSouth()+" && ?lat < "+_MAP.map.getBounds().getNorth()+")" : "";
	  
      this.query.loadEntities = "select ?e (group_concat(?c; separator = \"|\") as ?g) where {?e a"+transitive+" <" + _STKO.selectedClass + "> . ?e geo:geometry ?c" + extent +"}";
      
      var url = this.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(this.endpoints.graph) + "&query=" + encodeURIComponent(this.prefixes.geo + " " + this.query.loadEntities + " order by ?e limit " + this.params.limit) + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on";
    
      
      $.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data, textStatus, xhr) {
		_STKO.display.loadEntities(data.results.bindings);
		_MAP.mapEntities(data.results.bindings);
	    },
	    error: function(xhr, textStatus, errorThrown) {
		_UTILS.showModal("error", textStatus);
	    }
	}); 
  }
  
  // Load Details of a specific entity.  All properties and values
  _STKO.loadDetails = function(uri, id) {
      this.query.loadDetails = "select ?a ?b where {<" + uri + "> ?a ?b}";
      var url = this.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(this.endpoints.graph) + "&query=" + encodeURIComponent(this.query.loadDetails + " limit " + this.params.limit) + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on";
    
      $.ajax({
	    url: url,
	    urig: id,
	    type: 'GET',
	    dataType: 'json',
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
	
	var url = this.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(this.endpoints.graph) + "&query=" + encodeURIComponent(this.prefixes.geo + " " + this.query.loadDateType) + "&format=" + encodeURIComponent(this.params.format) + "&timeout=3000&debug=on";
      
	
	$.ajax({
	      url: url,
	      type: 'GET',
	      dataType: 'json',
	      success: function(data, textStatus, xhr) {
		  
		if (data.results.bindings[0].hasOwnProperty('dt')) {
		  var n = _UTILS.getname(data.results.bindings[0].dt.value, "#");
		  $('#sub_'+id).html("Data Type: "+n.name + "<br/>Value Range: "+data.results.bindings[0].max.value + " to "+data.results.bindings[0].min.value);
		} else {
		  $('#sub_'+id).html("Data Type: Non-numeric");
		}
		$('#input_'+id).slideDown();
		$('#sub_'+id).slideDown();
	      },
	      error: function(xhr, textStatus, errorThrown) {
		  _UTILS.showModal("error", textStatus);
	      }
	  }); 
      } else {
	  $('#input_'+id).slideUp();
	  $('#sub_'+id).slideUp();
      }
  }