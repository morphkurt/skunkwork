
var root = new Vue({
    el: "#root",
    data: {
        seasons: null,
        config: {},
        dragging: false,
        src: "",
        selectedVideo: {},
        showModal: true,
        seasonEpisodes: []
    },
    mounted: function () {
        let authToken = localStorage.getItem('authToken');
        if (authToken) {
            this.getConfig(authToken)
            var modal = document.getElementById("loginModal")
            modal.classList.remove("is-active");
        }
    },
    computed: {

    },
    methods: {
        setIdToken(authToken) {
            localStorage.setItem('authToken', authToken);
            this.getConfig(authToken)
            var modal = document.getElementById("loginModal")
            modal.classList.remove("is-active");
        },
        play: function () {
            let src = this.src.src
            let url = this.config.roku_url
            var myHeaders = new Headers();
            let authToken = localStorage.getItem('authToken');
            myHeaders.append("Authorization", "Bearer " + authToken);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            let manifestUrl = encodeURIComponent(encodeURIComponent(src))
            fetch(url + manifestUrl, requestOptions);
        },
        close: function () {
            this.showModal = false
            var modal = document.getElementById("playModal")
            modal.classList.remove("is-active");
        },
        onClick: function (event) {
            this.getBrightcoveUrl(event.mid)
            this.showModal = true;
            var modal = document.getElementById("playModal")
            modal.classList.add("is-active");
        },
        getConfig: function (authToken) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + authToken);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch("https://6qfv11f2lk.execute-api.ap-southeast-2.amazonaws.com/default/HelloJWT", requestOptions)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error('Something went wrong');
                    }
                }).then(response => {
                    this.config = response
                    this.getEpisodes();
                })
                .catch(error => {
                    var modal = document.getElementById("loginModal")
                    modal.classList.add("is-active");
                }
                );
        },
        getBrightcoveUrl: async function (videoId) {
            fetch("https://edge.api.brightcove.com/playback/v1/accounts/" + this.config.bc_account_id + "/videos/" + videoId, {
                "headers": {
                    "Accept": "application/json;pk=" + this.config.pk,
                    "Accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                },
                "method": "GET"
            }).then(response => response.text())
                .then(result => {
                    this.selectedVideo = JSON.parse(result)
                    source = JSON.parse(result).sources.filter((w) => {
                        return (w.type == "application/x-mpegURL" && w.src.startsWith("https"))
                    })[0]
                    var options = {};
                    var player = videojs('my-player');
                    let src = source.src.replace('http://', 'https://') + "&secure=true"
                    this.src = source
                    let type = source.type
                    player.src({
                        src,
                        type
                    })
                })
                .catch(error => {
                    console.log('error', error)
                }
                );

        },
        getEpisodes: function () {
            var myHeaders = new Headers();
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            fetch(this.config.episodeUri, requestOptions)
                .then(response => response.text())
                .then(result => {
                    this.seasons = JSON.parse(result);
                })
                .catch(error => console.log('error', error));
        }
    }
})

function objSlice(obj, lastExclusive) {
    var filteredKeys = Object.keys(obj).slice(0, lastExclusive);
    var newObj = {};
    filteredKeys.forEach(function (key) {
        newObj[key] = obj[key];
    });
    return newObj;
}
