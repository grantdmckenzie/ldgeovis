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
      
      _MAP.map.on('zoomend', function() {
	  if (_MAP.map.getZoom() >= 7) {
	      $('#rExtent').show();
	      $('#wExtent').hide();
	  } else {
	      $('#rExtent').hide();
	      $('#wExtent').show();
	  }
      });
  }
  
  _MAP.displayPopup = function(d, id) {
      var content = "";
      for(var i=0;i<d.length;i++) {
	  content += d[i].a.value + ": <span class='subprop'>" + d[i].b.value + "</span><br/>";
      }
      $('#pop'+id).html(content);
      this.map.setView(this.markers[id].getBounds().getNorthWest(),10);
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
  