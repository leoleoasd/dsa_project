import * as _ from 'lodash';

class FibHeapNode {
    children: Array<FibHeapNode>;
    key: number;
    degree: number;
    mark: boolean;
    father: FibHeapNode;
    data: any;

    constructor(key: number, data: any) {
      this.key = key;
      this.children = [];
      this.data = data;
      // console.log('CONSTRUCT', this);
    }

  // get children() {
  //   return this.c;
  // }
  //
  // set children(newC) {
  //   console.log('SET', this, newC);
  //   this.c = newC;
  // }
}

class FibHeap {
    nodes: Array<FibHeapNode>;
    min: FibHeapNode;
    n: number;

    constructor() {
      this.n = 0;
      this.nodes = [];
      this.min = null;
    }

    findMin(): FibHeapNode {
      return this.min;
    }

    walk() {
      console.log('MIN', this.min);
      const _walk = (prefix: string, nodes: FibHeapNode[]) => {
        nodes.forEach(function(node) {
          console.log(prefix + '--', node.key);
          if (node.children && node.children.length != 0) {
            _walk(prefix + '| ', node.children);
          }
        });
      };
      _walk('', this.nodes);
    }


    consolidate() {
      const A = new Array<FibHeapNode>(
          Math.floor(Math.log(this.n) / Math.log((1 + Math.sqrt( 5)) / 2)));
      // console.log(
      //     Math.floor(Math.log(this.n) / Math.log((1 + Math.sqrt(5)) / 2)));
      for (let i = 0; i < A.length; i++) {
        A[i] = null;
      }
      for (let i = 0; i < this.nodes.length; ++ i) {
        let x = this.nodes[i];
        let d = x.degree;
        while (A[d] != null) {
          let y = A[d];
          // console.log(x);
          if (x.key > y.key) {
            [y, x] = [x, y];
          }
          _.pull(this.nodes, y);
          i--;
          x.children.push(y);
          y.father = x;
          x.degree++;
          y.mark = false;
          A[d] = null;
          d++;
        }
        A[d] = x;
      }
      this.min = null;
      for (let i = 0; i < A.length; i++) {
        if (A[i] != null) {
          if (this.min == null) {
            this.nodes = [A[i]];
            this.min = A[i];
          } else {
            this.nodes.push(A[i]);
            if (A[i].key < this.min.key) {
              this.min = A[i];
            }
          }
        }
      }
      // console.log(A);
    }

    extractMin() {
      const z = this.min;
      if ( z != null) {
        for (const c of z.children ?? []) {
          this.nodes.push(c);
          c.father = null;
        }
        z.children = [];
        _.pull(this.nodes, z);
      }
      if (this.nodes.length == 0) {
        this.min = null;
      } else {
        this.min = this.nodes[0];
        this.consolidate();
      }
      this.n --;
    }

    decreaseKey(n: FibHeapNode, key: number) {
      if (key > n.key) {
        throw new Error('New key is greater than old key!');
      }
      n.key = key;
      const y = n.father;
      if (y != null && n.key < y.key) {
        const cut = (x: FibHeapNode, y: FibHeapNode) => {
          _.pull(y.children, x);
          y.degree --;
          this.nodes.push(x);
          x.father = null;
          x.mark = false;
        };
        const cascadingCut = (y: FibHeapNode) => {
          const z = y.father;
          if (z != null) {
            if (y.mark == false) {
              y.mark = true;
            } else {
              cut(y, z);
              cascadingCut(z);
            }
          }
        };
        cut(n, y);
        cascadingCut(y);
      }
      if (n.key < this.min.key ) {
        this.min = n;
      }
    }

    insert(key: number, data: any): FibHeapNode {
      const n = new FibHeapNode(key, data);
      this.insertNode(n);
      console.log('Inserted ', key);
      return n;
    }

    insertNode(x: FibHeapNode) {
      x.degree = 0;
      x.father = null;
      x.children = [];
      x.mark = false;
      if (this.min === null) {
        this.min = x;
        this.nodes.push(x);
      } else {
        this.nodes.push(x);
        if (this.min.key > x.key) {
          this.min = x;
        }
      }
      this.n ++;
    }
}

export {
  FibHeap,
  FibHeapNode,
  FibHeap as default,
};
