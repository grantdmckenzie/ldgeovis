_STKO.layers.layers = {};

_STKO.layers.addLayer = function() {
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
      
      var loadentities = "select ?a ?lat ?long where {?a a <"+_STKO.endpoints.baseClass+"> option(transitive)"+filter+extent+"}";

      var url = _STKO.endpoints.sparql + "?default-graph-uri=" + encodeURIComponent(_STKO.endpoints.graph) + "&query=" + encodeURIComponent(_STKO.prefixes.geo + " " + loadentities) + "&format=" + encodeURIComponent(_STKO.params.format) + "&timeout=3000&debug=on";
      var n = _UTILS.getname(_STKO.endpoints.baseClass,"#");
      var nid = n.name+"_"+Date.now();
      _STKO.layers.layers[nid] = {url:url,maplayer:null, color:_MAP.markericons[Math.floor(Math.random()*7)], name: n.name, graph:_STKO.endpoints.graph, endpoint:_STKO.endpoints.sparql};
    
      _STKO.params.restrictions = [];
      $('#wrapperFacets').html("");
      $('#wrapperLayers').animate({left:'0px'});
      _UTILS.accordion.expand("classes");
      
      var l = "";
      for (var property in _STKO.layers.layers) {
	  if (_STKO.layers.layers.hasOwnProperty(property)) {
	      l = "<div style='float:left;clear:both;'><img onclick='_STKO.layers.toggleLayer(\""+property+"\");' src='img/chkoff.png' id='chk_"+property+"' style='cursor:pointer;float:left;'/><div style='border:solid 1px #333;margin-right:10px;margin-top:1px;width:15px;height:15px;border-radius:3px;float:left;background-color:#"+_STKO.layers.layers[property].color+"'></div> <div style='float:left;'>"+_STKO.layers.layers[property].name+"</div></div><br/>";
	  }
      }
      $('#layersContainer').append(l);
      $('#sidebar2').hide();
      $('#sidebar1').show();
      
}

_STKO.layers.toggleLayer = function(layername) {
    var chk = $('#chk_'+layername).attr('id');
    var src = $('#chk_'+layername).attr('src');
    if (src == "img/chkoff.png") {
	$('#chk_'+layername).attr('src','img/chkon.png');
	this.activeLayer = layername;
	_STKO.loadEntities(_STKO.layers.layers[layername].url);
    } else {
	$('#chk_'+layername).attr('src','img/chkoff.png');
	_MAP.map.removeLayer(this.layers[layername].maplayer);
    }
}