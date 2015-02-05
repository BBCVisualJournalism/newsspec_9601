define(['lib/news_special/bootstrap'], function (news) {

    function Chart(el, colors, header) {
        /* REUSABLE ELEMENTS */
        this.el = el;
        this.colors = colors;
        this.header = header;
        this.headerLong = '';
    }

    Chart.prototype = {

        setData: function (data) {
            this.data = data;
            this.updateTotal();

            return this;
        },
        updateTotal: function () {
            this.total = 0;
            this.dataCount = 0;

            for (var country in this.data) {
                if (this.data.hasOwnProperty(country)) {
                    this.total += this.data[country].value;
                    this.dataCount++;
                }
            }
            return this.total;
        },
        draw: function () {
            this.addDimensionsToData();
            var markup = this.generateMarkUp(this.data);
            
            if(this.el.is(':empty')){
                this.el.html(markup);
            }else{
                var self = this;
                this.el.fadeOut(500, function () {
                    self.el.html(markup);
                    self.el.fadeIn(800);
                });
            }
            
            
            
            return this;
        },
        addDimensionsToData: function () {
            var chartHeight = 470,
                headerHeight = 20,
                barsAreaHeight = chartHeight - headerHeight,
                barMargin = 8,
                totalBarMargin = barMargin * this.dataCount,
                remainingBarHeight = barsAreaHeight - totalBarMargin,
                rollingOffset = 0; //Contains the offset of each bar

            for (var countryKey in this.data) {
                if (this.data.hasOwnProperty(countryKey)) {
                    var country = this.data[countryKey];

                    var barHeight = Math.round(country.value / this.total * remainingBarHeight);
                    var labelOffet = headerHeight + rollingOffset + (barHeight / 2);
                    var seperatorPosition = rollingOffset + (barHeight / 2);

                    country.barHeight = barHeight;
                    country.labelOffet = labelOffet;
                    country.seperatorPosition = seperatorPosition;

                    rollingOffset += barHeight + barMargin;

                }
            }

            return this.data;
        },
        generateMarkUp: function (data) {
            var labelsMarkup = '<ol class="chart--labels">';
            var barsMarkup = '<div class="chart-bars"><h4 class="chart--header">' + this.header + '</h4>';
            var count = 0;
            for (var countryKey in this.data) {
                if (this.data.hasOwnProperty(countryKey)) {
                    var country = this.data[countryKey];
                    var color = this.colors[count % this.colors.length];
                    var valueRounded = Math.round(country.value / 1000000);
                    /* Capitalise other */
                    var countryName = (country.name === 'other') ? 'Other' : country.name;

                    labelsMarkup += '<li style="top: ' + country.labelOffet + 'px;"><strong>' + countryName + '</strong> $' + valueRounded + 'm</li>';
                    barsMarkup += '<div class="chart-bar" style="height: ' + country.barHeight + 'px;background-color: ' + color + '"></div>';
                
                    count++;
                }
            }

            labelsMarkup += '</ol>';
            barsMarkup += '</div>';

            return labelsMarkup + barsMarkup;
        },
        setActive: function (countryName) {
            var elementPosition = 0;
            var selectedCountry = null;
            for (var countryKey in this.data) {
                if (this.data.hasOwnProperty(countryKey)) {
                    if (this.data[countryKey].name === countryName) {
                        selectedCountry = this.data[countryKey];
                        break;
                    } else {
                        elementPosition++;
                    }
                }
            }

            var labels = this.el.find('.chart--labels li'),
                bars = this.el.find('.chart-bar');

            labels.removeClass('chart--label__active');
            bars.removeClass('chart--bar__active');

            $(labels[elementPosition]).addClass('chart--label__active');
            $(bars[elementPosition]).addClass('chart--bar__active');

            return selectedCountry;
        }
    };

    return Chart;
});