
  var _map = null;
  var _sparql = null;
  var _graph = null;
  var _ontology = null;
  var _format = null;
  var group = null;
  var markers = [];

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
      _map.on('zoomend', function() {
	  if (_map.getZoom() >= 7) {
	      $('#rExtent').show();
	      $('#wExtent').hide();
	  } else {
	      $('#rExtent').hide();
	      $('#wExtent').show();
	  }
      });
      
      
  });
  
  

  
  function doQueryEntities() {
      $('#doQueryEntities').hide();
      $('#loadingbtn').show();
      var limit = 100;
      
      var oclass = _selectedClass; //$('#subclassselect').val();
      var prefix = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>";
      
      var transitive = "";
      if ($('#transitive').is(":checked")) {
	transitive = "*";
      }
      
      var extent = "";
      if ($('#extent').is(":checked")) {
	  var b = _map.getBounds();
	  extent = " . ?e geo:lat ?lat . ?e geo:long ?long . FILTER ( ?long > "+b.getWest()+" && ?long < "+b.getEast()+" && ?lat > "+b.getSouth()+" && ?lat < "+b.getNorth()+")";
      }
      var query = "select ?e (group_concat(?c; separator = \"|\") as ?g) where {?e a"+transitive+" <" + oclass + "> . ?e geo:geometry ?c" + extent +"}";
      
      var url = _sparql + "?default-graph-uri=" + encodeURIComponent(_graph) + "&query=" + encodeURIComponent(prefix + " " + query + " order by ?e limit " + limit) + "&format=" + encodeURIComponent(_format) + "&timeout=3000&debug=on";
    
      
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
  

  
  function displayEntity(d) {
      $('#sidebar1').hide();
      $('#sidebar2').hide();
      $('#sidebar3').show();
      $('#results').html("");
      var counter = 0;
      for(var i=0;i<d.length;i++) {
	  var li = d[i].e.value.lastIndexOf('/');
	  var x = d[i].e.value.substr(li+1,d[i].e.value.length-li);
	  var ent = "<div id='l"+counter+"' class='resultentity' onclick='showMarkerPopup("+i+",\""+d[i].e.value+"\")'>"+decodeURIComponent(x)+"</div>";
	  $('#results').append(ent);
	  counter++;
      }
  }
  
  function showMarkerPopup(i, uri) {
      markers[i].openPopup();
      getDetails(uri, i);
  }
  
  function back3() {
      $('#sidebar1').hide();
      $('#sidebar3').hide();
      $('#sidebar2').show();
      $('#doQueryEntities').show();
      $('#loadingbtn').hide();
  }
  
  function mapEntity(m) {
      markers = [];
      if(_map.hasLayer(group)) {
	  _map.removeLayer(group);
      }
      for(var i=0;i<m.length;i++) {
	  var ll = m[i].g.value.indexOf('|');
	  var geo = "";
	  if (ll == -1) {
	      geo = m[i].g.value;
	  } else {
	      var dd = m[i].g.value.split("|");
	      geo = dd[0];
	  }
	  var x = omnivore.wkt.parse(geo);
	  var popupOptions = {
			      'minWidth': '800',
			      'maxWidth': '600',
			      'closeButton': true
			  }
	  x.bindPopup("<b>"+decodeURIComponent(m[i].e.value)+"</b><br/><div id='pop"+i+"' class='popupdiv'><img src='img/loading.gif' style='margin-left:380px;margin-top:100px'/></div>", popupOptions);
	  x.urig = m[i].e.value;
	  x.idg = i;
	  x.on('click', function(e) {
	      getDetails(this.urig, this.idg);
	  });
	  markers.push(x);
      }
      group = L.layerGroup(markers);
      _map.addLayer(group);
     
  }
  
  function getDetails(uri, idg) {
      var limit = 100;
      var query = "select ?a ?b where {<" + uri + "> ?a ?b}";
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
	_map.setView(markers[idg].getBounds().getNorthWest(),10);
  }