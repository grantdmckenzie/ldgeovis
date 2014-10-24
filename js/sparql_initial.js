  var _parents = [];
  var _selectedClass = null;
  var counts = {};
  function initialQuery() {
    
      _sparql = $('#sparql').val();
      _graph = $('#graph').val();
      _ontology = $('#ont').val();
      _format = "application/sparql-results+json";
      var limit = 100;
      var prefix = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>";
      var query = "select ?child ?parent (count(?b) as ?count) where {?child rdfs:subClassOf* <" + _ontology + "> . ?child rdfs:subClassOf ?parent . ?b a ?child} group by ?child ?parent";
      
      var url = _sparql + "?default-graph-uri=" + encodeURIComponent(_graph) + "&query=" + encodeURIComponent(prefix + " " + query + " order by ?child") + "&format=" + encodeURIComponent(_format) + "&timeout=3000&debug=on";
    
      
      $.ajax({
	    url: url,
	    type: 'GET',
	    dataType: 'json',
	    success: function(data, textStatus, xhr) {
		intialResults(data.results.bindings);
	    },
	    error: function(xhr, textStatus, errorThrown) {
		alert('error');
	    }
	});
  }

  function intialResults(d) {
      $('#sidebar1').hide();
      $('#sidebar2').show();
      var data = [];
      
      var parents = [];
      for(var i=0;i<d.length;i++) {
	  path = getParentParent(d[i].parent.value, d, [d[i].child.value]);
	  data.push(path);
	  counts[d[i].child.value] = d[i].count.value;
      }
      var li = $('#ont').val().lastIndexOf('/');
      var x = $('#ont').val().substr(li+1,$('#ont').val().length-li)
      _parents.push({ "id" : $('#ont').val(), "parent" : "#", "text" : x + " <span style='font-size:0.8em'>("+counts[$('#ont').val()]+")</span>"});
      for(var i=0;i<data.length;i++) {
	    for(var j=data[i].length-1;j>0;j--) {
		checkParents(data[i][j-1], data[i][j]);
	    }
      }
      _selectedClass = $('#ont').val();
      $('#subclasses').on('changed.jstree', function (e, data) { 
	    _selectedClass = data.node.id;
      }).jstree({ 'core' : {'data' : _parents} });
  }
  
  
  function checkParents(id, parent) {
      var match = false;
      for(var z=0;z<_parents.length;z++) {
	    if (_parents[z].id == id && _parents[z].parent == parent) {
		match = true;
	    }
      }
      if (!match) {
	  var li = id.lastIndexOf('/');
	  var x = id.substr(li+1,id.length-li);
	  _parents.push({ "id" : id, "parent" : parent, "text" : x + " <span style='font-size:0.8em'>("+counts[id]+")</span>"});
      }
  }
  
  function getParentParent(parent, list, path) {
 
    for(var i=0;i<list.length;i++) {
      if (list[i].child.value == parent) {
	  path.push(parent);
	  path = getParentParent(list[i].parent.value, list, path);
      }
    }
    return path;
  }
  
  function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
      if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
  }
  
  
  
  /* 	  var li = d[i].child.value.lastIndexOf('/');
	  
	  var x = d[i].child.value.substr(li+1,d[i].child.value.length-li);
	  $('#subclassselect')
	      .append($('<option>', { value : d[i].child.value })
	      .text(x)); 
	      
	      var li = d[i].child.value.lastIndexOf('/');
	  var x = d[i].child.value.substr(li+1,d[i].child.value.length-li);
	  
	  data.push({"id": d[i].child.value, "parent": d[i].parent.value, "text": x});
	      */