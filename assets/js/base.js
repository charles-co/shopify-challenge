Vue.component('movie-card', {
    delimiters: ['[[', ']]'],
    props: ["id", 
            "title", 
            "year",  
            "type", 
            "poster",
            "index",
        ],
    data: function(){
        return {
            showdetail: false,
            moviedetail: {}
        }            
    },
    watch: {
    },
    computed: {
        nominated: function(){
            if ((_.filter(this.$parent.$parent.nominations, ({imdbID}) => imdbID === this.id)).length > 0){
                return true
            }
            return false    
        },
    },
    filters: {
        title: function(value){
            if (!value) return ''
            value = _.startCase(value)
            return value
        },
    },
    updated(){
        if(this.showdetail){
            setTimeout( function(){
                let w = window.innerHeight
                let no = document.getElementById("detail")
                no.style.height = w + 'px'
            }, 1000)
            
        }
    },
    mounted() {
    },
    methods: {
        cardclick(e){
            cards = document.getElementsByClassName('animated-card')
            this.$parent.$parent.animate_cards(cards, false)
            this.detail()
            wrapper = document.getElementById('result-wrapper')
            cardcount = cards.length
            var card = e.target.parentNode.parentNode
            var col = parseInt((wrapper.offsetWidth/card.offsetWidth).toFixed(1))
            var row = parseInt((cardcount/col).toFixed(1))
            var index = card.parentNode.dataset.index
            anime({
                targets: '.animated-card',
                autoplay: true,
                opacity: [
                    {value: .5, easing: "easeOutSine", duration: 600},
                ],
                filter: [
                    {value: "blur(5px) grayscale(100%)", easing: "easeOutSine", duration: 700},
                ],
                borderRadius: [
                    {value: "50%", easing: "easeOutSine", duration: 700},
                ],
                scale: [
                    {value: .5, easing: "easeOutSine", duration: 600},
                ],
                delay: anime.stagger(200, { grid: [row, col], from: index}),
                complete: function() {
                }
            })
            setTimeout( function(){
                this.showdetail = true
            }.bind(this), 900)
        },
        closecardclick(index){
            this.showdetail = false;
            wrapper = document.getElementById('result-wrapper')
            var cards = document.getElementsByClassName('animated-card')
            card = cards[index]
            cardcount = cards.length
            var col = parseInt((wrapper.offsetWidth/card.offsetWidth).toFixed(1))
            var row = parseInt((cardcount/col).toFixed(1))
            var index = index
            anime({
                targets: '.animated-card',
                autoplay: true,
                opacity: [
                    {value: 1, easing: "easeInOutQuad", duration: 600},
                ],
                filter: [
                    {value: "blur(0px) grayscale(0%)", easing: "easeInOutQuad", duration: 700},
                ],
                borderRadius: [
                    {value: "0%", easing: "easeInOutQuad", duration: 700},
                ],
                scale: [
                    {value: 1, easing: "easeInOutQuad", duration: 600},
                ],
                delay: anime.stagger(200, { grid: [row, col], from: index}),
                complete: function() {
                }
            })
            setTimeout(function(){
                this.$parent.$parent.animate_cards(cards, true)
            }.bind(this), 700)
        },
        detail(){
            let url = "https://www.omdbapi.com/"
            let movie = this.id
            var endpoint = url + "?i=" + movie + "&apikey=1e8b7f0c"
            fetch(endpoint)
            .then(res => res.ok && res.json() || Promise.reject(res))
            .then(result => {
                if (result.Poster === "N/A"){
                    result.Poster = "assets/image/no-image.png"
                }
                this.moviedetail = _.pick(result, ['Title', 'Year', 
                                                    'Rated', 'Released', 
                                                    'Runtime', 'Genre', 
                                                    'Director', 'Writer', 
                                                    'Actors', 'Plot', 
                                                    'Language', 'Country',
                                                    'Type', 'DVD',
                                                    'Boxoffice', 'Production', 'Website'])
            })
        },
    }, 
    template: `                        
                <div id="" class="mb-2 col-6 card-wrapper col-md-3 col-lg-2 overflow-hidden">
                    <div class="d-flex px-1 h-100 flex-column animated-card pulse card search-result bg-transparent"> 
                        <div data-aos="zoom-in" style="will-change:transform;cursor:pointer;" class="flex-grow-1 border-0 bg-transparent d-flex flex-column justify-content-start align-items-center lazy-container">
                            <img @click="cardclick($event)" style="will-change:transform;" :data-src="poster" class="card-img-top bg-light img-fluid lazy-image rounded-0">
                            <div class="lds-ellipsis my-5 text-dark spinner">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                        <div class="card-body p-0 d-flex flex-column justify-content-between rounded-bottom flex-grow-0" style="will-change:transform;min-height: 140px;max-height: 140px;background:crimson;">
                            <p class="card-title text-white m-2 fancy-font" style="font-size:10px;will-change:transform;">  
                                <i class="fas fa-book text-warning"></i>:&nbsp;&nbsp;[[ title ]]
                                <br><i class="fas fa-calendar-alt text-warning"></i>:&nbsp;&nbsp;[[ year ]]<br>
                                <i class="fas fa-cogs text-warning"></i>:&nbsp;&nbsp;[[ type|title ]] 
                            </p>
                            <div class="bg-dark">
                                <transition mode="out-in" leave-active-class="animate__animated animate__fadeOutRight" enter-active-class="animate__animated animate__fadeInLeft">
                                    <button type="button" key="notnominated" v-if="!nominated" style="will-change:transform;"  @click="$emit('addnomination', id)" class="btn btn-block remove-outline position-relative nominate-button"><span><i class="fas fa-vote-yea"></i></span></button>
                                    <button type="button" key="nominated" style="will-change:transform;" v-else @click="$emit('removenomination', id)" class="btn btn-block remove-outline bg-warning position-relative nominate-button"><span><i class="fas fa-thumbs-down"></i></span></button>
                                </transition>
                            </div>
                        </div>
                    </div>
                    <transition enter-active-class="animate__animated animate__fadeInBottomLeft" leave-active-class="animate__animated animate__fadeOutBottomLeft">
                        <div v-if="showdetail" id="detail" class="fixed-top vw-100 overflow-hidden" style="background:#B66C8D">
                            <div class="d-flex h-100 flex-column p-3">
                                <div class="w-100 flex-grow-0 mb-2 mb-md-5">
                                    <button @click="closecardclick(index)" type="button" class="btn btn-danger grow float-right"><i class="fas fa-times"></i></button>
                                </div>
                                <div class="row no-gutters p-2 p-md-3 shadow flex-grow-1 overflow-hidden justify-content-md-around align-content-md-center align-content-between justify-content-start">
                                    <div class="col-6 col-md-4">
                                        <img :src="poster" class="img-thumbnail bg-bg-transparent img-fluid animate__animated animate__fadeInUp animate__delay-2s mb-2" alt="...">
                                    </div>
                                    <div class="col-md-7 movie-details h-100 col-12">
                                        <ul class="list-group mh-100 list-unstyled animate__animated rounded p-2 overflow-auto p-md-3 animate__fadeIn animate__delay-1s" style="color: #212529;background:#35dad2;">
                                            <li v-for="(value, name) in moviedetail">
                                                <p><span class="font-weight-bold">[[ name ]] :</span> [[ value ]]</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            `
})
const movieapp = new Vue({
    el: '#mainwrapper',
    delimiters: ['[[', ']]'],
    data() {
        return {
            busy: false,
            loading: false,
            empty: false,
            query: "",
            page: 1,
            movies: [],
            nominations: [],
            nominationlimit: false,
            shownomination: false,
            shownav: false,
            searching: false,
            alert: {
                show: false,
                msg: ""
            },
        }
    },
    created(){
        this.loading = true
        AOS.init();
    },
    updated(){
        AOS.refreshHard();
        this.animate_loading()
    },
    watch: {
        query: function(newSearch, oldSearch){
            if (newSearch !== oldSearch && newSearch !== ""){
                this.search();
            }
        },
        nominations: function(recent, old){
            localStorage.setItem("nominations", JSON.stringify(recent));
        }
    },
    filters: {
    },
    computed: {
    },
    mounted(){
        this.nominations = JSON.parse(localStorage.getItem("nominations")) || []
        document.addEventListener("scroll", this.animate_scroll)
        setTimeout( function(){
            this.loading = false;
            let w = window.innerHeight
            let no = document.getElementById('nominations')
            no.style.height = w + 'px'
        }.bind(this), 2000)
    },
    methods: {
        gateway(){
            this.search.cancel;
        },
        search: _.debounce(function(){
                console.log("runs")
                this.searching = true
                this.movies = []
                let url = "https://www.omdbapi.com/"
                let movie = this.query
                this.empty = false
                var endpoint = url + "?s=" + movie + "&apikey=1e8b7f0c"
                fetch(endpoint)
                .then(res => res.ok && res.json() || Promise.reject(res))
                .then(result => {
                    if(result["Error"] === undefined){
                        setTimeout( function(){
            
                            console.log(result)
                            this.animate_count(result.totalResults)
                            this.searching = false
                            this.movies = this.noimage(result.Search)
                            this.searchfocus(false)
                            this.loadMore()
                            window.addEventListener("scroll", this.lazyLoad);
                        }.bind(this), 2000)
                    } else{
                        this.searching = false
                        this.alert.show=true
                        this.alert.msg = result["Error"]
                        setTimeout( function(){
                            this.alert.show = false
                            this.alert.msg = ""
                        }.bind(this), 3000)
                    }
                })
        }, 2000),
        noimage(movies){
            _.forEach(movies, function(value){
                if (value.Poster === "N/A"){
                    value.Poster = "assets/image/no-image.png"
                }
            })
            return movies
        },
        loadMore(){
            if (this.query !== "" && !this.empty){
                this.busy = true;
                this.animate_loading()
                this.page = this.page + 1
                let url = "https://www.omdbapi.com/"
                let movie = this.query
                var endpoint = url + "?s=" + movie + "&apikey=1e8b7f0c&page=" + String(this.page)
                fetch(endpoint)
                .then(res => res.ok && res.json() || Promise.reject(res))
                .then(data => {
                    if(data.Error === undefined){
                        var result = data
                        setTimeout( function(){
                            this.busy = false
                            if(result.Search.length > 0) {
                                this.movies = this.movies.concat(this.noimage(result.Search))
                                window.addEventListener("scroll", this.lazyLoad);
                            }
                        }.bind(this), 2000)
                    } else{
                        this.busy = false
                        this.empty = true
                    }
                })
            }
        },
        animate_cards(cards, action){
            if(!action){
                _.forEach(cards, function(card){
                    card.classList.remove('pulse')
                });
            }
            else{
                _.forEach(cards, function(card){
                    card.classList.add('pulse')
                });
            }
        },
        animate_count(end){
            var elem = document.getElementsByClassName('badge')
            var totalResults = {
                count: "0",
                cycles: 120,
            }
            anime({
                targets: totalResults,
                count: end,
                cycles: 130,
                round: 1,
                easing: 'linear',
                update: function() {
                    elem[1].setAttribute('data-count', totalResults.count);
                }
            })
        },
        animate_loading(){
            anime({
                targets: '.loading',
                translateY: [{value: 10}, {value: 0}],
                autoplay: true,
                loop: true,
                duration: 600,
                delay: anime.stagger(150),
                easing: 'easeInSine'
            })
        },
        animate_scroll(){
            var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
            if(scrollTop >= 260){
                this.shownav = true
            }else if(scrollTop === 0){

            }
            else{
                this.shownav = false
            }
        },
        searchfocus(focus){
            var search = document.getElementById('InputSearch')
            if(focus){
                search.focus()
            }
            else{
                search.blur()
            }

        },
        scrolltotop(){
            anime({
                targets: [window.document.documentElement || window.document.body],
                scrollTop: 0,
                duration: 1000,
                easing: 'easeInOutQuad',
            })
            setTimeout(function(){
                this.shownav = false

                this.searchfocus(true)
            }.bind(this), 800)
        },
        lazyLoad(){
            let lazyImages = [].slice.call(document.querySelectorAll("div.lazy-container"));
            if (lazyImages.length > 0){
                let active = false;
                if (active === false){
                    active = true;
                    setTimeout( function() {
                        lazyImages.forEach(function(lazyImageTemp, index){
                            let lazyImage = lazyImageTemp.querySelector("img.lazy-image")
                            if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none"){
                                setTimeout( function(){
                                    try {
                                        lazyImageTemp.getElementsByClassName("spinner")[0].remove();
                                    }
                                    catch(err) {
                                    }
                                    lazyImage.src = lazyImage.dataset.src;
                                }, index * 100 + 1000)
                                lazyImageTemp.classList.remove("lazy-container");
                                lazyImages = lazyImages.filter(function (image){
                                    return image !== lazyImageTemp;
                                });
                                if (lazyImages.length == 0) {
                                    window.removeEventListener("scroll", this.lazyLoad);
                                }
                            }
                        });
                        active = false;
                    }.bind(this), 200);
                }
            }else {
                window.removeEventListener("scroll", this.lazyLoad);
            }
        },
        nominate(key){
            if(this.nominations.length >= 5) {
                this.alert.show=true
                this.alert.msg = "Maximum Nominations Reached"
                setTimeout( function(){
                    this.alert.show = false
                    this.alert.msg = ""
                }.bind(this), 3000)
                return;
            }
            this.nominations = this.nominations.concat(_.filter(this.movies, ({imdbID}) => imdbID === key))

        },
        revoke(key){
            if(key !== 'all'){
                this.nominations = _.filter(this.nominations, ({imdbID}) => imdbID !== key)
            }else{
                this.nominations = []
            }
        },
        sort(){

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function(el, done){
            var delay = el.dataset.index * 150
            setTimeout(function(){
                el.style.opacity = 1
                el.classList.add("animate__animated", "animate__fadeInUp")   
            }.bind(this), delay)
            el.addEventListener('animationend', ()=> {
                this.lazyLoad()
                el.classList.remove('animate__animated', 'animated__fadInUp');
            })
        },
        leave: function(el, done){
            var delay = el.dataset.index * 50
            var el = el
            setTimeout(function(){
                anime({
                    targets: el,
                    autoplay: true,
                    opacity: [
                        {value: .4, easing: "easeOutSine", duration: 600},
                    ],
                    filter: [
                        {value: "blur(5px) grayscale(100%)", easing: "easeOutSine", duration: 700},
                    ],
                    borderRadius: [
                        {value: "50%", easing: "easeOutSine", duration: 700},
                    ],
                    scale: [
                        {value: .3, easing: "easeOutSine", duration: 600},
                    ],
                    complete: function() {
                        el.classList.add("animate__animated", "animate__fadeOutUp")                
                    }
                })
            }.bind(this), delay)
            el.addEventListener('animationend', ()=> {
                el.remove();
                this.lazyLoad();
            })
        },
    },
});
