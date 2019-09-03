function sign(url,options){
	var ko = options.ko;
	var key = options.key;
	var kn = options.kn;
	var expiry = options.expiry;
        var url = url.replace('https://','');	
        var url = url.replace('http://','');	
	var rawurl;
	
	et = (new Date).getTime();
	et = Math.round(et/1000);	    
	et = et + Number(expiry) + expiry;
        if (url.indexOf('?') > -1)
        {
           rawurl = "://" + url + "&SIGV=2&IS=0&ET=" + et + "&CIP=" + '1.2.3.4' + "&KO=" + ko + "&KN=" + kn + "&US=";
        } else {
           rawurl = "://" + url + "?SIGV=2&IS=0&ET=" + et + "&CIP=" + '1.2.3.4' + "&KO=" + ko + "&KN=" + kn + "&US=";
        }
	var urlhash = CryptoJS.HmacSHA1(rawurl, key);
   	return 'https' + rawurl + urlhash;
}
