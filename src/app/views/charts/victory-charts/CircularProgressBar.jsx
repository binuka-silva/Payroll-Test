import React, {Component} from "react";
import {VictoryAnimation, VictoryLabel, VictoryPie} from "victory";

class CircularProgressBar extends Component {
    state = {
        percent: 0,
        data: this.getData(0)
    };

    componentDidMount() {
        let percent = 25;
        this.setStateInterval = window.setInterval(() => {
            percent += 25;
            percent = percent > 100 ? 0 : percent;
            this.setState({
                percent,
                data: this.getData(percent)
            });
        }, 2000);
    }

    componentWillUnmount() {
        if (this.setStateInterval) window.clearInterval(this.setStateInterval);
    }

    getData(percent) {
        return [
            {x: 1, y: percent},
            {x: 2, y: 100 - percent}
        ];
    }

    render() {
        return (
            <div style={{height: "320px"}}>
                <svg viewBox="0 0 400 400" width="100%" height="100%">
                    <VictoryPie
                        standalone={false}
                        animate={{duration: 1000}}
                        width={400}
                        height={400}
                        data={this.state.data}
                        innerRadius={120}
                        cornerRadius={25}
                        labels={() => null}
                        style={{
                            data: {
                                fill: ({datum}) => {
                                    const color = datum.y > 30 ? "green" : "red";
                                    return datum.x === 1 ? color : "transparent";
                                }
                            }
                        }}
                    />
                    <VictoryAnimation duration={1000} data={this.state}>
                        {newProps => {
                            return (
                                <VictoryLabel
                                    textAnchor="middle"
                                    verticalAnchor="middle"
                                    x={200}
                                    y={200}
                                    text={`${Math.round(newProps.percent)}%`}
                                    style={{fontSize: 45}}
                                />
                            );
                        }}
                    </VictoryAnimation>
                </svg>
            </div>
        );
    }
}

export default CircularProgressBar;
