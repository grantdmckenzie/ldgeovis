

  _UTILS.showModal = function(code, message) {
    alert(message);
    // TO DO: add real modal
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
  