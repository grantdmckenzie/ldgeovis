/* ========================================
 * @project = Linked Data Geovisualizer
 * @author = Grant McKenzie
 * @contact = grant.mckenzie@geog.ucsb.edu
 * @date = October, 2014
 * @lab = http://stko.geog.ucsb.edu
 * ======================================== */

  var _MAP = {};

  var _UTILS = {};
  var _STKO = {"endpoints": {}, "params":{}, "query": {}, "display": {}};
  _STKO.prefixes = {};
  _STKO.prefixes.rdfs = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>";
  _STKO.prefixes.geo = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>";

  var group = null;
  var markers = [];
  
  $(function() {

      loadMap();
    
      // Add events to elements
      $('#doQuery').on('click', function() {
	  _STKO.loadClasses();
      });
      $('#doQueryEntities').on('click', function() {
	  _STKO.loadEntities();
      });
      $('#back3').on('click', function() {
	  _UTILS.back3();
      });

      
      
  });