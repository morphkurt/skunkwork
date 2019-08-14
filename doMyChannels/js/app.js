function getSignature(secret, api_key,http_method, request_path, expires, request_body){
	var method = method || 'GET';
	console.log(method);
	var string_to_sign = secret + http_method + request_path + 'api_key='+api_key+ 'expires='+expires+request_body;
	console.log("before sign:"+string_to_sign)
	var shaObj = new jsSHA("SHA-256", "TEXT");
	shaObj.update(string_to_sign);
	var hash = shaObj.getHash("B64");
    var signature = encodeURIComponent(hash.substr(0,43).replace(/=*$/,''));
    console.log("after sign:"+signature);
    return signature;	
}

var memberContainer = new Vue({ 
    el: '#member-table-body',
    props: {
        members: {
            type: Array
        }
    },
    data: {
	
    },
    methods: {
	query: function(embed_code,api_key,secret){
		var expires = Math.floor(Date.now() / 1000) +300;
		axios.get("https://api.ooyala.com/v2/assets/"+embed_code+"/metadata?api_key="+api_key+"&expires="+expires+"&signature="+getSignature(secret,api_key,"GET",
        		"/v2/assets/"+embed_code+'/metadata',expires,'')).then(({data}) =>{
			var metadata = data.concurrentMatchID;
			var metaDataArray = metadata.split(',');
			var m = []
			metaDataArray.forEach( function (match){
				m.push({"matchId":match,"enable":true,"edit":false})
				console.log(match)
			});
			this.members=m;

		});
		/*
		axios.get("js/test.json").then(({data}) =>{
			var metadata = data.concurrentMatchID;
			console.log(metadata);
			var metaDataArray = metadata.split(',');
			console.log(metaDataArray)
			var m = []
			metaDataArray.forEach( function (match){
				m.push({"matchId":match,"enable":true,"edit":false})
				console.log(match)
			//	this.members.push({ "matchId": match,"enable": true, "edit": false})
			});
			this.members=m;
		}); 
		*/
        },
        update: function (obj) {
            axios.get(`js/matchID.json`).then(({ data }) => {
                this.members =data.resources;   
            });
        },
	add: function (obj) {
                this.members.push({"matchId":'',"enable":true,"edit":true})
        },
	submit: function(embed_code,api_key,secret) {
		var expires = Math.floor(Date.now() / 1000) +300;
		matchIdCsv = '';
		var index = 0;
		this.members.forEach(function (match){
			if (match.enable){
				if (index>0) {
					matchIdCsv += ','+match.matchId
				}
				else {
					matchIdCsv += match.matchId
				}
			index++;
			}
		});
		var jsonBody = JSON.stringify({"concurrentMatchID":matchIdCsv})
		
		console.log(jsonBody);
        	axios.patch("https://api.ooyala.com/v2/assets/"+embed_code+"/metadata?api_key="+api_key+"&expires="+expires+"&signature="+getSignature(secret,api_key,"PATCH",
        		"/v2/assets/"+embed_code+'/metadata',expires,jsonBody),jsonBody).then(({data}) =>{
			var metadata = data.concurrentMatchID;
			var metaDataArray = metadata.split(',');
			var m = []
			metaDataArray.forEach( function (match){
				m.push({"matchId":match,"enable":true,"edit":false})
				console.log(match)
			});
			this.members=m;

		});


	}
	
    }
});

var control_buttons = new Vue({ 
    el: '#control-button',
    methods: {
	submit: function () {
	 var apiKey =  document.getElementById("apiKey").value
            var secret = document.getElementById("secret").value
            var embed_code = document.getElementById("embed_code").value
	    memberContainer.submit(embed_code,apiKey,secret)

	},
        cancel: function () {
	    this.query()

        },
	add: function () {
	    memberContainer.add()
        },
	query: function() {
	    var apiKey =  document.getElementById("apiKey").value
            var secret = document.getElementById("secret").value
            var embed_code = document.getElementById("embed_code").value
	    memberContainer.query(embed_code,apiKey,secret)
	}

    }
});

