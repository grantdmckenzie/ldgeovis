/* ========================================
 * @project = Linked Data Geovisualizer
 * @author = Grant McKenzie
 * @contact = grant.mckenzie@geog.ucsb.edu
 * @date = October, 2014
 * @lab = http://stko.geog.ucsb.edu
 * ======================================== */

  _MAP.markers = [];
  _MAP.groupLayer = {};
 
  function loadMap() {
    
      _MAP.map = L.map('map').setView([20,10], 3);
      L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	      maxZoom: 18,
	      id: 'bradley123.k313cfag'
      }).addTo(_MAP.map); 
      
      _MAP.map.on('moveend', function() {
	 /* if (_MAP.map.getZoom() >= 7) {
	      /$('#rExtent').show();
	      $('#wExtent').hide();
	  } else {
	      $('#rExtent').hide();
	      $('#wExtent').show();
	  } */
	 _STKO.loadCount();
      });
  }
  
  _MAP.displayPopup = function(d, id) {
      var content = "";
      var ns = [];
      for(var i=0;i<d.length;i++) {
	  var li = d[i].a.value.lastIndexOf('#');
	  var sub = "";
	  if (li != -1) {
	    var n = _UTILS.getname(d[i].a.value, "#");
	    var namespace = loopNameSpaces(ns, n.prefix+"#");
	  } else {
	    var n = _UTILS.getname(d[i].a.value, "/");
	    var namespace = loopNameSpaces(ns, n.prefix+"/");
	  }
	  content += "<span title='"+namespace[1]+"'>" + namespace[0] + ":"+n.name+"</span>: <span class='subprop'>" + d[i].b.value + "</span><br/>";
      }
      $('#pop'+id).html(content);
      this.map.setView(this.markers[id].getBounds().getNorthWest(),10);
      
      function loopNameSpaces(ns, uri) {
	  var match = false;
	  for(var pre in prefixcc) {
	      if (prefixcc[pre] == uri)
		  match = new Array(pre, uri);
	  }
	  if (!match) {
	      ns.push({"ns":"ns"+ns.length, "val":uri});
	      return new Array("ns"+(ns.length-1),uri);
	  } else {
	      return match;
	  }
      }
  }
  
  _MAP.showMarkerPopup = function(i, uri) {
      this.markers[i].openPopup();
      _STKO.loadDetails(uri, i);
  }
  
  _MAP.mapEntities = function(m) {
      this.markers = [];
      if(this.map.hasLayer(this.groupLayer)) {
	  this.map.removeLayer(this.groupLayer);
      }
      for(var i=0;i<m.length;i++) {
	  var ll = m[i].g.value.indexOf('|');
	  var geo = "";
	  if (ll == -1) {
	      geo = m[i].g.value;
	  } else {
	      var dd = m[i].g.value.split("|");
	      geo = dd[0];
	      // TO DO. Currently only takes the first point geometry.  Should take all an possibly map to polygon?
	  }
	  var point = omnivore.wkt.parse(geo);
	  var popupOptions = {'minWidth': '800','maxWidth': '600',  'closeButton': true}
	  
	  point.bindPopup("<b>"+decodeURIComponent(m[i].e.value)+"</b><br/><div id='pop"+i+"' class='popupdiv'><img src='img/loading.gif' style='margin-left:380px;margin-top:100px'/></div>", popupOptions);
	  point.urig = m[i].e.value;
	  point.idg = i;
	  point.on('click', function(e) {
	      _STKO.loadDetails(this.urig, this.idg);
	  });
	  this.markers.push(point);
      }
      this.groupLayer = L.layerGroup(this.markers);
      this.map.addLayer(this.groupLayer);
     
  }
  