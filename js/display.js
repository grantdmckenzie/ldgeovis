/* ========================================
 * @project = Linked Data Geovisualizer
 * @author = Grant McKenzie
 * @contact = grant.mckenzie@geog.ucsb.edu
 * @date = October, 2014
 * @lab = http://stko.geog.ucsb.edu
 * ======================================== */

  // Display the results of the loadClasses ajax call
  _STKO.display.loadClasses = function(d) {
      $('#sidebar1').hide();
      $('#sidebar2').show();
      
      var data = [];
      var parents = [];
      var counts = [];
      
      for(var i=0;i<d.length;i++) {
	  var path = getParentParent(d[i].parent.value, d, [d[i].child.value]);
	  data.push(path);
	  counts[d[i].child.value] = d[i].count.value;
      }
      
      var n = _UTILS.getname(_STKO.endpoints.baseclass, "/");
      parents.push({ "id" : _STKO.endpoints.baseclass, "parent" : "#", "text" : n.name + " <span style='font-size:0.8em'>("+counts[_STKO.endpoints.baseclass]+")</span>"});
      for(var i=0;i<data.length;i++) {
	    for(var j=data[i].length-1;j>0;j--) {
		checkParents(data[i][j-1], data[i][j]);
	    }
      }
      _STKO.selectedClass = _STKO.endpoints.baseclass;
      $('#subclasses').on('changed.jstree', function (e, data) { 
	    _STKO.selectedClass = data.node.id;
	    _UTILS.accordion.expand("properties");
	    $('#properties').html("<img src='img/loading2.gif' style='margin-left:100px;margin-top:50px;'/>");
	    _STKO.loadProperties(_STKO.selectedClass);
      }).jstree({ 'core' : {'data' : parents} });
      
      function getParentParent(parent, list, path) {
	  for(var i=0;i<list.length;i++) {
	      if (list[i].child.value == parent) {
		  path.push(parent);
		  path = getParentParent(list[i].parent.value, list, path);
	      }
	  }
	  return path;
      }
      
      function checkParents(id, parent) {
	  var match = false;
	  for(var z=0;z<parents.length;z++) {
		if (parents[z].id == id && parents[z].parent == parent) {
		    match = true;
		}
	  }
	  if (!match) {
	      var li = id.lastIndexOf('/');
	      var x = id.substr(li+1,id.length-li);
	      parents.push({ "id" : id, "parent" : parent, "text" : x + " <span style='font-size:0.8em'>("+counts[id]+")</span>"});
	  }
      }
  }
  
  // Display the results of the loadProperties ajax call
  _STKO.display.loadProperties = function(d) {
      var content = "";
      var ns = [];
      var namespace = [];
      for(var i=0;i<d.length;i++) {
	  var li = d[i].prop.value.lastIndexOf('#');
	  if (li != -1) {
	    var n = _UTILS.getname(d[i].prop.value, "#");
	    namespace = loopNameSpaces(ns, n.prefix);
	  } else {
	      var n = _UTILS.getname(d[i].prop.value, "/");
	      namespace = loopNameSpaces(ns, n.prefix);
	  }
	  
	  content += _STKO.display.generateParams(namespace[0], namespace[1], n.name, d[i].prop.value, d[i].count.value);
	  
	 
	  
      }
      $('#properties').html(content);
      
      function loopNameSpaces(ns, uri) {
	  var match = false;
	  for(var g=0;g<ns.length;g++) {
	      if (ns[g].val == uri)
		  match = new Array(ns[g].ns, uri);
	  }
	  if (!match) {
	      ns.push({"ns":"ns"+ns.length, "val":uri});
	      return new Array("ns"+(ns.length-1),uri);
	  } else {
	      return match;
	  }
      }
  }
  
  _STKO.display.loadEntities = function(d) {
      $('#sidebar1').hide();
      $('#sidebar2').hide();
      $('#sidebar3').show();
      $('#results').html("");
      var counter = 0;
      for(var i=0;i<d.length;i++) {
	  var li = d[i].e.value.lastIndexOf('/');
	  var x = d[i].e.value.substr(li+1,d[i].e.value.length-li);
	  var ent = "<div id='l"+counter+"' class='resultentity' onclick='_MAP.showMarkerPopup("+i+",\""+d[i].e.value+"\")'>"+decodeURIComponent(x)+"</div>";
	  $('#results').append(ent);
	  counter++;
      }
  }
  
  
  _STKO.display.generateParams = function(namespace, uri, name, full, count) {
    
    var mainDiv = "<div class='proptext' id='"+namespace+name+"'>";
      mainDiv += "<div title='"+uri+"' onclick=\"_STKO.loadDateType('"+full+"', '"+namespace+name+"')\">" + namespace + ":" + name + " ("+count+")</div>";
      mainDiv += "<div style='color:#333;margin: 3px 0px;display:none' id='sub_"+namespace+name+"'></div>";
      mainDiv += "<div  class='equals' id='equals_"+namespace+name+"' style='display:none;'>"
	mainDiv += "<table id='table_"+namespace+name+"'><tr id='tr_"+namespace+name+"'><td onclick='_UTILS.toggleEquals(\"eq_"+namespace+name+"\")' id='eq_"+namespace+name+"' style='font-size:1.3em;width:20px;' class='eq123' title='Click to change condition'>=</td>";
	mainDiv += "<td><input type='text' id='input_"+namespace+name+"' class='propinput' /></td><td><img id='plus_"+namespace+name+"' onclick='_UTILS.addRow(\""+namespace+name+"\",\"\")' src='img/plus.png' style='width:20px;' title='Add Restriction' /></td>";
	mainDiv += "</tr></table>";
	mainDiv += "<div class='addtobucket' onclick='_UTILS.addToBucket(\""+namespace+"\",\""+name+"\",\""+full+"\")'>Add to Bucket</div>";
      mainDiv += "</div>";
    mainDiv += "</div>"; 
    return mainDiv;
  }

  



  

  

  

 