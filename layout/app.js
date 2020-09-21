var app = new Vue({
    el: '.app',
    data: {
        searchGame: "",        // v-model input filter: Naam van spel.
        response: [],                   // Array that returns after calling api.
        arrayResponse: '',              // Array with the results that show on page.
        platformSelect: 'all',          // Select input for platform.
        limitResults: 20,               // Limit the amount of results.
        zeroMessage: "Zet op '0' als je alle resultaten wilt zien!", // Message that shows when hovering over inputs.
        minimalRating: 0,               // Shows only games above this minimal.
        noResult: false,                // If the api returns nothing.
        numberOfResults: 0,             // Number of results returned by api.
        dateSelect: "geen",             // Select the date input (voor, na, tussen).
        dateInput: "",                  // First year input.
        dateInputBetween: "",           // If dateSelect is 'tussen' input for second year.
        sortSelect: 'none',
        gameSelect: false,
    },
    methods: {
        GameSearch: function(doHash) {      // Calls the api with the applied filters.
            this.noResult = false;          // Reset the no result variable.
            if (!doHash) {                  // Checks if filters are applied through URL or inputs.
                var rating = this.GetMinimalRating(this.minimalRating);     // Getting the values of the filters.
                var limit = this.GetLimit(this.limitResults);
                var date = this.GetDate(this.dateSelect, this.dateInput);
                var platform = this.GetPlatforms(this.platformSelect, this.platforms);
                if (this.searchGame != "") {
                    var search = "search \"" + this.searchGame + "\";";
                } else {var search = ""}

            } else {
                var search = this.GetHash('name');                          // Getting the values of the filters
                if (search != "") {                                         // when filters are applied trough URL.
                    search = "search \"" + search + "\";";
                } else {search = ""}
                var limit = this.GetHash('limit');
                var rating = this.GetHash('rating');
                var date = this.GetHash('date');
                var platform = this.GetHash('platform');
                if (platform == "all") {
                    platform = "";
                } else {
                    var platform = this.GetHash('platform');
                }
            }
            // Hash the URL to match inputs
            var newHash = "#name=" + this.searchGame + ";limit=" + this.limitResults + ";rating=" + this.minimalRating + ";date=" + this.dateSelect + ":" + this.dateInput + ":" + this.dateInputBetween +";platform=" + this.platformSelect + ";";
            history.replaceState(null, null, document.location.pathname + newHash);
            var where = this.MultipleWheres(rating, date, platform);        // Takes the filters and makes a 'where'-statement.

            axios({                                                         // Calls the api.
                url: "https://polar-temple-75375.herokuapp.com/https://api-v3.igdb.com/games",
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'user-key': 'vul-hier-je-eigen-key-in'
                },
                // Set data that the api returns
                data: "fields name,genres.name,summary,rating,popularity,platforms,game_engines.name,release_dates.human,release_dates.date,category,involved_companies.company.name,cover.url,screenshots.url,platforms.abbreviation;" +
                    search +
                    limit +
                    where
                })
                .then(response => {
                    this.response = response.data;          // Set response data to the response array.
                    console.log(response.data);
                    this.PutInArray;                        // Call PutInArray function.
                })
                .catch(err => {
                    console.error(err);
                });
        },
        GetHash: function(filter) {                                             // Returns filter values when they are applied trough URL.
            var urlHash = location.hash;                                        // Get the current URL.
            urlHash = urlHash.split(';');                                       // Split the URL in a array.
            urlHash[0] = urlHash[0].substring(1);                               // Remove the '#'.
            if(filter == "name") var name = urlHash[0].split('=');              // Get value of the filters from URL.
            if (filter == "limit") var limit = urlHash[1].split('=');
            if (filter == "rating") var rating = urlHash[2].split('=');
            if (filter == "date"){ var date = urlHash[3].split('=');
            var dateArray = date[1].split(':'); }
            if (filter == "platform") var platform = urlHash[4].split('=');
            switch (filter) {
                case 'name':
                    this.searchGame = name[1];
                    if (name[1] != "") {
                        return name[1];
                    } else {
                        return "";
                    }
                case 'limit':
                    this.limitResults = limit[1];
                    return this.GetLimit(this.limitResults);
                case 'rating':
                    this.minimalRating = rating[1];
                    return this.GetMinimalRating(this.minimalRating);
                case 'date':
                    this.dateSelect = dateArray[0];
                    this.dateInput = dateArray[1];
                    if (dateArray[2] != "") {
                        this.dateInputBetween = dateArray[2]
                    }
                    return this.GetDate(this.dateSelect, this.dateInput);
                case 'platform':
                    this.platformSelect = platform[1];
                    return this.GetPlatforms(this.platformSelect, this.platforms);
            }
        },
        GetPlatforms: function(pSelect, platform) {                     // Get the platform filters.
            if (pSelect != "all")
                var platform = "platforms = (" + pSelect + ");";
            else {
                var platform = '';
            }
            return platform;
        },
        GetMinimalRating: function(minimalRating) {                     // Get the minimal rating filter.
            if (minimalRating == 0) {
                return "";
            } else {
                return "rating >= " + minimalRating * 10;
            }
        },
        GetLimit: function (limit) {                                    // Get limit filter.
            if (limit == 0) {
                return limit = "limit 100;";
            } else {
                return limit = "limit " + limit + ";";
            }
        },
        GetDate: function(dateSelect, input) {                          // Get date filter.
            input = Math.round(new Date(input).getTime()/1000);
            if (dateSelect == "voor") {
                return "first_release_date <= " + input;
            } else if (dateSelect == "na") {
                return "first_release_date >= " + input;
            } else if (dateSelect == "tussen") {
                var input2 = Math.round(new Date(this.dateInputBetween).getTime()/1000);
                return "first_release_date >= " + input + " & first_release_date <= " + input2;
            } else {
                return "";
            }
        },
        MultipleWheres: function(rating, date, platform) {              // Check is there needs to be more than one where statement.
            var attributes = [];
            if (rating !== ""){
                attributes.push(rating);
            }
            if (date !== ""){
                attributes.push(date);
            }
            if (platform !== ""){
                attributes.push(platform);
            }
            if (attributes.length > 0)
            return "where " + attributes.join(" & ") + ";";
            else return "";
        },
        ShowGameSelect: function(itemName) {
            this.gameSelect = !this.gameSelect;
            this.GameSelect(itemName, this.gameSelect);
        },
        GameSelect: function(name, showHide) {
            if (showHide) {
                $(document).ready(function() {
                    document.getElementById(name).style.display = "block";
                });
            } else {
                $(document).ready(function() {
                    document.getElementById(name).style.display = "none";
                });
            }
        }
    },
    computed: {
        PutInArray: function() {                                            // Put the data that I need from response.data in an array.
            var response = this.response;
            this.numberOfResults = response.length;
            var array = [];
            var i = 0;
            if (response.length > 0) {
                do {
                    try {                                                   // Try to get the value of the filters.
                        var name = response[i].name;
                    } catch(err){var name = "Onbekend"};                    // If no value is found set to "Onbekend".
                    try {
                        var url = "https:" + response[i].cover.url;
                        var coverGameSelect = url.split("/");
                        coverGameSelect[6] = "t_cover_big";                             // Getting the bigger cover
                        coverGameSelect = coverGameSelect.join("/");
                    } catch(err){
                        try {
                            var url = response[i].screenshots[0].url;
                            var coverGameSelect = url;
                        } catch(err){
                            var url = "";
                            var coverGameSelect = "";
                        }
                    };
                    try {
                        var screenshotsLength = response[i].screenshots;
                        var screenshots = [];
                        for (var s = 0; s < screenshotsLength.length; s++) {
                            screenshots.push(response[i].screenshots[s].url);
                        }
                        var screenshotsGameSelect = screenshots[0].split("/");
                        screenshotsGameSelect[6] = "t_screenshot_big";
                        screenshotsGameSelect = screenshotsGameSelect.join("/");
                    } catch(err){var screenshots = ""; var screenshotsGameSelect = "";}
                    try {
                        var genre = "";
                        var genreLength = response[i].genres.length;
                        if (genreLength > 1) {
                            for (var g = 0; g < genreLength; g++) {
                                genre += response[i].genres[g].name;
                                if (g + 1 != genreLength){
                                genre += " - ";}
                            }
                        } else {
                            genre = response[i].genres[0].name;
                        }
                    } catch(err){var genre = "Onbekend"};
                    try {
                        var summary = response[i].summary;
                    } catch(err){var summary = "Geen beschrijving beschikbaar."};
                    try {
                        var date = response[i].release_dates[0].human;
                    } catch(err){var date = "Onbekend"};
                    try {
                        var company = response[i].involved_companies[0].company.name;
                    } catch(err){var company = "Onbekend"};
                    try {
                        var platform = "";
                        var length = response[i].platforms.length;
                        if (response[i].platforms.length > 1) {
                            for (var p = 0; p < length; p++) {
                                platform += response[i].platforms[p].abbreviation;
                                if (p + 1 != length){
                                    platform += " - ";}
                            }
                        } else {
                            platform = response[i].platforms[0].abbreviation;
                        }
                    } catch(err){var platform = "Onbekend"};
                    if(response[i].rating > 0) {
                        var rating = response[i].rating / 10;
                        rating = parseFloat(rating.toFixed(1));
                    } else {var rating = "Onbekend"};
                        array.push({                // Push all filter values to array.
                        name: name,
                        url: url,
                        genre: genre,
                        date: date,
                        company: company,
                        platform: platform,
                        rating: rating,
                        screenshots: screenshots,
                        summary: summary,
                        coverGameSelect: coverGameSelect,
                        screenshotsGameSelect: screenshotsGameSelect
                    });
                    i++;
                } while (i < response.length);
            } else {
                this.noResult = true;               // If theres no result set 'noResult' to true.
            }
            this.arrayResponse = array;
            if (this.sortSelect != ""){
            this.SortArray;}

            for (var i = 0; i < this.arrayResponse.length; i++) {
                if (this.arrayResponse[i].rating != "Onbekend")
                this.arrayResponse[i].rating += " / 10";
            }
        },
        SortArray: function() {
            if (this.sortSelect == "rating") {
                if (this.minimalRating > 0) {
                    var array = this.arrayResponse;
                    array.sort(function(a, b) {
                        return b.rating - a.rating;
                    });
                } else {
                    this.sortSelect = "none";
                    alert("Om te sorteren op rating moet u een minimale rating aangeven!");
                }
            }
            if (this.sortSelect == "date" && this.numberOfResults > 0) {
                var array = this.arrayResponse;
                array.sort(function(a, b) {
                    a = new Date(a.date);
                    b = new Date(b.date);
                    return a - b;
                });
            }
            if (this.sortSelect == "name") {
                this.arrayResponse.sort(function(a,b) {
                    var x = a.name.toLowerCase();
                    var y = b.name.toLowerCase();
                    if (x < y) {return -1};
                    if (x > y) {return 1};
                    return 0;
                });
            }
        },
    },
    created: function() {               // Calls GameSearch function when page is loaded.
        this.GameSearch();
    }
});
window.onhashchange = function() {      // Calls GameSearch function when URL is changed.
    app.GameSearch(true);
}