(function(window){
    'use strict';
    function define_pf(){
        var Pathfinder = {    
            node: function(x, y, is_open){
                if (typeof(is_open) === 'undefined'){
                    is_open = true;
                }
                this.x = x;
                this.y = y;
                this.parent = null;
                this.passable = true;
            },
            util: {
                sumVector: function(node_a, node_b){
                    return [node_a.x+node_b.x, node_a.y+node_b.y]
                },
                compareVector: function(node_a, node_b){
                    return node_a.x==node_b.x && node_a.y==node_b.y;
                },
                lowerFCost: function(node_a, node_b){
                    if (node_a.fCost > node_b.fCost)
                        return -1;
                    else if (node_a.fCost < node_b.fCost)
                        return 1;
                    return 0;
                },
                adjacentNodes: function(node, nodes){
                    var max_x = nodes.length - 1;
                    var max_y = nodes[0].length - 1;
                    var adjacent = [];
                    if (node.x >= 1){
                        adjacent.push(nodes[node.x-1][node.y])
                        if (node.y > 0)
                            adjacent.push(nodes[node.x-1][node.y-1])
                        if (node.y < max_y)
                            adjacent.push(nodes[node.x-1][node.y+1])
                    }
                    if (node.x < max_x){
                        adjacent.push(nodes[node.x+1][node.y]);
                        if (node.y > 0){
                            adjacent.push(nodes[node.x+1][node.y-1])
                        }
                        if (node.y < max_y){
                            adjacent.push(nodes[node.x+1][node.y+1])
                        }
                    }
                    if (node.y > 0){
                        adjacent.push(nodes[node.x][node.y-1])
                    }
                    if (node.y < max_y){
                        adjacent.push(nodes[node.x][node.y+1])
                    }
                    return adjacent.filter(function(n){
                        return n.passable;
                    });
                }
            },
            findPath: function(nodes, start_node, end_node){
                nodes.forEach(function(columns){
                    columns.forEach(function(node){
                        node.is_start = false;
                    });
                })
                var open_list = [];
                var closed_list = [];
                var finished = false;
                start_node.is_start = true;
                var active_node;
                start_node.initialize(null, end_node.x, end_node.y);
                open_list.push(start_node);
                while(true){
                    if (open_list.length < 1){
                        return false;
                    }
                    open_list.sort(Pathfinder.util.lowerFCost);
                    active_node = open_list.splice(open_list.length-1, 1)[0];
                    closed_list.push(active_node);
                    if (active_node == end_node){
                        break;
                    }
                    var adjacent = Pathfinder.util.adjacentNodes(active_node, nodes);
                    adjacent.forEach(function(adj_node){
                        var in_open = false;
                        var in_closed = false;                        
                        for ( var p = 0; p < open_list.length; p++){
                            if (adj_node == open_list[p]){
                                in_open = true;
                                if (adj_node.gCost > active_node.gCost){
                                    adj_node.parent = active_node;
                                    adj_node.setGCost();
                                    adj_node.setFCost();
                                }
                            }                    
                        }
                        if (!in_open){
                            for ( var p = 0; p < closed_list.length; p++){
                                if (adj_node == closed_list[p]){
                                    in_closed = true;
                                    break;
                                }
                            }
                        }
                        if (!in_open && !in_closed){
                            adj_node.initialize(active_node, end_node.x, end_node.y);
                            open_list.push(adj_node);
                        }
                    });
                }
                var steps = [];
                while (active_node.parent !== null){
                    steps.push(active_node);
                    active_node = active_node.parent;
                }
                steps.reverse();
                return steps;
            }
        };
        Pathfinder.node.prototype.setFCost = function() {
            this.fCost = this.hCost + this.gCost;
        };
        Pathfinder.node.prototype.setHCost = function(destination_x, destination_y) {
            var total_x = Math.abs(destination_x - this.x);
            var total_y = Math.abs(destination_y - this.y);
            this.hCost =  10 * ( total_x + total_y );
        };
        Pathfinder.node.prototype.setGCost = function() {
            var moved_x = Math.abs(this.parent.x - this.x);
            var moved_y = Math.abs(this.parent.y - this.y);
            if ( moved_y != 0 && moved_x != 0){
                this.gCost = this.parent.gCost + 14;
            }
            else {
                this.gCost = this.parent.gCost + 10;
            }
        };
        Pathfinder.node.prototype.initialize = function(parent, destination_x, destination_y) {
            if (this.is_start || typeof(parent) == 'undefined' ){
                this.gCost = 0;
            } else {
                this.parent = parent;
                this.setGCost();
            }
            this.setHCost(destination_x, destination_y);
            this.setFCost();
        };
        return Pathfinder;
    }
    if (typeof(Pathfinder) === 'undefined'){
        window.Pathfinder = define_pf();
    } else {
        console.log("Error defining Pathfinder: already defined.")
    }
})(window);