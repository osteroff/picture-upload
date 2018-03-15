var map, marker, markerLayer;

function initMap(startLongitude, startLatitude, destLongitude, destLatitude){
  console.log(startLongitude);
  console.log(startLatitude);
  console.log(destLongitude);
  console.log(destLatitude);

  map = new Tmap.Map({
    div:'map_div',
    width : "934px",
    height : "452px",
  });
  var tData = new Tmap.TData();//REST API 에서 제공되는 경로, 교통정보, POI 데이터를 쉽게 처리할 수 있는 클래스입니다.

  var s_lonLat = new Tmap.LonLat(startLongitude, startLatitude); //시작 좌표입니다.
  var e_lonLat = new Tmap.LonLat(destLongitude, destLatitude); //도착 좌표입니다.
  // var s_lonLat = new Tmap.LonLat(126.925356, 37.553756); //시작 좌표입니다.
  // var e_lonLat = new Tmap.LonLat(126.975598, 37.554034); //도착 좌표입니다.
  var optionObj = {
              reqCoordType:"WGS84GEO", //요청 좌표계 옵셥 설정입니다.
              resCoordType:"EPSG3857"  //응답 좌표계 옵셥 설정입니다.
            }

  tData.getRoutePlan(s_lonLat, e_lonLat, optionObj);//경로 탐색 데이터를 콜백 함수를 통해 XML로 리턴합니다.

  tData.events.register("onComplete", tData, onComplete);//데이터 로드가 성공적으로 완료되었을 때 발생하는 이벤트를 등록합니다.
  tData.events.register("onProgress", tData, onProgress);//데이터 로드중에 발생하는 이벤트를 등록합니다.
  tData.events.register("onError", tData, onError);//데이터 로드가 실패했을 떄 발생하는 이벤트를 등록합니다.
}

//데이터 로드가 성공적으로 완료되었을 때 발생하는 이벤트 함수 입니다.
function onComplete(){
  console.log(this.responseXML); //xml로 데이터를 받은 정보들을 콘솔창에서 확인할 수 있습니다.
  var kmlForm = new Tmap.Format.KML({extractStyles:true}).read(this.responseXML);
  var vectorLayer = new Tmap.Layer.Vector("vectorLayerID");
  vectorLayer.addFeatures(kmlForm);
  map.addLayer(vectorLayer);
  //경로 그리기 후 해당영역으로 줌
  map.zoomToExtent(vectorLayer.getDataExtent());

  // document.getElementById("result").innerHTML = vectorLayer.getFeatureById("tmap:taxiFare");
  // vectorLayer.getFeaturesByAttribute("tmap:taxiFare", value);
  // document.getElementById("result").innerHTML = value;
  // document.write(this.responseXML.childNodes);
  // document.write(this.responseXML.nodeName);
  // document.write(this.responseXML.childNodes[0].nodeName + '\n');
  // document.write(this.responseXML.childNodes[0].childNodes[0].nodeName + '\n');
  var oSerializer = new XMLSerializer();
  var sXML = oSerializer.serializeToString(this.responseXML.childNodes[0]);
  console.log(sXML);

  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(sXML,"text/xml");
  document.getElementById("result").innerHTML = '택시 요금: ' + xmlDoc.getElementsByTagName("tmap:taxiFare")[0].childNodes[0].nodeValue;
}


//데이터 로드중 발생하는 이벤트 함수입니다.
function onProgress(){
	//alert("onComplete");
}

//데이터 로드시 에러가 발생시 발생하는 이벤트 함수입니다.
function onError(){
	//alert("onError");
  document.write("데이터 로드 중 에러가 발생했습니다!");
}
