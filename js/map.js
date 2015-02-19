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
    
      // Set up the Map Object
      _MAP.map = L.map('map',{zoomControl:false}).setView([20,10], 3);
      L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
	      maxZoom: 18,
	      id: 'bradley123.k313cfag',
	      
      }).addTo(_MAP.map); 
      
      // Every time the map is moved check to see how many entities fit the criteria
      _MAP.map.on('moveend', function() {
	 _STKO.loadCount();
      });
      
      $('#wrapperLayersExpand').on('click', function() {
	  
	  if ($('#wrapperLayers').css('left') == '0px') {
	    $('#wrapperLayers').animate({left: '-222px'});
	  } else {
	    $('#wrapperLayers').animate({left:'0px'});
	  }
      });
      
      $('#wrapperSideBarExpand').on('click', function() {
	  if ($('.sidebar').css('right') == '0px') {
	    $('.sidebar').animate({right:'-422px'});
	    $(this).css('background-image','url(\'img/wback.png\')');
	  } else {
	    $('.sidebar').animate({right:'0px'});
	    $(this).css('background-image','url(\'img/wforward.png\')');
	  }
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
      // slightly offset the center so the entire popup can be seen.	
      var ll = this.markers[id].getLatLng();
      this.map.setView([ll.lat+0.2, ll.lng],10);
      
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
	  var point = L.marker([m[i].lat.value, m[i].long.value]);
	  // TO DO. Currently only takes the first point geometry.  Should take all an possibly map to polygon?
	 
	  //var point = omnivore.wkt.parse(geo);
	  var popupOptions = {'minWidth': '800','maxWidth': '600',  'closeButton': true}
	  
	  point.bindPopup("<b>"+decodeURIComponent(m[i].a.value)+"</b><br/><div id='pop"+i+"' class='popupdiv'><img src='img/loading.gif' style='margin-left:380px;margin-top:100px'/></div>", popupOptions);
	  point.urig = m[i].a.value;
	  point.idg = i;
	  point.on('click', function(e) {
	      _STKO.loadDetails(this.urig, this.idg);
	  });
	  this.markers.push(point);
      }
      this.groupLayer = L.layerGroup(this.markers);
      this.map.addLayer(this.groupLayer);
     
  }
  