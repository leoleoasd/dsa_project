import * as _ from 'lodash';

class FibHeapNode {
    children: Array<FibHeapNode>;
    key: number;
    degree: number;
    mark: boolean;
    parent: FibHeapNode;
    data: any;
    id: any;

    constructor(key: number, data: any) {
      this.key = key;
      this.children = [];
      this.data = data;
      // console.log('CONSTRUCT', this);
    }
}

class FibHeap {
    nodes: Array<FibHeapNode>;
    max: FibHeapNode;
    n: number;

    /**
     * Make an empty heap.
     */
    constructor() {
      this.n = 0;
      this.nodes = [];
      this.max = null;
    }

    /**
     * return the maximal node of heap.
     * Time Complexity: O(1)
     * @return {FibHeapNode} the maximal node.
     */
    findMax(): FibHeapNode {
      return this.max;
    }

    /**
     * Recursively walk through this tree, pretty-printing it's structure.
     */
    print() {
      // console.log('MIN', this.max);
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

    walk(fun: (node: FibHeapNode) => void) {
      const _walk = (nodes: FibHeapNode[]) => {
        nodes.forEach(function(node) {
          fun(node);
          if (node.children && node.children.length != 0) {
            _walk(node.children);
          }
        });
      };
      _walk(this.nodes);
    }

    /**
     * Merge nodes according to rules if needed.
     * Time Complexity: O(lg(n))
     */
    consolidate() {
      const A = new Array<FibHeapNode>(
          Math.floor(Math.log(this.n) / Math.log((1 + Math.sqrt( 5)) / 2)));
      for (let i = 0; i < A.length; i++) {
        A[i] = null;
      }
      for (let i = 0; i < this.nodes.length; ++ i) {
        let x = this.nodes[i];
        let d = x.degree;
        while (A[d] != null) {
          let y = A[d];
          // console.log(x);
          if (x.key < y.key) {
            [y, x] = [x, y];
          }
          _.pull(this.nodes, y);
          i--;
          x.children.push(y);
          y.parent = x;
          x.degree++;
          y.mark = false;
          A[d] = null;
          d++;
        }
        A[d] = x;
      }
      this.max = null;
      for (let i = 0; i < A.length; i++) {
        if (A[i] != null) {
          if (this.max == null) {
            this.nodes = [A[i]];
            this.max = A[i];
          } else {
            this.nodes.push(A[i]);
            if (A[i].key > this.max.key) {
              this.max = A[i];
            }
          }
        }
      }
      // console.log(A);
    }

    /**
     * Extract the maximal node from this heap.
     * Time Complexity: O(lg(n))
     */
    extractMax() {
      const z = this.max;
      if ( z != null) {
        for (const c of z.children ?? []) {
          this.nodes.push(c);
          c.parent = null;
        }
        z.children = [];
        _.pull(this.nodes, z);
      }
      if (this.nodes.length == 0) {
        this.max = null;
      } else {
        this.max = this.nodes[0];
        this.consolidate();
      }
      this.n --;
    }

    heapify() {
      if (this.nodes.length == 0) {
        this.max = null;
      } else {
        this.max = this.nodes[0];
        this.consolidate();
      }
    }

    remove(n: FibHeapNode) {
      this.decreaseKey(n, Number.POSITIVE_INFINITY);
      this.extractMax();
    }

    decreaseKey(n: FibHeapNode, key: number) {
      if (key < n.key) {
        console.log(n, key);
        throw new Error('New key is smaller than old key!');
      }
      n.key = key;
      const y = n.parent;
      if (y != null && n.key > y.key) {
        const cut = (x: FibHeapNode, y: FibHeapNode) => {
          _.pull(y.children, x);
          y.degree --;
          this.nodes.push(x);
          x.parent = null;
          x.mark = false;
        };
        const cascadingCut = (y: FibHeapNode) => {
          const z = y.parent;
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
      if (n.key > this.max.key ) {
        this.max = n;
      }
    }

    insert(key: number, data: any): FibHeapNode {
      const n = new FibHeapNode(key, data);
      this.insertNode(n);
      // console.log('Inserted ', key);
      return n;
    }

    empty(): Boolean {
      return this.n == 0;
    }

    insertNode(x: FibHeapNode) {
      x.degree = 0;
      x.parent = null;
      x.children = [];
      x.mark = false;
      if (this.max === null) {
        this.max = x;
        this.nodes.push(x);
      } else {
        this.nodes.push(x);
        if (this.max.key < x.key) {
          this.max = x;
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
