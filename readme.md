
Description
---
Pathfinder is a Javascript library that provides basic 2D pathfinding functionality. The algorithm is a simple implementation of the [A-star search algorithm](https://en.wikipedia.org/wiki/A*_search_algorithm).


Instructions
---

Download and include the library:
```
<script src="lib/pathfinder.min.js"></script>
```

You will then be able to access the library through the ```pathfinder``` object.

Pathfinder has a single function that calculates a path between two points: ```Pathfinder.findPath(nodes, start_node, end_node)```. The arguments are as follows:

- ```nodes```: a 2D array of ```node``` objects (defined below.)
- ```start_node```: the starting ```node``` object from the ```nodes``` array. This node will **not** count as a step in the pathfinding sequence.
- ```end_node```: the destination```node``` object from the ```nodes``` array. Arriving at this node will complete the sequence.

To construct new nodes, use the following syntax: ```var node = new Pathfinder.node(column, row, is_open)```, where the arguments are as follows:

- ```column```: an index starting at 0, representing the nodes horizontal position in the grid.
- ```row```: an index starting at 0, representing the nodes vertical position in the grid.
- ```is_open```: a boolean representing whether the node is passable or not.

Example
---

Here is an example block of code that will construct a node array:

```
function buildNodes(){
    var nodeColumns = [];
    var columnCount = 50;
    var rowCount = 50;
    for ( var col = 0; col < columnCount; ++col ){
        nodeColumns.push([]);
        for ( var row = 0; row < rowCount; ++row ){
            var node = new window.Pathfinder.node(col, row, true, false);
            nodeColumns[col].push(node);                
        }
    }
    return nodeColumns;
}
```

From here, you could pathfind with the following:
```
//pathfind from the top left to the bottom right of our grid
var endCol = self.nodeColumns.length - 1;
var endRow = self.nodeColumns[endCol].length - 1;
var lastResult = window.Pathfinder.findPath(self.nodeColumns, self.nodeColumns[0][0], self.nodeColumns[endCol][endRow] );
```

Note that the ```findPath``` function will return a list of nodes that represent steps in the pathfinding sequence. It will return ```false``` if no path is possible.

See the example for an implementation demonstration.