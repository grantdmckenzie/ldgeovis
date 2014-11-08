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
  _STKO.params.restrictions = {};
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
      $('#titleClasses').on('click', function() {
	  _UTILS.accordion.expand("classes");
      });
      $('#titleProperties').on('click', function() {
	  _UTILS.accordion.expand("properties");
      });
      $('#modalMessage > #close').on('click', function() {
	  $('#modalMessage').fadeOut();
      });
      $('#sidebar1 > #viewDoQuery').on('click', function() {
	  var baseclass = $('#ont').val();
	  var query = "SELECT ?child ?parent (count(?b) as ?count)<br/> WHERE {<br/>&nbsp;&nbsp;?child rdfs:subClassOf* &lt;" + (baseclass) + "&gt; . <br/>&nbsp;&nbsp;?child rdfs:subClassOf ?parent .<br/>&nbsp;&nbsp;?b a ?child<br/>}<br/> GROUP BY ?child ?parent";
	  _UTILS.showModal("SPARQL Query", query, 500, 200);
      });
      
      $('#viewLoadProperties').on('click', function() {
	  if (_STKO.endpoints.hasOwnProperty("baseClass"))
	      var baseclass = _STKO.endpoints.baseClass;
	  else
	      var baseclass = $('#ont').val();
	  var query = "SELECT ?prop (count(?prop) as ?count) <br/> WHERE {<br/>&nbsp;&nbsp;?a ?prop ?c .<br/>&nbsp;&nbsp;?a a &lt;" + baseclass + "&gt;<br/>}<br/>ORDER BY desc (?count)";
	  _UTILS.showModal("SPARQL Query", query, 420, 200);
      });
      
      $('#about').on('click', function() {
	  _UTILS.showModal("About LD-GeoViz", txtabout, 700,400);
      });
      
  });