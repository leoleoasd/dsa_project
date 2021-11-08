import * as d3 from 'd3';
import {FibHeap} from './fibonacci';
import {cloneDeep} from 'lodash';

export default (data: FibHeap) => {
  data.heapify();
  const heap = cloneDeep(data);
  const json: {
    nodes: Array<{name: string, mark: boolean, max: boolean}>,
    links: Array<{source: number, target: number}>,
  } = {
    'nodes': [
    ],
    'links': [
    ],
  };
  heap.walk((n) => {
    // console.log(n);
    json.nodes.push({
      name: n.data.name + (n.data.type == 'takeoff' ? '' : ' - ' + n.data.fuel ),
      mark: n.mark,
      max: n == heap.max,
    });
    n.id = json.nodes.length - 1;
    if (n.parent) {
      json.links.push({
        source: n.parent.id,
        target: n.id,
      });
    }
  });

  const width = 500;
  const height = 500;

  const svg = d3.select('#tree').append('svg')
      .attr('width', width)
      .attr('height', height);
  // @ts-ignore
  const force = d3.layout.force()
      .gravity(.05) // @ts-ignore
      .distance(100)
      .charge(-350)
      .size([width, height]);

  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  force.drag()
      .on('dragstart', function(n: any) {
        // @ts-ignore
        n.fixed = true;
      });

  const link = svg.selectAll('.link')
      .data(json.links)
      .enter().append('line')
      .attr('class', 'link');

  const node = svg.selectAll('.node')
      .data(json.nodes)
      .enter().append('g')
      .attr('class', 'node');

  node.append('circle').attr('fill', (d) => '#fff')
      .attr('stroke', (d) => '#000')
      .attr('r', 3.5);

  node.on('dblclick', function(d) {
    // @ts-ignore
    d.fixed = false;
  })
      .call(force.drag);

  // node.append('image')
  //     .attr('xlink:href', 'https://github.com/favicon.ico')
  //     .attr('x', -8)
  //     .attr('y', -8)
  //     .attr('width', 16)
  //     .attr('height', 16);

  node.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .style('fill', (d) => d.max ? 'red' : 'black')
      .text(function(d: any) {
        return '✈' + d.name;
      });

  force.on('tick', function(e: any) {
    const k = 6 * e.alpha;
    json.links.forEach(function(d: any, i) {
      d.source.y -= k;
      d.target.y += k;
    });
    link.attr('x1', function(d: any) {
      return d.source.x;
    })
        .attr('y1', function(d: any) {
          return d.source.y;
        })
        .attr('x2', function(d: any) {
          return d.target.x;
        })
        .attr('y2', function(d: any) {
          return d.target.y;
        });

    node.attr('transform', function(d: any) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });
  });
};
