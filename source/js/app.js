define(['lib/news_special/bootstrap', 'data/data', 'chart'], function (news, data, Chart) {

    function App() {
        /* REUSABLE PROPERTIES */
        this.el = $('.country-export')
        this.exportersEl = this.el.find('.country--input');
        this.exporterChartEl = this.el.find('.chart__exporters');
        this.importerChartEl = this.el.find('.chart__importers');

        this.exporterChart = new Chart(this.exporterChartEl, ['#cce5e5']);
        this.importerChart = new Chart(this.importerChartEl, ['#c3d699', '#95ba4d', '#689c00']);


        /* INIT */
        news.sendMessageToremoveLoadingImage();
        var orderedExporters = this.getOrderedExporters();
        this.populateExportersList(orderedExporters);
    }

    App.prototype = {

        getOrderedExporters: function () {
            var orderedExporters = [];
            for (var countryName in data) {
                if (data.hasOwnProperty(countryName) && countryName !== 'other' && countryName !== 'total') {
                    orderedExporters.push({name: countryName, value: data[countryName]});
                }
            }
            orderedExporters.sort(function (a, b) {
                return a.total - b.total;
            });

            return orderedExporters;
        },
        populateExportersList: function (orderedExporters) {
            var self = this;

            this.exportersEl.empty();
            $.each(orderedExporters, function (count, exporter) {
                self.exportersEl.append('<option>' + exporter.name + '</option>');
            })
        },
        updateCharts: function () {


        }
        
    };

    new App();
});