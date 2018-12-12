//modification to https://stackoverflow.com/questions/36273346/d3js-creating-a-collapsible-table-issues-with-nested-data

let tableWidth = 400,
  tableHeight = 1000,
  barHeight = 40,
  barWidth = tableWidth * 1,
  duration = 300;

let outputSvg = d3
  .select("#tb_output")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .classed("table-svg", true)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + tableWidth + " " + tableHeight);

let inputSvg = d3
  .select("#tb_input")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .classed("table-svg", true)
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + tableWidth + " " + tableHeight);

function updateOutputTable(source) {
  console.log("----------");
  var x0 = 0,
    y0 = 0,
    barHeight = 20,
    padding = 1,
    shownChildren = [];

  source.forEach(function(d) {
    d.x = x0;
    d.y = y0;
    var parentX = x0,
      parentY = y0;
    y0 += barHeight + padding;
    if (d.fps) {
      d.fps.forEach(function(data) {
        data.x = x0;
        data.y = y0;
        data.parentX = parentX;
        data.parentY = parentY;
        y0 += barHeight + padding;
        shownChildren.push(data);
      });
    } else if (d._fps) {
      d._fps.forEach(function(data) {
        data.x = parentX;
        data.y = parentY;
        data.parentX = parentX;
        data.parentY = parentY;
        shownChildren.push(data);
      });
    }
  });

  outputSvg
    .transition()
    .duration(duration)
    .attr("viewBox", "0 0 " + tableWidth + " " + y0);

  d3.select(self.frameElement)
    .transition()
    .duration(duration)
    .style("height", tableHeight + "px");

  console.log(shownChildren);
  var childRow = outputSvg.selectAll(".children").data(shownChildren);

  var childEnter = childRow
    .enter()
    .append("g", ":first-child")
    .classed("children", true)
    .attr("transform", function(d) {
      console.log("Child Enter: " + d.v + "," + d.y);
      return "translate(" + d.parentX + "," + d.parentY + ")";
    });

  var childRect = childEnter
    .append("rect")
    .attr("height", barHeight)
    .attr("width", barWidth)
    .style("fill", color);

  var childText = childEnter
    .append("text")
    .attr("dy", 15)
    .attr("dx", 5.5)
    .style("font-size", "6px")
    .text(function(d) {
      console.log("Child Name: " + d.v + "," + d.y);
      return _valueToString(d.v) + "," + d.exp + "," + d.pgm_point;
    });

  // Transition nodes to their new position.
  childEnter
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      console.log("Child Enter Transition: " + d.v + "," + d.y);
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1);

  childRow
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      console.log("Child Row Transition: " + d.loc + "," + d.y);
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1)
    .select("rect")
    .style("fill", color);

  // Transition exiting nodes to the parent's new position.
  /*childRow.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.parentX + "," + d.parentY + ")";
    })
    .style("opacity", 1e-6)
    .remove();*/

  var tableRow = outputSvg.selectAll(".tableRow").data(source);

  var rowEnter = tableRow
    .enter()
    .append("g")
    .classed("tableRow", true)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  var rowRect = rowEnter
    .append("rect")
    .attr("height", barHeight)
    .attr("width", barWidth)
    .style("fill", color)
    .on("click", click);

  // value to string for v
  function valueToString(v) {
    let print_arrayblk = function(v) {
      if (v.arrblk === "bot") return v.arrblk;
      else {
        return (
          "{" +
          v.arrblk.allocsite +
          " -> (" +
          v.arrblk.arrinfo[0] +
          "," +
          v.arrblk.arrinfo[1] +
          "," +
          v.arrblk.arrinfo[2] +
          "," +
          v.arrblk.arrinfo[3] +
          ", " +
          v.arrblk.arrinfo[4] +
          ")}"
        );
      }
    };

    return (
      "(" +
      v.itv +
      "," +
      v.powloc +
      "," +
      print_arrayblk(v) +
      "," +
      v.structblk +
      "," +
      v.powproc +
      ")"
    );
  }

  var rowText = rowEnter
    .append("text")
    .attr("dy", 15)
    .attr("dx", 5.5)
    .style("font-size", "8px")
    .text(function(d) {
      return d.loc + " -> " + d.v;
    })
    .on("click", click);

  rowEnter
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1);

  tableRow
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1)
    .select("rect")
    .style("fill", color);

  function click(d) {
    if (d.fps) {
      d._fps = d.fps;
      d.fps = null;
    } else {
      d.fps = d._fps;
      d._fps = null;
    }
    updateOutputTable(source);
  }

  function color(d) {
    return d._fps ? "#3182bd" : d.fps ? "#c6dbef" : "#fd8d3c";
  }
}

