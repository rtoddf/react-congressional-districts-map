import React from 'react';
// import queue from 'queue';
import * as topojson from 'topojson';
import * as d3 from 'd3';

// source: https://www.youtube.com/watch?v=pzMTVChKvjo&t=23s
// this is a hacky way of doing things, but it works

class CongressionalDistricts extends React.Component {
    state = {usData: null, usCongress: null}
    componentDidMount() {
        Promise.all([
            d3.json('us.json'),
            d3.json('us-congress-113.json')
            ]).then( ([usData, usCongress]) => {
                // do stuff
                console.log('usData: ', usData);
                console.log('usCongress: ', usCongress);

                this.setState({usData, usCongress})
            }).catch(err => console.log('Error loading or parsing data.', err))
    }

    componentDidUpdate() {
        const svg = d3.select(this.refs.anchor),
                { width, height } = this.props;

        // const width = 960,
        //         height = 600;

        const projection = d3.geoAlbers()
            .scale(1280)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath(projection);
        const us = this.state.usData;
        const congress = this.state.usCongress;

        svg.append("defs").append("path")
            .attr("id", "land")
            .datum(topojson.feature(us, us.objects.land))
            .attr("d", path);

        svg.append("clipPath")
            .attr("id", "clip-land")
            .append("use")
            .attr("xlink:href", "#land");

        svg.append("g")
            .attr("class", "districts")
            .attr("clip-path", "url(#clip-land)")
            .selectAll("path")
            .data(topojson.feature(congress, congress.objects.districts).features)
            .enter().append("path")
            .attr("d", path)
            .append("title")
            .text(function(d) { return d.id; });

        svg.append("path")
            .attr("class", "district-boundaries")
            .datum(topojson.mesh(congress, congress.objects.districts, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }))
            .attr("d", path);

        svg.append("path")
            .attr("class", "state-boundaries")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("d", path);
    }

    render(){
        const { usData, usCongress } = this.state;

        if (!usData || !usCongress) {
            return null;
        }

        return (
            <g ref="anchor" />
        )
    }
}

export default CongressionalDistricts;