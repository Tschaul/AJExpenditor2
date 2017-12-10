import * as React from "react";
import { observer } from "mobx-react"

import { Grid, Row, Col, Table } from "react-bootstrap"
import { TimeSeries, TimeRange } from "pondjs";
import { Charts, ChartContainer, ChartRow, YAxis, AreaChart, styler, Resizable, Brush } from "react-timeseries-charts";

const customColorsList = [
    "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c",
    "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5",
    "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
    "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
];

@observer
export class ChartView extends React.Component {

    constructor(props) {
        super(props);
        this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
    }

    handleTimeRangeChange(newRange) {
        this.props.vm.selectedRange = newRange;
    }

    render() {
        if (!this.props.vm.timeseries) {
            return <div>Loading...</div>
        }

        const stylerForArea = styler(this.props.vm.categories.map((c, i) => ({
            key: c.name,
            color: customColorsList[i]
        })));

        const stlyerForSelector = styler([{ key: "_total", color: "#777" }])

        const rangeToShow = this.props.vm.selectedRange || this.props.vm.timeseries.range();

        return (
            <Grid fluid>
                <Row>
                    <Col lg={9} sm={12}>
                        <Resizable>
                            <ChartContainer timeRange={rangeToShow}>
                                <ChartRow height="350">
                                    <YAxis
                                        id="y"
                                        min={0}
                                        max={1000}
                                        width="60"
                                        type="linear" />
                                    <Charts>
                                        <AreaChart
                                            axis="y"
                                            style={stylerForArea}
                                            series={this.props.vm.timeseries}
                                            columns={{ up: ['1', '2', '3'] }}
                                            //fillOpacity={0.4}
                                            interpolation="curveBasis" />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                        <Resizable>
                            <ChartContainer timeRange={this.props.vm.timeseries.range()}>
                                <ChartRow height="150">
                                    <YAxis
                                        id="y"
                                        min={0}
                                        max={5000}
                                        width="60"
                                        type="linear" />
                                    <Charts>
                                        <Brush
                                            timeRange={this.props.vm.selectedRange}
                                            allowSelectionClear
                                            onTimeRangeChanged={this.handleTimeRangeChange}
                                        />
                                        <AreaChart
                                            axis="y"
                                            style={stlyerForSelector}
                                            series={this.props.vm.timeseries}
                                            columns={{ up: ['_total'] }}
                                            //fillOpacity={0.4}
                                            interpolation="curveBasis" />
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </Col>
                    <Col lg={3} sm={12}>
                        <Table>
                        </Table>
                    </Col>
                </Row>
            </Grid>
        )
    }
}