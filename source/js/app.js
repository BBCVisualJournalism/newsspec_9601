define(['lib/news_special/bootstrap', 'data/data', 'chart', 'lib/vendors/bind-polyfill'], function (news, data, Chart) {

    function App() {
        /* REUSABLE PROPERTIES */
        this.el = $('.country-export');
        this.exportersEl = this.el.find('.country--input');
        this.chartLabelEl = this.el.find('.chart--header__long');
        this.exporterChartEl = this.el.find('.chart__exporters');
        this.importerChartEl = this.el.find('.chart__importers');
        this.seperatorLineEl = this.el.find('.charts--seperator .exports-line');

        this.exporterChart = new Chart(this.exporterChartEl, ['#cce5e5'], 'Exporters');
        this.importerChart = new Chart(this.importerChartEl, ['#c3d699', '#95ba4d', '#689c00'], 'Importers');


        /* INIT */
        news.sendMessageToremoveLoadingImage();
        var orderedExporters = this.getOrderedExporters();
        this.populateExportersList(orderedExporters);
        this.exporterChart.setData(orderedExporters).draw();
        this.updateCharts();

        /* LISTENERS */
        this.exportersEl.on('change', this.updateCharts.bind(this));

        this.exporterBars = this.exporterChartEl.find('.chart-bar');
        this.exporterLabels = this.exporterChartEl.find('.chart--labels li');

        this.exporterBars.on('mouseover', this.exportItemHover.bind(this));
        this.exporterBars.on('mouseout', this.exportItemMouseout.bind(this));
        this.exporterBars.on('click', this.exportItemClick.bind(this));

        this.exporterLabels.on('mouseover', this.exportItemHover.bind(this));
        this.exporterLabels.on('mouseout', this.exportItemMouseout.bind(this));
        this.exporterLabels.on('click', this.exportItemClick.bind(this));
        
    }

    App.prototype = {

        getOrderedExporters: function () {
            var orderedExporters = [];
            for (var countryName in data) {
                if (data.hasOwnProperty(countryName) && countryName !== 'other' && countryName !== 'total') {
                    orderedExporters.push({name: countryName, value: parseInt(data[countryName].total, 10)});
                }
            }
            orderedExporters.sort(function (a, b) {
                return a.total - b.total;
            });

            return orderedExporters;
        },
        getOrderedImportersFrom: function (countryName) {
            var countryImporters = data[countryName];

            var orderedImporters = [];
            for (var countryName in countryImporters) {
                if (countryImporters.hasOwnProperty(countryName) && countryName !== 'total') {
                    orderedImporters.push({name: countryName, value: parseInt(countryImporters[countryName], 10)});
                }
            }
            orderedImporters.sort(function (a, b) {
                if(a.name === 'other') {
                    return 1;
                }
                if (b.name === 'other') {
                    return -1;
                }

                return b.value - a.value;
            });

            return orderedImporters;
        },
        populateExportersList: function (orderedExporters) {
            var self = this;

            this.exportersEl.empty();
            $.each(orderedExporters, function (count, exporter) {
                self.exportersEl.append('<option>' + exporter.name + '</option>');
            });
        },
        updateCharts: function () {
            this.el.find('.fast-transition').removeClass('fast-transition');

            var exporterVal = this.exportersEl.val();
            var country = this.exporterChart.setActive(exporterVal);
            this.seperatorLineEl.css('top', country.seperatorPosition + 'px');
            var orderedImoporters = this.getOrderedImportersFrom(country.name);
            this.importerChart.setData(orderedImoporters).draw();

            this.chartLabelEl.html('Importers from ' + country.name);
        },
        getTargetPosition: function (target) {
            for (var itemPosition = 0; itemPosition < this.exporterBars.length; itemPosition++) {
                if(target === this.exporterBars[itemPosition] || target === this.exporterLabels[itemPosition]) {
                    break;
                } 
            }

            return itemPosition;
        },
        exportItemHover: function (e) {
            var itemPosition = this.getTargetPosition(e.currentTarget);

            $(this.exporterBars[itemPosition]).addClass('hover-state fast-transition');
            $(this.exporterLabels[itemPosition]).addClass('hover-state fast-transition');
        },
        exportItemMouseout: function () {
            this.el.find('.hover-state').removeClass('hover-state');
            
        },
        exportItemClick: function (e) {
            var itemPosition = this.getTargetPosition(e.currentTarget);
            var orderedExporters = this.getOrderedExporters();

            var clickedCountry = orderedExporters[itemPosition];
            this.exportersEl.val(clickedCountry.name);
            this.exportersEl.trigger("change");

        }

    };

    new App();
});