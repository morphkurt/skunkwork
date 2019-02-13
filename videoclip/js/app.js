
var json={
	"baseDomain":"https://bpmultihlsvods257.ngcdn.telstra.com",
	"urlPrefix":"/hls-vod/ingest_aflfilms_vod/2018/06/962476/VOD_Source/2018-06-09_05-43-32-1452",
	"assetLength":227,
	"rates":[
		{"rate":2400000, "playListName":"output_2400kbps_720p.mp4"},
		{"rate":700000, "playListName":"output_700kbps_360p.mp4"},
		{"rate":400000, "playListName":"output_400kbps_270p.mp4"},
		{"rate":236000, "playListName":"output_236kbps_180p.mp4"},
		{"rate":168000,"playListName":"output_168kbps_180p.mp4"}
	],
	"segmentLength":8,
	"fullLength":0,
};



$( document ).ready(function() {
	var originaljson = JSON.parse(JSON.stringify(json));
	originaljson.fullLength=1;
	var base64=btoa(JSON.stringify(originaljson));
	var video1 = videojs("vid1");
	 	//https://web.damitha.xyz/skunkapi/ewoJImJhc2VEb21haW4iOiJodHRwczovL2JwbXVsdGlobHN2b2RzMjU3Lm5nY2RuLnRlbHN0cmEuY29tIiwKCSJ1cmxQcmVmaXgiOiIvaGxzLXZvZC9pbmdlc3RfYWZsZmlsbXNfdm9kLzIwMTgvMDYvOTYyNDc2L1ZPRF9Tb3VyY2UvMjAxOC0wNi0wOV8wNS00My0zMi0xNDUyIiwKCSJhc3NldExlbmd0aCI6MjI3LAoJInJhdGVzIjpbCgkJeyJyYXRlIjoyNDAwMDAwLCAicGxheUxpc3ROYW1lIjoib3V0cHV0XzI0MDBrYnBzXzcyMHAubXA0In0sCgkJeyJyYXRlIjo3MDAwMDAsICJwbGF5TGlzdE5hbWUiOiJvdXRwdXRfNzAwa2Jwc18zNjBwLm1wNCJ9LAoJCXsicmF0ZSI6NDAwMDAwLCAicGxheUxpc3ROYW1lIjoib3V0cHV0XzQwMGticHNfMjcwcC5tcDQifSwKCQl7InJhdGUiOjIzNjAwMCwgInBsYXlMaXN0TmFtZSI6Im91dHB1dF8yMzZrYnBzXzE4MHAubXA0In0sCgkJeyJyYXRlIjoxNjgwMDAsInBsYXlMaXN0TmFtZSI6Im91dHB1dF8xNjhrYnBzXzE4MHAubXA0In0KCV0sCgkic2VnbWVudExlbmd0aCI6OCwKCSJmdWxsTGVuZ3RoIjowLAoJImNsaXBzIjogWwoJCXsgInN0YXJ0IjoxMDAsImVuZCI6MTIwIH0sCgkJeyAic3RhcnQiOjUwMCwiZW5kIjo1MjAgfSwKCQl7ICJzdGFydCI6NzAwLCJlbmQiOjc1MCB9LAoJCXsgInN0YXJ0IjoxMjAwLCJlbmQiOjEyMzAgfQoJXQp9CgoK/playlist.m3u8
    video1.src("https://web.damitha.xyz/skunkapi/"+base64+"/playlist.m3u8");
	video1.play();


	$('#clip1start').val(100);
	$('#clip1end').val(110);
	$('#clip2start').val(500);
	$('#clip2end').val(510);
	$('#clip3start').val(600);
	$('#clip3end').val(610);
	var base64="";
	 $('#render').click(function (e) {
	 	console.log("button pressed");
	 	console.log(json);
	 	var clips = [];
	 	clips.push({"start": parseInt($('#clip1start').val()),"end":  parseInt($('#clip1end').val())});
	 	clips.push({"start": parseInt($('#clip2start').val()),"end":  parseInt($('#clip2end').val())});
	 	clips.push({"start": parseInt($('#clip3start').val()),"end":  parseInt($('#clip3end').val())});
	 	json.clips=clips;
	 	console.log(json.clips[2].start);
	 	base64=btoa(JSON.stringify(json));
	 	var video2 = videojs("vid2");
	 	//https://web.damitha.xyz/skunkapi/ewoJImJhc2VEb21haW4iOiJodHRwczovL2JwbXVsdGlobHN2b2RzMjU3Lm5nY2RuLnRlbHN0cmEuY29tIiwKCSJ1cmxQcmVmaXgiOiIvaGxzLXZvZC9pbmdlc3RfYWZsZmlsbXNfdm9kLzIwMTgvMDYvOTYyNDc2L1ZPRF9Tb3VyY2UvMjAxOC0wNi0wOV8wNS00My0zMi0xNDUyIiwKCSJhc3NldExlbmd0aCI6MjI3LAoJInJhdGVzIjpbCgkJeyJyYXRlIjoyNDAwMDAwLCAicGxheUxpc3ROYW1lIjoib3V0cHV0XzI0MDBrYnBzXzcyMHAubXA0In0sCgkJeyJyYXRlIjo3MDAwMDAsICJwbGF5TGlzdE5hbWUiOiJvdXRwdXRfNzAwa2Jwc18zNjBwLm1wNCJ9LAoJCXsicmF0ZSI6NDAwMDAwLCAicGxheUxpc3ROYW1lIjoib3V0cHV0XzQwMGticHNfMjcwcC5tcDQifSwKCQl7InJhdGUiOjIzNjAwMCwgInBsYXlMaXN0TmFtZSI6Im91dHB1dF8yMzZrYnBzXzE4MHAubXA0In0sCgkJeyJyYXRlIjoxNjgwMDAsInBsYXlMaXN0TmFtZSI6Im91dHB1dF8xNjhrYnBzXzE4MHAubXA0In0KCV0sCgkic2VnbWVudExlbmd0aCI6OCwKCSJmdWxsTGVuZ3RoIjowLAoJImNsaXBzIjogWwoJCXsgInN0YXJ0IjoxMDAsImVuZCI6MTIwIH0sCgkJeyAic3RhcnQiOjUwMCwiZW5kIjo1MjAgfSwKCQl7ICJzdGFydCI6NzAwLCJlbmQiOjc1MCB9LAoJCXsgInN0YXJ0IjoxMjAwLCJlbmQiOjEyMzAgfQoJXQp9CgoK/playlist.m3u8
		video2.src("https://web.damitha.xyz/skunkapi/"+base64+"/playlist.m3u8");
		video2.play();
		
    });



});
