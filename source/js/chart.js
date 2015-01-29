define(['lib/news_special/bootstrap'], function (news) {

    function Chart(el, colors) {
        /* REUSABLE ELEMENTS */
        this.el = el;
        this.colors = colors;
    }

    Chart.prototype = {

        setData: function (data) {
            this.data = data;

            return this;
        },
        draw: function () {

            return this;
        },
        setActive: function () {


        }
    };

    return Chart;
});