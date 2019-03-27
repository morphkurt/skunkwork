
let matchData;

let dropdownTeam;
let dropdownPlayer;
let dropdownPlay;
let dropdownPeriod;

let period;
let player;
let team;
let play;

let cliplength=10;

var json={
    "baseDomain":"https://bpmultihlsvods257.ngcdn.telstra.com",
    "urlPrefix":"/hls-vod/ingest_aflfilms_vod/2019/03/982768/VOD_Source/2019-03-22_10-53-22-3925",
    "assetLength":1197,
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



function loadData() {
        $.getJSON( "https://raw.githubusercontent.com/morphkurt/skunkwork/master/videoclip/js/vision-trxs-20190140101.json", function( json ) {
                matchData=json;
                dropdownTeam = $('#team');
                dropdownPlayer = $('#player');
                dropdownPlay = $('#play');
                dropdownPeriod = $('#period');

                dropdownTeam.empty();
                dropdownTeam.append('<option selected="true" disabled>Choose Team</option>');
                dropdownTeam.prop('selectedIndex', 0);

                dropdownPlayer.empty();
                dropdownPlayer.append('<option selected="true" disabled>Choose Player (Optional)</option>');
                dropdownPlayer.prop('selectedIndex', 0);


                dropdownPlay.empty();
                dropdownPlay.append('<option selected="true" disabled>Choose Play</option>');
                dropdownPlay.append($('<option></option>').attr('value', 'goal').text('Goal'));
                dropdownPlay.append($('<option></option>').attr('value', 'kick').text('Kick'));
                dropdownPlay.prop('selectedIndex', 0);

                dropdownPeriod.empty();
                dropdownPeriod.append('<option selected="true" disabled>Choose Quarter</option>');
                dropdownPeriod.append($('<option></option>').attr('value', '1').text('Q1'));
                dropdownPeriod.append($('<option></option>').attr('value', '2').text('Q2'));
                dropdownPeriod.append($('<option></option>').attr('value', '3').text('Q3'));
                dropdownPeriod.append($('<option></option>').attr('value', '4').text('Q4'));
                dropdownPeriod.prop('selectedIndex', 0);
                popluateTeams(json);
        });
}


$( document ).ready(function() {
   $('#team').change(function() {
                dropdownPlayer.empty();
                dropdownPlayer.append('<option selected="true" disabled>Choose Player</option>');
                dropdownPlayer.prop('selectedIndex', 0);
                team = $(this).val();
                matchData.report.players.forEach(
                    function(obj) {
                        if (obj.squadId == team) {
                                dropdownPlayer.append($('<option></option>').attr('value', obj.playerId).text(obj.displayName));
                        }

                    });
   });
   $('#period').change(function (){
        period=$(this).val();
   });
   $('#player').change(function (){
        player=$(this).val();
   });
   $('#play').change(function (){
        play=$(this).val();
   });
   $('#createVideo').click(function (){
       var clips = [];
       matchData.report.matchTrxs.forEach(
            function(obj) {
                if (play !=null && contains(obj,play) ) {
                    if (period !=null && period == obj.period ) {
                        if (team ==null) {
                            clips.push({"start": parseInt(obj.matchSeconds),"end":  parseInt(obj.matchSeconds)+cliplength});
                        }
                        else if(team == obj.squadId) {
                            if (player ==null) {
                                clips.push({"start": parseInt(obj.matchSeconds),"end":  parseInt(obj.matchSeconds)+cliplength});
                            }
                            else if (player == obj.playerId){
                                clips.push({"start": parseInt(obj.matchSeconds),"end":  parseInt(obj.matchSeconds)+cliplength});
                            }
                        }
                    }        
                }
        });
        if (clips.length > 0){
          $('#result').text("");  
          json.clips=clips;
          base64=btoa(JSON.stringify(json));
          var video2 = videojs("vid2");
          //https://web.damitha.xyz/skunkapi/ewoJImJhc2VEb21haW4iOiJodHRwczovL2JwbXVsdGlobHN2b2RzMjU3Lm5nY2RuLnRlbHN0cmEuY29tIiwKCSJ1cmxQcmVmaXgiOiIvaGxzLXZvZC9pbmdlc3RfYWZsZmlsbXNfdm9kLzIwMTgvMDYvOTYyNDc2L1ZPRF9Tb3VyY2UvMjAxOC0wNi0wOV8wNS00My0zMi0xNDUyIiwKCSJhc3NldExlbmd0aCI6MjI3LAoJInJhdGVzIjpbCgkJeyJyYXRlIjoyNDAwMDAwLCAicGxheUxpc3ROYW1lIjoib3V0cHV0XzI0MDBrYnBzXzcyMHAubXA0In0sCgkJeyJyYXRlIjo3MDAwMDAsICJwbGF5TGlzdE5hbWUiOiJvdXRwdXRfNzAwa2Jwc18zNjBwLm1wNCJ9LAoJCXsicmF0ZSI6NDAwMDAwLCAicGxheUxpc3ROYW1lIjoib3V0cHV0XzQwMGticHNfMjcwcC5tcDQifSwKCQl7InJhdGUiOjIzNjAwMCwgInBsYXlMaXN0TmFtZSI6Im91dHB1dF8yMzZrYnBzXzE4MHAubXA0In0sCgkJeyJyYXRlIjoxNjgwMDAsInBsYXlMaXN0TmFtZSI6Im91dHB1dF8xNjhrYnBzXzE4MHAubXA0In0KCV0sCgkic2VnbWVudExlbmd0aCI6OCwKCSJmdWxsTGVuZ3RoIjowLAoJImNsaXBzIjogWwoJCXsgInN0YXJ0IjoxMDAsImVuZCI6MTIwIH0sCgkJeyAic3RhcnQiOjUwMCwiZW5kIjo1MjAgfSwKCQl7ICJzdGFydCI6NzAwLCJlbmQiOjc1MCB9LAoJCXsgInN0YXJ0IjoxMjAwLCJlbmQiOjEyMzAgfQoJXQp9CgoK/playlist.m3u8
          video2.src("https://web.damitha.xyz/skunkapi/"+base64+"/playlist.m3u8");
          video2.play();
        } else {
          $('#result').text("Selection Not Found");  
        }
           
   });
    loadData();
});

function contains(obj,play){
    for (var i = 0; i < obj.stats.length; i++) {
        if(obj.stats[i]==play){
            return true;
        }
    }
    return false;
}

function popluateTeams(json){
        dropdownTeam.append($('<option></option>').attr('value', json.report.matchInfo.homeSquadId).text(json.report.matchInfo.homeSquadName));
        dropdownTeam.append($('<option></option>').attr('value', json.report.matchInfo.awaySquadId).text(json.report.matchInfo.awaySquadName));
        console.log(json.report.matchInfo.homeSquadId);
}

function loadPlayers(json,val){
        alert(val);
}
