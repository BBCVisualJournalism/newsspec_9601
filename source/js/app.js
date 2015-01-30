define(['lib/news_special/bootstrap', 'data/data', 'chart', 'lib/vendors/bind-polyfill'], function (news, data, Chart) {

    function App() {
        /* REUSABLE PROPERTIES */
        this.el = $('.country-export');
        this.exportersEl = this.el.find('.country--input');
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
            var exporterVal = this.exportersEl.val();
            var country = this.exporterChart.setActive(exporterVal);
            this.seperatorLineEl.css('top', country.seperatorPosition + 'px');
            var orderedImoporters = this.getOrderedImportersFrom(country.name);
            this.importerChart.setData(orderedImoporters).draw();
        }

    };

    new App();
});