function updateInputTable(source) {
  console.log("----------");
  var x0 = 0,
    y0 = 0,
    barHeight = 20,
    padding = 1,
    shownChildren = [];

  source.forEach(function(d) {
    d.x = x0;
    d.y = y0;
    var parentX = x0,
      parentY = y0;
    y0 += barHeight + padding;
    if (d.fps) {
      d.fps.forEach(function(data) {
        data.x = x0;
        data.y = y0;
        data.parentX = parentX;
        data.parentY = parentY;
        y0 += barHeight + padding;
        shownChildren.push(data);
      });
    } else if (d._fps) {
      d._fps.forEach(function(data) {
        data.x = parentX;
        data.y = parentY;
        data.parentX = parentX;
        data.parentY = parentY;
        shownChildren.push(data);
      });
    }
  });

  inputSvg
    .transition()
    .duration(duration)
    .attr("viewBox", "0 0 " + tableWidth + " " + y0);

  d3.select(self.frameElement)
    .transition()
    .duration(duration)
    .style("height", tableHeight + "px");

  console.log(shownChildren);
  var childRow = inputSvg.selectAll(".children").data(shownChildren);

  var childEnter = childRow
    .enter()
    .append("g", ":first-child")
    .classed("children", true)
    .attr("transform", function(d) {
      console.log("Child Enter: " + d.v + "," + d.y);
      return "translate(" + d.parentX + "," + d.parentY + ")";
    });

  var childRect = childEnter
    .append("rect")
    .attr("height", barHeight)
    .attr("width", barWidth)
    .style("fill", color);

  var childText = childEnter
    .append("text")
    .attr("dy", 15)
    .attr("dx", 5.5)
    .style("font-size", "6px")
    .text(function(d) {
      console.log("Child Name: " + d.v + "," + d.y);
      return _valueToString(d.v) + "," + d.exp + "," + d.pgm_point;
    });

  // Transition nodes to their new position.
  childEnter
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      console.log("Child Enter Transition: " + d.v + "," + d.y);
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1);

  childRow
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      console.log("Child Row Transition: " + d.loc + "," + d.y);
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1)
    .select("rect")
    .style("fill", color);

  // Transition exiting nodes to the parent's new position.
  /*childRow.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.parentX + "," + d.parentY + ")";
    })
    .style("opacity", 1e-6)
    .remove();*/

  var tableRow = inputSvg.selectAll(".tableRow").data(source);

  var rowEnter = tableRow
    .enter()
    .append("g")
    .classed("tableRow", true)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  var rowRect = rowEnter
    .append("rect")
    .attr("height", barHeight)
    .attr("width", barWidth)
    .style("fill", color)
    .on("click", click);

  // value to string for v
  function valueToString(v) {
    let print_arrayblk = function(v) {
      if (v.arrblk === "bot") return v.arrblk;
      else {
        return (
          "{" +
          v.arrblk.allocsite +
          " -> (" +
          v.arrblk.arrinfo[0] +
          "," +
          v.arrblk.arrinfo[1] +
          "," +
          v.arrblk.arrinfo[2] +
          "," +
          v.arrblk.arrinfo[3] +
          ", " +
          v.arrblk.arrinfo[4] +
          ")}"
        );
      }
    };

    return (
      "(" +
      v.itv +
      "," +
      v.powloc +
      "," +
      print_arrayblk(v) +
      "," +
      v.structblk +
      "," +
      v.powproc +
      ")"
    );
  }

  var rowText = rowEnter
    .append("text")
    .attr("dy", 15)
    .attr("dx", 5.5)
    .style("font-size", "8px")
    .text(function(d) {
      return d.loc + " -> " + d.v;
    })
    .on("click", click);

  rowEnter
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1);

  tableRow
    .transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", 1)
    .select("rect")
    .style("fill", color);

  function click(d) {
    if (d.fps) {
      d._fps = d.fps;
      d.fps = null;
    } else {
      d.fps = d._fps;
      d._fps = null;
    }
    updateInputTable(source);
  }

  function color(d) {
    return d._fps ? "#3182bd" : d.fps ? "#c6dbef" : "#fd8d3c";
  }
}

