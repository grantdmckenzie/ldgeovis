
  var _map = null;
  var _sparql = null;
  var _graph = null;
  var _ontology = null;
  var _format = null;
  var group = null;

  $(function() {
      _map = L.map('map').setView([20,10], 3);
      L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	      maxZoom: 18,
	     //  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ',
	      id: 'grantdmckenzie.i22p4k2n'
      }).addTo(_map); 
    
      
      $('#doQuery').on('click', function() {
	  initialQuery();
      });
      $('#doQueryEntities').on('click', function() {
	  doQueryEntities();
      });
      $('#back3').on('click', function() {
	  back3();
      });
      
      
  });
  
  
  function initialQuery() {
    
      _sparql = $('#sparql').val();
      _graph = $('#graph').val();
      _ontology = $('#ont').val();
      _format = "application/sparql-results+json";
      var limit = 100;
      var prefix = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>";
      
      var query = "select distinct ?a where {?a rdfs:subClassOf* <" + _ontology + ">}";
      
      var url = _sparql + "?default-graph-uri=" + encodeURIComponent(_graph) + "&query=" + encodeURIComponent(prefix + " " + query + " limit " + limit) + "&format=" + encodeURIComponent(_format) + "&timeout=3000&debug=on";
    
      
      $.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data, textStatus, xhr) {
		displayResults(data.results.bindings);
	    },
	    error: function(xhr, textStatus, errorThrown) {
		alert('error');
	    }
	});
  }
  
  function doQueryEntities() {
      var limit = 100;
      var oclass = $('#subclassselect').val();
      var prefix = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>";
      
      var query = "select ?e ?g where {?e a <" + oclass + "> . ?e geo:geometry ?g}";
      var url = _sparql + "?default-graph-uri=" + encodeURIComponent(_graph) + "&query=" + encodeURIComponent(prefix + " " + query + " limit " + limit) + "&format=" + encodeURIComponent(_format) + "&timeout=3000&debug=on";
    
      
      $.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data, textStatus, xhr) {
		displayEntity(data.results.bindings);
		mapEntity(data.results.bindings);
	    },
	    error: function(xhr, textStatus, errorThrown) {
		alert('error');
	    }
	}); 
  }
  
  function displayResults(d) {
      $('#sidebar1').hide();
      $('#sidebar2').show();
      for(var i=0;i<d.length;i++) {
	  var li = d[i].a.value.lastIndexOf('/');
	  
	  var x = d[i].a.value.substr(li+1,d[i].a.value.length-li);
	  $('#subclassselect')
	      .append($('<option>', { value : d[i].a.value })
	      .text(x));
      }
  }
  
  function displayEntity(d) {
      $('#sidebar1').hide();
      $('#sidebar2').hide();
      $('#sidebar3').show();
      $('#results').html("");
      for(var i=0;i<d.length;i++) {
	  var li = d[i].e.value.lastIndexOf('/');
	  var x = d[i].e.value.substr(li+1,d[i].e.value.length-li);
	  var ent = "<div id='"+d[i].e.value+"' class='resultentity'>"+decodeURIComponent(x)+"</div>";
	  $('#results').append(ent);
      }
  }
  
  function back3() {
      $('#sidebar1').hide();
      $('#sidebar3').hide();
      $('#sidebar2').show();
  }
  
  function mapEntity(m) {
      var markers = [];
      if(_map.hasLayer(group)) {
	  _map.removeLayer(group);
      }
      for(var i=0;i<m.length;i++) {
	  var x = omnivore.wkt.parse(m[i].g.value);
	  var popupOptions = {
			      'minWidth': '800',
			      'maxWidth': '600',
			      'closeButton': true
			  }
	  x.bindPopup("<b>"+decodeURIComponent(m[i].e.value)+"</b><br/><div id='pop"+i+"' class='popupdiv'><img src='img/loading.gif' style='margin-left:180px;margin-top:100px'/></div>", popupOptions);
	  x.urig = m[i].e.value;
	  x.idg = i;
	  x.on('click', function(e) {
	      getDetails(encodeURIComponent(this.urig), this.idg);
	  });
	  markers.push(x);
      }
      group = L.layerGroup(markers);
      _map.addLayer(group);
  }
  
  function getDetails(uri, idg) {
      var limit = 100;
      var query = "select ?a ?b where {<" + decodeURIComponent(uri) + "> ?a ?b}";
      var url = _sparql + "?default-graph-uri=" + encodeURIComponent(_graph) + "&query=" + encodeURIComponent(query + " limit " + limit) + "&format=" + encodeURIComponent(_format) + "&timeout=3000&debug=on";
    
      $.ajax({
	    url: url,
	    urig: idg,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data, textStatus, xhr) {
		var d = data.results.bindings;
		var content = "";
		for(var i=0;i<d.length;i++) {
		   /* var li = d[i].a.value.lastIndexOf('#');
		   var property = d[i].a.value.substr(li+1,d[i].a.value.length-li);
		   
		   li = d[i].b.value.lastIndexOf('/');
		   var val = d[i].b.value.substr(li+1,d[i].b.value.length-li); */
		   var property = d[i].a.value;
		   var val = d[i].b.value;
		   content += property + ": <span class='subprop'>" + val + "</span><br/>";
		}
		$('#pop'+this.urig).html(content);
	    },
	    error: function(xhr, textStatus, errorThrown) {
		alert('error');
	    }
	});
  }