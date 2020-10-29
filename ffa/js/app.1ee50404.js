(function(t){function e(e){for(var a,c,i=e[0],s=e[1],l=e[2],f=0,p=[];f<i.length;f++)c=i[f],Object.prototype.hasOwnProperty.call(o,c)&&o[c]&&p.push(o[c][0]),o[c]=0;for(a in s)Object.prototype.hasOwnProperty.call(s,a)&&(t[a]=s[a]);u&&u(e);while(p.length)p.shift()();return r.push.apply(r,l||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],a=!0,i=1;i<n.length;i++){var s=n[i];0!==o[s]&&(a=!1)}a&&(r.splice(e--,1),t=c(c.s=n[0]))}return t}var a={},o={app:0},r=[];function c(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=a,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)c.d(n,a,function(e){return t[e]}.bind(null,a));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/";var i=window["webpackJsonp"]=window["webpackJsonp"]||[],s=i.push.bind(i);i.push=e,i=i.slice();for(var l=0;l<i.length;l++)e(i[l]);var u=s;r.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},1:function(t,e){},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("2b0e"),o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("Main",{attrs:{msg:"Welcome to Your Vue.js App"}})],1)},r=[],c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container max-w-4xl my-10"},[n("div",{staticClass:"bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"},[n("h1",{staticClass:"text-xl text-center pb-3"},[t._v(t._s(t.title))]),n("div",{staticClass:"flex flex-row h-px-100"},[n("div",{staticClass:"w-4/5"},[n("video",{ref:"videoPlayer",staticClass:"video-js vjs-fluid"})]),n("div",{staticClass:"flex flex-no-wrap overflow-y-scroll flex-col w-1/5 shadow-md ml-3 border-gray-200 border-1"},t._l(t.keyEvents,(function(e,a){return n("div",{key:a,staticClass:"moment",on:{click:function(n){return t.skip(e.time)}}},[t._v(" "+t._s(e.name)+" ")])})),0)])])])},i=[],s=(n("99af"),n("4160"),n("b0c0"),n("d3b7"),n("ac1f"),n("1276"),n("159b"),n("96cf"),n("1da1")),l=n("f0e2"),u={name:"VideoPlayer",props:{videoOptions:{type:Object,default:function(){return{}}}},data:function(){return{bcData:{},keyEvents:[],title:null,matchId:null,matchData:{},player:null,options:{autoplay:!0,controls:!0},playerKey:"BCpkADawqM2QQRAICfpf23j4hDi7g-UlKZp6rNqo3jReJFEfkuhnjOfjJTUOryo27EoXjggPUBbgzBpPvNY7p-YM4Me1Sx3Khpn-FkMQqP5x66s_ULssIqU3V6C2s7odORMP7L_iAyuGwexk"}},mounted:function(){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function e(){var n,a,o,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=window.location.pathname,a=n.split("/"),e.next=4,t.getBC(a[a.length-1]);case 4:t.bcData=e.sent,t.title=t.bcData.name,t.matchId=t.bcData.custom_fields.matchid,t.getMatchData().then((function(e){t.matchData=e,t.extractMatchInfo()})),t.options.sources=t.bcData.sources,t.player=Object(l["a"])(t.$refs.videoPlayer,t.options,(function(){console.log("onPlayerReady",this)})),o=new l["a"].VideoTrack({src:"text.vtt",language:"en",kind:"commentary"}),t.player.videoTracks().addTrack(o),r=t.player.videoTracks(),r.addEventListener("change",(function(){for(var t=0;t<r.length;t++){var e=r[t];if(e.enabled)return void l["a"].log(e.label)}}));case 14:case"end":return e.stop()}}),e)})))()},beforeDestroy:function(){this.player&&this.player.dispose()},methods:{skip:function(t){this.player.currentTime(60*t-60)},extractMatchInfo:function(){var t=this;this.keyEvents.push({name:"Match Start",time:0}),this.keyEvents.push({name:"Second Half",time:this.matchData.match_info.first_half_time+3.35}),this.matchData.home_team.goals&&this.matchData.home_team.goals.forEach((function(e){t.keyEvents.push({name:"".concat(e.type," - ").concat("SecondHalf"==e.period?"2nd":"1st"," half - ").concat(e.min),time:"SecondHalf"==e.period?e.min+3.35:e.min})})),this.matchData.away_team.goals&&this.matchData.away_team.goals.forEach((function(e){t.keyEvents.push({name:"".concat(e.type," - ").concat("SecondHalf"==e.period?"2nd":"1st"," half - ").concat(e.min),time:"SecondHalf"==e.period?e.min+3.35:e.min})})),this.matchData.away_team.bookings&&this.matchData.away_team.bookings.forEach((function(e){t.keyEvents.push({name:"".concat(e.type," - ").concat("SecondHalf"==e.period?"2nd":"1st"," half - ").concat(e.min),time:"SecondHalf"==e.period?e.min+3.35:e.min})})),this.matchData.home_team.bookings&&this.matchData.home_team.bookings.forEach((function(e){t.keyEvents.push({name:"".concat(e.type," - ").concat("SecondHalf"==e.period?"2nd":"1st"," half - ").concat(e.min),time:"SecondHalf"==e.period?e.min+3.35:e.min})})),this.keyEvents.sort((function(t,e){return t.time-e.time}))},getMatchData:function(){var t=this;return new Promise((function(e,n){var a={method:"GET",redirect:"follow"};fetch("https://gateway.ffa.football/football/m".concat(t.matchId,"/details"),a).then((function(t){return t.json()})).then((function(t){return e(t)})).catch((function(t){return n(t)}))}))},getBC:function(t){return new Promise((function(e,n){var a=new Headers;a.append("Accept","application/json;pk=BCpkADawqM2QQRAICfpf23j4hDi7g-UlKZp6rNqo3jReJFEfkuhnjOfjJTUOryo27EoXjggPUBbgzBpPvNY7p-YM4Me1Sx3Khpn-FkMQqP5x66s_ULssIqU3V6C2s7odORMP7L_iAyuGwexk");var o={method:"GET",headers:a,redirect:"follow"};fetch("https://edge.api.brightcove.com/playback/v1/accounts/6058022062001/videos/".concat(t),o).then((function(t){return t.json()})).then((function(t){return e(t)})).catch((function(t){return n(t)}))}))}}},f=u,p=(n("9851"),n("2877")),d=Object(p["a"])(f,c,i,!1,null,"4186d143",null),h=d.exports,m={name:"App",components:{Main:h}},v=m,y=Object(p["a"])(v,o,r,!1,null,null,null),b=y.exports;n("def6"),n("fda2");a["a"].config.productionTip=!1,new a["a"]({render:function(t){return t(b)}}).$mount("#app")},7805:function(t,e,n){},9851:function(t,e,n){"use strict";n("7805")},def6:function(t,e,n){}});
//# sourceMappingURL=app.1ee50404.js.map