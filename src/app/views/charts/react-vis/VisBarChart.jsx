import React from "react";
import {FlexibleWidthXYPlot, LabelSeries, VerticalBarSeries, VerticalBarSeriesCanvas, XAxis, YAxis} from "react-vis";

const greenData = [
    {x: "A", y: 10},
    {x: "B", y: 5},
    {x: "C", y: 15}
];

const blueData = [
    {x: "A", y: 12},
    {x: "B", y: 2},
    {x: "C", y: 11}
];

const labelData = greenData.map((d, idx) => ({
    x: d.x,
    y: Math.max(greenData[idx].y, blueData[idx].y)
}));

class VisBarChart extends React.Component {
    state = {
        useCanvas: false
    };

    render() {
        const {useCanvas} = this.state;
        const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;
        return (
            <FlexibleWidthXYPlot xType="ordinal" height={300} xDistance={100}>
                <XAxis
                    style={{
                        text: {
                            stroke: "none",
                            fontWeight: 600
                        }
                    }}
                />
                <YAxis
                    style={{
                        text: {
                            stroke: "none",
                            fontWeight: 600
                        }
                    }}
                />
                <BarSeries className="vertical-bar-series-example" data={greenData}/>
                <BarSeries data={blueData}/>
                <LabelSeries data={labelData} getLabel={d => d.x}/>
            </FlexibleWidthXYPlot>
        );
    }
}

export default VisBarChart;
