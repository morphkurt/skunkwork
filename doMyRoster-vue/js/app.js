var start_date = new Vue({
    el: '#start-date',
    props: {
        startDate: {
            type: Date
        }
    },
    components: {
        vuejsDatepicker
    }
})

var end_date = new Vue({
    el: '#end-date',
    props: {
        endDate: {
            type: Date
        }
    },
    components: {
        vuejsDatepicker
    }
})

var memberContainer = new Vue({ 
    el: '#member-table-body',
    props: {
        members: {
            type: Array
        }
    },
    data: {
    },
    created: function () {
       this.update()
    },
    methods: {
        update: function (obj) {
            axios.get(`js/resources.json`).then(({ data }) => {
                this.members =data.resources;   
            });
        }
    }
});

var control_buttons = new Vue({ 
    el: '#control-button',
    methods: {
        generate: function () {
            let obj = generateRoster(start_date.startDate,end_date.endDate,memberContainer.members);
            let roster = obj[0];
            let members = obj[1];
            console.log(start_date.startDate);
            memberContainer.members = members;
            rosterContainer.days = roster;
           // rosterContainer.update();
        },
        cancel: function () {
            rosterContainer.days =[];
            start_date.startDate = '';
            end_date.endDate= '';
            memberContainer.update();

        }
    }
});

var rosterContainer = new Vue({ 
    el: '#roster-table-body',
    props: {
        days: {
            type: Array
        }
    },
    data: {
        
    },
    created: function () {
    },
    methods: {
    }
});
