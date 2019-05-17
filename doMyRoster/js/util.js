function generateRoster(a,b,team){
	var roster = [];
	var days=1;
	for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
		if (m.isoWeekday() == 7 || m.isoWeekday() == 6  ){
			var dow = 'sat'
			if ( m.isoWeekday() == 7)
				dow = 'sun'
			var date = m.format('YYYY-MM-DD');
			var day = {'date' : date, 'dow': dow }

			team.forEach(function(member){
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
			team.sort(function(a,b){
				if(a.load < b.load) return -1;
				if(b.load > a.load) return 1;
				return 0;
			});
	         roster.push(day)
	         days++;
	     }
     }
     return [ roster, team]
	}

	function isBlocked(day,dayArray){
		dayArray.forEach(function (obj) {
			if (day.isSame(moment(obj))){
				return true
			}
		})
		return false
	}
