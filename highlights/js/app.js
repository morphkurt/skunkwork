
let matchData;

let dropdownTeam;
let dropdownPlayer;
let dropdownPlay;
let dropdownPeriod;
let dropdownRanking;


let period;
let player;
let team;
let play;
let ranking;

let cliplength=10;

var json={
    "baseDomain":"https://bpmultihlsvods257.ngcdn.telstra.com",
    "urlPrefix":"/hls-vod/ingest_aflfilms_vod/2018/09/974272/VOD_Source/2018-09-30_10-59-29-2516",
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
        $.getJSON( "https://raw.githubusercontent.com/morphkurt/skunkwork/master/videoclip/js/vision-trxs-20180142701.json", function( json ) {
                matchData=json;
                dropdownTeam = $('#team');
                dropdownPlayer = $('#player');
                dropdownPlay = $('#play');
                dropdownPeriod = $('#period');
		dropdownRanking = $('#ranking');

                dropdownTeam.empty();
                dropdownTeam.append('<option selected="true" disabled>Choose Team</option>');
                dropdownTeam.prop('selectedIndex', 0);

                dropdownPlayer.empty();
                dropdownPlayer.append('<option selected="true" disabled>Choose Player (Optional)</option>');
                dropdownPlayer.prop('selectedIndex', 0);
 		
		dropdownRanking.empty();
                dropdownRanking.append('<option selected="true" disabled>Choose Order (Optional)</option>');
                dropdownRanking.append($('<option></option>').attr('value', 'time').text('time'));
                dropdownRanking.append($('<option></option>').attr('value', 'asc').text('asc'));
                dropdownRanking.append($('<option></option>').attr('value', 'desc').text('desc'));
                dropdownRanking.append($('<option></option>').attr('value', 'top').text('top'));
                dropdownRanking.append($('<option></option>').attr('value', 'top5').text('top5'));
                dropdownRanking.prop('selectedIndex', 0);



                dropdownPlay.empty();
                dropdownPlay.append('<option selected="true" disabled>Choose Play</option>');
                dropdownPlay.append($('<option></option>').attr('value', 'goal').text('Goal'));
                dropdownPlay.append($('<option></option>').attr('value', 'kick').text('Kick'));
                dropdownPlay.append($('<option></option>').attr('value', 'mark').text('Mark'));
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
   $('#ranking').change(function (){
        ranking=$(this).val();
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
                            clips.push({"start": parseInt(obj.matchSeconds),"end":  parseInt(obj.matchSeconds)+cliplength, "ranking": parseInt(obj.ranking)});
                        }
                        else if(team == obj.squadId) {
                            if (player ==null) {
                                clips.push({"start": parseInt(obj.matchSeconds),"end":  parseInt(obj.matchSeconds)+cliplength,"ranking": parseInt(obj.ranking)});
                            }
                            else if (player == obj.playerId){
                                clips.push({"start": parseInt(obj.matchSeconds),"end":  parseInt(obj.matchSeconds)+cliplength,"ranking": parseInt(obj.ranking)});
                            }
                        }
                    }        
                }
        });
	console.log(clips);

	if (ranking =="asc"){
		clips.sort(asc);
	}
	if (ranking =="desc"){
		clips.sort(desc);
	}
	if (ranking =="top"){
		console.log("Top Content");
		clips.sort(desc);
		clips.splice(0,clips.length-1);
	}
	if (ranking =="top5"){
		clips.sort(desc);
		clips.splice(0,clips.length-5);
	}

	console.log(clips);
        if (clips.length > 0){
          $('#result').text("");  
          json.clips=clips;
          base64=btoa(JSON.stringify(json));
          var video2 = videojs("vid2");
          video2.src("https://whispering-waters-99783.herokuapp.com/skunkapi/"+base64+"/playlist.m3u8");
          video2.play();
        } else {
          $('#result').text("Selection Not Found");  
        }
           
   });
    loadData();
});

function asc(a,b) {
  return a.ranking - b.ranking;
}
function desc(a,b) {
  return b.ranking - a.ranking;
}


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
