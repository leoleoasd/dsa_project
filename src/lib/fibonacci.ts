
class FibHeapNode {
    children: Array<FibHeapNode>;
    key: number;
    degree: number;
    mark: boolean;
    parent: FibHeapNode;

    constructor(key: number) {
      this.key = key;
      this.children = [];
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

    findMin(): number {
      return this.min.key;
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
          this.nodes.splice(this.nodes.indexOf(y), 1);
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
          c.parent = null;
        }
        z.children = [];
        this.nodes.splice(this.nodes.indexOf(z), 1);
      }
      if (this.nodes.length == 0) {
        this.min = null;
      } else {
        this.min = this.nodes[0];
        this.consolidate();
      }
      this.n --;
    }

    insert(key: number) {
      this.insertNode(new FibHeapNode(key));
      console.log('Inserted ', key);
    }

    insertNode(x: FibHeapNode) {
      x.degree = 0;
      x.parent = null;
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
