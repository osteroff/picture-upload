var map, marker, markerLayer;
var longitude, latitude;

function makeMap(longitude, latitude){
  map = new Tmap.Map({
    div:'map_div',
    width : "100%",
    height : "452px",
    });
  map.setCenter(new Tmap.LonLat(longitude, latitude).transform("EPSG:4326", "EPSG:3857"), 15);
  markerLayer = new Tmap.Layer.Markers();//맵 레이어 생성
  map.addLayer(markerLayer);//map에 맵 레이어를 추가합니다.
  map.events.register("click", map, onClick);//map 클릭 이벤트를 등록합니다.
}

function onClick(e){
  markerLayer.removeMarker(marker); // 기존 마커 삭제
  var lonlat = map.getLonLatFromViewPortPx(e.xy).transform("EPSG:3857", "EPSG:4326");//클릭 부분의 ViewPortPx를 LonLat 좌표로 변환합니다.
  // var result ='클릭한 위치의 좌표는'+lonlat+'입니다.';
  // var resultDiv = document.getElementById("result");
  // resultDiv.innerHTML = result;
  var size = new Tmap.Size(24, 38);//아이콘 사이즈 설정
  var offset = new Tmap.Pixel(-(size.w/2), -(size.h));//아이콘 중심점 설정
  var icon = new Tmap.Icon('http://tmapapis.sktelecom.com/upload/tmap/marker/pin_b_m_a.png',size, offset);//마커 아이콘 설정
  marker = new Tmap.Marker(lonlat.transform("EPSG:4326", "EPSG:3857"), icon);//마커 생성
  markerLayer.addMarker(marker);//마커 레이어에 마커 추가
}

function initMap() {
  // var longitude, latitude;

  if (navigator.geolocation) { // GPS를 지원하면
    navigator.geolocation.getCurrentPosition(function(position) {
      longitude = position.coords.longitude;
      latitude = position.coords.latitude;
      makeMap(longitude, latitude);
    }, function(error) {
      console.error(error);
      document.write(error);
    }, {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: Infinity
    });
  } else {
    document.write('GPS를 지원하지 않습니다!');
  }

  // var coords = [longitude, latitude];
  // return coods;
}
