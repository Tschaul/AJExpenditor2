var _class;

import * as React from "react";
import { observer } from "mobx-react";

import { Grid, Row, Col, Table, FormGroup, Checkbox, ControlLabel } from "react-bootstrap";
import { TimeSeries, TimeRange } from "pondjs";
import { Charts, ChartContainer, ChartRow, YAxis, AreaChart, styler, Resizable, Brush, TimeMarker } from "react-timeseries-charts";

const customColorsList = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

export let ChartView = observer(_class = class ChartView extends React.Component {

    constructor(props) {
        super(props);
        this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
        this.handleDateChanged = this.handleDateChanged.bind(this);
    }

    handleTimeRangeChange(newRange) {
        this.props.vm.selectedRange = newRange;
    }

    handleDateChanged(newDate) {
        this.props.vm.selectedDate = newDate;
    }

    render() {
        if (!this.props.vm.timeseries) {
            return React.createElement(
                "div",
                null,
                "Loading..."
            );
        }

        const stylerForArea = styler(this.props.vm.categories.map((c, i) => ({
            key: c.name,
            color: customColorsList[i]
        })));

        console.log(stylerForArea);

        const stlyerForSelector = styler([{ key: "_total", color: "#777" }]);

        const rangeToShow = this.props.vm.selectedRange || this.props.vm.timeseries.range();

        return React.createElement(
            Grid,
            { fluid: true },
            React.createElement(
                Row,
                null,
                React.createElement(
                    Col,
                    { lg: 9, sm: 12 },
                    React.createElement(
                        Resizable,
                        null,
                        React.createElement(
                            ChartContainer,
                            {
                                timeRange: rangeToShow,
                                trackerPosition: this.props.vm.selectedDate,
                                onTrackerChanged: this.handleDateChanged
                            },
                            React.createElement(
                                ChartRow,
                                { height: "350" },
                                React.createElement(YAxis, {
                                    id: "y",
                                    min: 0,
                                    max: 1000,
                                    width: "60",
                                    type: "linear" }),
                                React.createElement(
                                    Charts,
                                    null,
                                    React.createElement(AreaChart, {
                                        axis: "y",
                                        style: stylerForArea,
                                        series: this.props.vm.timeseries,
                                        columns: { up: this.props.vm.selectedCategories.slice().sort() }
                                        //fillOpacity={0.4}
                                        , interpolation: "curveStepAfter" })
                                )
                            )
                        )
                    ),
                    React.createElement(
                        Resizable,
                        null,
                        React.createElement(
                            ChartContainer,
                            { timeRange: this.props.vm.timeseries.range() },
                            React.createElement(
                                ChartRow,
                                { height: "150" },
                                React.createElement(YAxis, {
                                    id: "y",
                                    min: 0,
                                    max: 5000,
                                    width: "60",
                                    type: "linear" }),
                                React.createElement(
                                    Charts,
                                    null,
                                    React.createElement(Brush, {
                                        timeRange: this.props.vm.selectedRange,
                                        allowSelectionClear: true,
                                        onTimeRangeChanged: this.handleTimeRangeChange
                                    }),
                                    React.createElement(AreaChart, {
                                        axis: "y",
                                        style: stlyerForSelector,
                                        series: this.props.vm.timeseries,
                                        columns: { up: ['_total'] }
                                        //fillOpacity={0.4}
                                        , interpolation: "curveStepBefore" })
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    Col,
                    { lg: 3, sm: 12 },
                    React.createElement(
                        FormGroup,
                        null,
                        React.createElement(
                            ControlLabel,
                            null,
                            "Ausgaben anzeigen von "
                        ),
                        ' ',
                        React.createElement(
                            Checkbox,
                            { inline: true },
                            "Andi"
                        ),
                        ' ',
                        React.createElement(
                            Checkbox,
                            { inline: true },
                            "Julian"
                        )
                    ),
                    React.createElement(
                        Table,
                        { responsive: true },
                        React.createElement(
                            "thead",
                            null,
                            React.createElement(
                                "tr",
                                null,
                                React.createElement(
                                    "th",
                                    null,
                                    "#"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "Name"
                                ),
                                React.createElement(
                                    "th",
                                    null,
                                    "Wert"
                                )
                            )
                        ),
                        React.createElement(
                            "tbody",
                            null,
                            this.props.vm.categories.map(category => {
                                const color = stylerForArea.columnStyles[category.name].color;
                                const checked = this.props.vm.selectedCategories.find(x => x === category.name);
                                return React.createElement(
                                    "tr",
                                    { key: category.name },
                                    React.createElement(
                                        "td",
                                        { style: { backgroundColor: color } },
                                        React.createElement(Checkbox, {
                                            inline: true,
                                            checked: checked,
                                            onChange: () => this.props.vm.toggleCategory(category.name)
                                        })
                                    ),
                                    React.createElement(
                                        "td",
                                        null,
                                        category.fullName
                                    ),
                                    React.createElement(
                                        "td",
                                        { style: { textAlign: "right" } },
                                        this.props.vm.selectedDateValues[category.name]
                                    )
                                );
                            })
                        )
                    )
                )
            )
        );
    }
}) || _class;