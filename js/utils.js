  _UTILS.accordion = {};

  _UTILS.showModal = function(code, message, width, height) {
    $('#modalMessage').css('width',width+"px");
    $('#modalMessage').css('marginLeft', ((width/2*-1)-20)+"px");
    $('#modalMessage').css('height',height+"px");
    $('#modalMessage').css('marginTop', ((height/2*-1)-20)+"px");
    if (code == "error")
      $('#modalHeader').html("Sorry there was an error");
    else
      $('#modalHeader').html(code);
    
    $('#modalMessage > #modalContent').html(message);
    $('#modalMessage').show();
  }
  
  _UTILS.getname = function(val, symbol) {
      var li = val.lastIndexOf(symbol);
      var name = val.substr(li+1,val.length-li);
      var prefix = val.substr(0,li);
      return {"name":name,"prefix":prefix};
  }
  
  _UTILS.back3 = function() {
      $('#sidebar1').hide();
      $('#sidebar3').hide();
      $('#sidebar2').show();
      $('#doQueryEntities').show();
      $('#loadingbtn').hide();
  }
  
  _UTILS.toggleProperty = function(id) {
      $('#'+id).toggleClass('propertyon');
  }
  
  _UTILS.accordion.expand = function(title) {
    
    if(title == "classes") {
      $('#subclasses').slideDown()
      $('#properties').slideUp();
    } else {
      $('#subclasses').slideUp();
      $('#properties').slideDown();
    }
  }
  
  
  _UTILS.toggleEquals = function(id) {
      var symbols = ["=", "≠", "&gt;", "&lt;"];
      var current = $('#'+id).html();
      for(var i=0;i<symbols.length;i++) {
	  if (symbols[i] == current && i < symbols.length-1)
	    $('#'+id).html(symbols[i+1]);
	  else if (symbols[i] == current)
	    $('#'+id).html(symbols[0]);
      }
  }
  
  _UTILS.addRow = function(id, subid) {
      var d = new Date().getTime();

      if ($('#plus_'+id+subid).attr('src') != 'img/close.png') {
	var mainDiv = "<td onclick='_UTILS.toggleEquals(\"eq_"+id+d+"\")' id='eq_"+id+d+"' style='font-size:1.3em;width:20px;' class='eq123' title='Click to change condition'>=</td><td><input type='text' id='input_"+id+d+"' class='propinput' style='display:inline' /></td><td><img onclick='_UTILS.addRow(\""+id+"\",\""+d+"\")' src='img/plus.png' style='width:20px;' id='plus_"+id+d+"' title='Add Restriction' /></td>";
	$('#table_'+id+' tr:last').after("<tr id='tr_"+id+d+"'>"+mainDiv+"</tr>");
      }
      $('#plus_'+id+subid).attr("src","img/close.png");
      $('#plus_'+id+subid).attr("title","Remove Restriction");
      $('#plus_'+id+subid).on('click', function() {  
	  $('#tr_'+id+subid).remove();
      });
  }
  
  _UTILS.addToBucket = function(namespace, name) {
    
      var eqs = $('#table_'+namespace+name+' .eq123');
      var inputs = $('#table_'+namespace+name+' .propinput');
      var content = "<div id='bucket_"+namespace+name+"' class='bucketitem'>" + namespace+":"+name+ " <span style='font-size:0.8em'>[";
      for(var i=0;i<inputs.length;i++) {
	    content += eqs[i].innerHTML + inputs[i].value + " & ";
      }
      content = content.substring(0, content.length-3);
      content += "]</span><div style='float:right;cursor: pointer;'><img src='img/close.png' onclick='_UTILS.removeFromBucket(\"bucket_"+namespace+name+"\")'/></div></div>";
      $('#wrapperFacets').append(content);
  }
  
  _UTILS.removeFromBucket = function(id) {
      $('#'+id).remove();
  }