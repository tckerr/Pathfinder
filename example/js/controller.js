angular.module('puzzlestomper').controller('mainController', ['Constants', function(Constants) {
    
    var self = this;    
    var viewport = $('#viewport');
    var canvas = $('#canvas');
    var ctx = canvas[0].getContext("2d");

    self.nodeColumns = [[]];
    self.nodeDetails = {};  
    self.highlightedNodes = [];
    self.lastResult = []; 

    self.styles = {
        'nav_bg': Constants.COLOR_NAV_BACKGROUND,
        'nav_highlight': Constants.COLOR_NAV_HIGHLIGHT,
    }    

    //------------------------------------

    self.nodes = function(){return nested(self.nodeColumns)};  
    
	self.initialize = function(){
        configureNodes();
    }

    self.handleMouseMovement = function(e){
        var pos = getMousePos(e);
        var node = getNode(pos.x, pos.y);
        if (node){
            clearHighlightedNodes();
            hoverNode(node, self.nodeDetails);
        }
    }

    self.clear = function(){
        self.lastResult = [];
        for (node of self.nodes()){
            node.passable = true;
            setNodeColor(node, Constants.COLOR_NODE_DEFAULT);
        }
    }

    self.calculate = function(){
        endCol = self.nodeColumns.length - 1;
        endRow = self.nodeColumns[endCol].length - 1;
        self.lastResult = Pathfinder.findPath(self.nodeColumns, self.nodeColumns[0][0], self.nodeColumns[endCol][endRow] );
        renderNodes();
    }

    angular.element(window).on('resize', function(e) {
        configureNodes();
    });

    angular.element('#canvas').on('click', function(e){
        var pos = getMousePos(e);
        var node = getNode(pos.x, pos.y);
        if (node){
            clearHighlightedNodes();
            setWall(node);
        }
    })


    //------------------------------------

    function configureNodes(){
        var walls = [];
        for (node of self.nodes()){
            if (!node.passable){
                walls.push(node);
            }
        }       
        self.nodeColumns = [];
        self.nodeDetails = {}; 
        
        self.highlightedNodes = [];
        self.nodeDetails = nodeConfigurationDetails();
        self.nodeColumns = buildNodes();
        renderNodes();
        for (node of walls){            
            var n = getNodeByIndex(node.x, node.y);
            setWall(n);
        }
    }


    function nodeConfigurationDetails(){

        var viewportWidth = viewport.outerWidth();
        var viewportHeight = viewport.outerHeight();


        var horizontalNodes = viewportWidth / Constants.NODE_SIZE_PX;
        var verticalNodes = viewportHeight / Constants.NODE_SIZE_PX;
        var horizontalNodeCount = Math.floor(horizontalNodes);
        var verticalNodeCount = Math.floor(verticalNodes);

        var extraHorizonalPx = (horizontalNodes - horizontalNodeCount) * Constants.NODE_SIZE_PX;
        var extraVerticalPx = (verticalNodes - verticalNodeCount) * Constants.NODE_SIZE_PX;

        var nodeExtraWidth = (extraHorizonalPx > extraVerticalPx ? extraVerticalPx : extraHorizonalPx);
        //var nodeWidth = Constants.NODE_SIZE_PX + nodeExtraWidth;
        var nodeWidth = Constants.NODE_SIZE_PX;
        return {
            'nodes': horizontalNodeCount * verticalNodeCount,
            'width': nodeWidth,
            'height': nodeWidth,
            'horizontalCount': horizontalNodeCount,
            'verticalCount': verticalNodeCount
        }
    }

    function buildNodes(){
        // create columns
        var nodeColumns = [];
        var columnCount = self.nodeDetails.horizontalCount;
        var rowCount = self.nodeDetails.verticalCount;
        for ( var col = 0; col < columnCount; ++col ){
            nodeColumns.push([]);
            for ( var row = 0; row < rowCount; ++row ){
                var rowLabel = 'node_c' + col + '_r' + row;
                var x = col * self.nodeDetails.width;
                var y = row * self.nodeDetails.height;
                var node = new Pathfinder.node(col, row, true);
                node.px_x = x;
                node.px_y = y;
                node.label = rowLabel;
                nodeColumns[col].push(node);                
            }
        }
        return nodeColumns;
    }

    function renderNodes(){
        canvas[0].width = viewport.outerWidth();
        canvas[0].height = viewport.outerHeight();
        //var ctx = canvas.getContext("2d");
        ctx.fillStyle = Constants.COLOR_NODE_DEFAULT;
        var walls = [];
        for (node of self.nodes()){
            if (node.passable){
                ctx.fillRect(
                    node.px_x,
                    node.px_y,
                    self.nodeDetails.width,
                    self.nodeDetails.height
                );
            } else {
                walls.push(node);
            }
        }
        ctx.fillStyle = Constants.COLOR_NODE_WALL;
        for (node of walls){
            ctx.fillRect(
                node.px_x,
                node.px_y,
                self.nodeDetails.width,
                self.nodeDetails.height
            );
        }
        ctx.fillStyle = Constants.COLOR_NODE_STEPS;
        if (self.lastResult.length){
            for (node of self.lastResult){
                ctx.fillRect(
                    node.px_x,
                    node.px_y,
                    self.nodeDetails.width,
                    self.nodeDetails.height
                );
            }
        }
    }

    function getMousePos(e) {
        var rect = e.currentTarget.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
    }

    function getNode(x, y){
        var xdepth = Math.floor(x / self.nodeDetails.width);
        var ydepth = Math.floor(y / self.nodeDetails.height);
        if (xdepth < self.nodeColumns.length && ydepth < self.nodeColumns[xdepth].length )
            return self.nodeColumns[xdepth][ydepth];
        return false
    }

    function getNodeByIndex(x, y){
        if (x < self.nodeColumns.length && y < self.nodeColumns[x].length )
            return self.nodeColumns[x][y];
        return false
    }

    function clearHighlightedNodes(){
        for (node of self.highlightedNodes){
            setNodeColor(node, Constants.COLOR_NODE_DEFAULT);
        }
        self.highlightedNodes = [];
    }

    function hoverNode(node){
        if (node.passable){
            if ($('#canvas:active').length){
                setWall(node);
            } else {
                self.highlightedNodes.push(node);
                setNodeColor(node, Constants.COLOR_NODE_HIGHLIGHT);
                if (self.lastResult.length){
                    for (node of self.lastResult){
                        setNodeColor(node, Constants.COLOR_NODE_STEPS)
                    }
                }
            }
        }
        
    }

    function setWall(node){
        node.passable = false;
        setNodeColor(node, Constants.COLOR_NODE_WALL);
    }

    function setNodeColor(node, color){
        ctx.fillStyle = color;
        ctx.fillRect(
            node.px_x,
            node.px_y,
            self.nodeDetails.width,
            self.nodeDetails.height
        );
    }

    var nested = function* (arr){
        for ( var x = 0; x < arr.length; ++x ){
            for ( var y = 0; y < arr[x].length; ++y ){
                yield arr[x][y];
            }
        }
    }

    self.initialize();

}]);