
var roster = [];
var team;

function loadData() {
	$.getJSON( "js/resources.json", function( json ) { 
		   team = json;
		   
           json.resources.forEach( function (member) {
           	var point = ( member.point ) ? 'checked' : '';
           	var visual = ( member.visual ) ? 'checked' : '';
           	var audio = ( member.audio ) ? 'checked' : '';
           	var sat = ( member.sat ) ? 'checked' : '';
           	var sun = ( member.sun ) ? 'checked' : '';
           	$('#member-table tr:last').after('<tr><td>'+member.name+'</td> <td> <label class="audio-checkbox"> <input type="checkbox" '+audio+'> </label> </td> <td> <label class="visual-checkbox"> <input type="checkbox"' + visual +'> </label> </td> <td> <label class="point-checkbox"> <input type="checkbox"'+point+'> </label> </td> <td> <label class="sat-checkbox"> <input type="checkbox"'+sat+'> </label> </td> <td> <label class="sun-checkbox"> <input type="checkbox" '+sun+'> </label> </td> <td>'+(member.maxLoad*100)+'%</td> </tr>');
           })
    
    });
}


$( document ).ready(function() {
	loadData()
	var start_picker = new Pikaday({ field: document.getElementById('startdatepicker') });
    var end_picker = new Pikaday({ field: document.getElementById('enddatepicker') });

    $('#generate').click(function (){

    	$('#roster-table > tbody').html("<tr>/</tr>");
    	generateRoster(start_picker.getMoment(),end_picker.getMoment());
    	roster.forEach( function (day){
    		var point = ( day.point) ? day.point : ''
    		$('#roster-table-body tr:last').after('<tr><td>'+day.date+'</td><td>'+day.audio+'</td><td>'+day.visual+'</td><td>'+point+'</td></tr>')
    	})
    })


})


function generateRoster(a,b){

	roster.length=0;
	

	// If you want an exclusive end date (half-open interval)
	var days=1;
	for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
	  if (m.isoWeekday() == 7 || m.isoWeekday() == 6  ){
		  var dow = 'sat'
		  if ( m.isoWeekday() == 7)
			dow = 'sun'
		  var date = m.format('YYYY-MM-DD');
		  var day = {'date' : date, 'dow': dow }
		 
		  team.resources.forEach(function(member){
			if (!member.load)
				member.load = 0;
			if (!member.ppdays)
				member.ppdays = 0;
			if (!member.blockout)
				member.blockout = []
			if (!member.startDate)
				member.startDate = a.format('YYYY-MM-DD');
			if(!member.days)
				member.days = 0;
			if(!member.avlDays && m.isAfter(moment(member.startDate)) ){
				member.avlDays = 1;
				member.dayAtStart = days;
			}

			var load = member.days  / days
			var ppload = member.ppdays / member.days
			if (!day.audio && member[dow] && member.audio && ( load < member.maxLoad ) && m.isAfter(moment(member.startDate)) && !isBlocked(m,member.blockout) ) {
				day.audio = member.name
				if ( dow=='sun' && member.pointNeeded)
					day.pointNeeded = true;
				
				member.days = member.days + 1
				if (member.depend)
					day.visual = member.depend
			}
			if (!day.visual && member[dow] && member.visual && day.audio != member.name && (load < member.maxLoad) && m.isAfter(moment(member.startDate)) && !isBlocked(m,member.blockout)  ) {
				day.visual = member.name
				member.days = member.days + 1
			}
			if (!day.point && ( dow == 'sun' ) && day.audio && day.pointNeeded && member.point && (ppload < 0.4) && ( load < member.maxLoad ) && m.isAfter(moment(member.startDate)) && (!isBlocked(m,member.blockout))  ) {
				day.point = member.name
				member.days = member.days + 1
				member.ppdays = member.ppdays + 1
			}
			if (m.isAfter(moment(member.startDate))) {
				member.avlDays = days;
				member.load = member.days / ( member.avlDays - member.dayAtStart)
			} 
		  })
		  
		  team.resources.sort(function(a,b){
		    if(a.load < b.load) return -1;
		    if(b.load > a.load) return 1;
		    return 0;
		  });
	 
		 //day.date = m.format('YYYY-MM-DD');
	         // day['dow'] = if ( m.isoWeekDay() == 6 ) 'sat' : 'sun'
	          roster.push(day)
		days++;
	   }
	}
}

function isBlocked(day,dayArray){
	dayArray.forEach(function (obj) {
		if (day.isSame(moment(obj))){
			
			return true
		}
	})
	return false
}
