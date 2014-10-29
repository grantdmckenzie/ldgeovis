

  _UTILS.showModal = function(code, message, width) {
    $('#modalMessage').css('width',width+"px");
    $('#modalMessage').css('marginLeft', (width/2*-1)+"px");
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