//convert value record to single string
function preprocessMem(mem) {
  let valueToString = function(v) {
    let str_arrayblk = function(arr) {
      if (arr === "bot") return arr;
      else {
        return (
          "{" +
          arr.allocsite +
          " -> (" +
          arr.arrinfo[0] +
          "," +
          arr.arrinfo[1] +
          "," +
          arr.arrinfo[2] +
          "," +
          arr.arrinfo[3] +
          ", " +
          arr.arrinfo[4] +
          ")}"
        );
      }
    };

    let str_structblk = function(x) {
      if (x === "bot") return x;
      else return "{" + x.loc + "->" + x.structinfo + "}";
    };

    return (
      "(" +
      v.itv +
      "," +
      v.powloc +
      "," +
      str_arrayblk(v.arrblk) +
      "," +
      str_structblk(v.structblk) +
      "," +
      v.powproc +
      ")"
    );
  };

  let bot_fp = [
    {
      v: {
        itv: "bot",
        loc: "bot",
        Arrsite: "bot",
        arrinfo: ["bot", "bot", "bot", "bot", "bot"],
        structblk: "bot",
        powproc: "bot"
      },
      exp: "bot",
      pgm_point: "bot",
      o: "-1",
      p: "-1"
    }
  ];

  return mem.map(row => {
    if (row === "bot") {
      return { loc: "bot", v: "bot", fps: bot_fp };
    } else {
      return {
        loc: row.loc,
        v: valueToString(row.v),
        fps: row.fps[0] === "bot" ? bot_fp : row.fps
      };
    }
  });
}
/* common functions for update memory functions */

//value to string for fps
function _valueToString(v) {
  let str_arr = function(v) {
    if (v.Arrsite === "bot") return "bot";
    else {
      return "{" + v.Arrsite + "-> " + v.arrinfo + "}";
    }
  };

  let str_blk = function(v) {
    if (v.Structsite === "bot") return "bot";
    else return "{" + v.Structsite + "->" + v.structinfo + "}";
  };

  return (
    "(" +
    v.itv +
    "," +
    v.loc +
    "," +
    str_arr(v) +
    "," +
    str_blk(v) +
    "," +
    v.powproc +
    ")"
  );
}

function changeNode(node) {
  inputSvg.selectAll("*").remove();
  outputSvg.selectAll("*").remove();
  renderTable(node);
}

function renderTable(node) {
  node = data.find(d => {
    return d.node === node;
  });
  input = node.input;
  output = node.output;
  input.forEach(function(d) {
    if (d.fps) {
      d._fps = d.fps;
      d.fps = null;
    } else {
      d.fps = d._fps;
      d._fps = null;
    }
  });
  updateInputTable(input);

  output.forEach(function(d) {
    if (d.fps) {
      d._fps = d.fps;
      d.fps = null;
    } else {
      d.fps = d._fps;
      d._fps = null;
    }
    updateOutputTable(output);
  });
}

d3.json("table3.json")
  .then(d => {
    // preprocess the memories (make v as one string)
    data = d.map(row => ({
      node: row.node,
      input: preprocessMem(row.input),
      output: preprocessMem(row.output)
    }));
    // get list of nodes
    const nodeList = d.map(row => row.node);
    return nodeList;
  })
  .then(nodeList => {
    // load node into drop-down
    d3.select("#menu select")
      .selectAll("option")
      .data(nodeList)
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(t => t);
    return nodeList[0];
  })
  .then(node => {
    renderTable(node);
  });
