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

function updateInputTable(source) {
  console.log("----------");
  let x0 = 0,
    y0 = 0,
    barHeight = 20,
    padding = 1,
    shownChildren = [];

  source.forEach(function(d) {
    d.x = x0;
    d.y = y0;
    let parentX = x0,
      parentY = y0;
    y0 += barHeight + padding;
    if (d.fps) {
      d.fps.forEach(function(data) {
        data.x = x0;
        data.y = y0;
        data.parentX = parentX;
        data.parentY = parentY;
        // y0 += barHeight + padding;
        y0 += data.AddrOf
          ? barHeight + 30 + padding
          : _valueToString(data.v).length > 120
          ? barHeight + 10 + padding
          : barHeight + padding;
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
  let childRow = inputSvg.selectAll(".children").data(shownChildren);

  let childEnter = childRow
    .enter()
    .append("g", ":first-child")
    .classed("children", true)
    .attr("transform", function(d) {
      console.log("Child Enter: " + d.v + "," + d.y);
      return "translate(" + d.parentX + "," + d.parentY + ")";
    });

  let childRect = childEnter
    .append("rect")
    .attr("height", function(d) {
      if (d.AddrOf) return barHeight + 30;
      else if (_valueToString(d.v).length > 120) return barHeight + 10;
      else return barHeight;
    })
    .attr("width", barWidth)
    .style("fill", color);

  let childText = childEnter
    .append("text")
    .attr("dy", 15)
    .attr("dx", 5.5)
    .style("font-size", "7px")
    .html(function(d) {
      if (d.AddrOf) return make_tspan(__valueToString(d));
      else {
        return make_tspan(
          _valueToString(d.v) + "," + d.exp + "," + d.pgm_point
        );
      }
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

  let tableRow = inputSvg.selectAll(".tableRow").data(source);

  let rowEnter = tableRow
    .enter()
    .append("g")
    .classed("tableRow", true)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  let rowRect = rowEnter
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

  let rowText = rowEnter
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

function updateOutputTable(source) {
  console.log("----------");
  let x0 = 0,
    y0 = 0,
    barHeight = 20,
    padding = 1,
    shownChildren = [];

  source.forEach(function(d) {
    d.x = x0;
    d.y = y0;
    let parentX = x0,
      parentY = y0;
    y0 += barHeight + padding;
    if (d.fps) {
      d.fps.forEach(function(data) {
        data.x = x0;
        data.y = y0;
        data.parentX = parentX;
        data.parentY = parentY;
        // y0 += barHeight + padding;
        y0 += data.AddrOf
          ? barHeight + 30 + padding
          : _valueToString(data.v).length > 120
          ? barHeight + 10 + padding
          : barHeight + padding;
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
  let childRow = outputSvg.selectAll(".children").data(shownChildren);

  let childEnter = childRow
    .enter()
    .append("g", ":first-child")
    .classed("children", true)
    .attr("transform", function(d) {
      console.log("Child Enter: " + d.v + "," + d.y);
      return "translate(" + d.parentX + "," + d.parentY + ")";
    });

  let childRect = childEnter
    .append("rect")
    .attr("height", function(d) {
      if (d.AddrOf) return barHeight + 30;
      else if (_valueToString(d.v).length > 120) return barHeight + 10;
      else return barHeight;
    })
    .attr("width", barWidth)
    .style("fill", color);

  let childText = childEnter
    .append("text")
    .attr("dy", 15)
    .attr("dx", 5.5)
    .style("font-size", "7px")
    .html(function(d) {
      if (d.AddrOf) return make_tspan(__valueToString(d));
      else {
        return make_tspan(
          _valueToString(d.v) + "," + d.exp + "," + d.pgm_point
        );
      }
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

  let tableRow = outputSvg.selectAll(".tableRow").data(source);

  let rowEnter = tableRow
    .enter()
    .append("g")
    .classed("tableRow", true)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  let rowRect = rowEnter
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

  let rowText = rowEnter
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


/*******************************************************************************
* Common functions for update memory
*******************************************************************************/

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

// for fps with AddrOf 
function __valueToString(d) {
  let print = function(d) {
    if (d.Parent)
      _valueToString(d.v) +
        "," +
        d.exp +
        "," +
        d.pgm_point +
        "\n" +
        "Parent:" +
        print(d.Parent[0]);
    else return _valueToString(d.v) + "," + d.exp + "," + d.pgm_point;
  };
  return (
    _valueToString(d.v) +
    "," +
    d.exp +
    "," +
    d.pgm_point +
    "\n" +
    "ArrdOf:" +
    _valueToString(d.AddrOf.v) +
    "," +
    d.AddrOf.exp +
    "," +
    d.AddrOf.pgm_point +
    "\n" +
    "Parent:" +
    print(d.AddrOf.Parent[0])
  );
}

function make_tspan(str) {
  let str_split = str.split("\n");
  let process_str = function(str) {
    if (str.length < 120) return "<tspan x=0 dy=1.2em>" + str + "</tspan>";
    else {
      let _str = str;
      let result = "";
      while (_str.length > 120) {
        result +=
          "<tspan x=0 dy=1.2em>" + _str.substring(0, 120) + "</tspan>";
        _str = _str.substring(120, _str.length);
      }
      result += "<tspan x=0 dy=1.2em>" + _str + "</tspan>";
      // let result =  "<tspan x=0 dy=1.2em>" + str.substring(0, 120) + "</tspan>" +
      //   "<tspan x=0 dy=1.2em>" + str.substring(120, str.length) + "</tspan>";
      return result;
    }
  };

  let result = "";
  for (let i in str_split) {
    result += process_str(str_split[i]);
  }

  return result;
}


function sortFps(fps) {
  let compare_by_order = (fp1, fp2) => parseInt(fp2.o) - parseInt(fp1.o);
  let compare_by_priority = (fp1, fp2) => {
    let max = (a, b) => (a < b ? b : a);
    let _calc_priority = fp => {
      if (!fp.Parent) return parseInt(fp.p);
      else return max(parseInt(fp.p), _calc_priority(fp.Parent));
    };
    let calc_priority = fp => {
      if (!fp.AddrOf) return parseInt(fp.p);
      else {
        if (!fp.AddrOf.Parent) {
          return max(parseInt(fp.p), parseInt(fp.AddrOf.p));
        } else {
          return max(parseInt(fp.p), _calc_priority(fp.AddrOf.Parent));
        }
      }
    };
    return calc_priority(fp2) - calc_priority(fp1);
  };
  return fps.sort(compare_by_order).sort(compare_by_priority);
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


/*******************************************************************************
* Preprocess Memory
*******************************************************************************/

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
        fps: row.fps[0] === "bot" ? bot_fp : sortFps(row.fps)
      };
    }
  });
}

d3.json("table3.json")
  .then(d => {
    // preprocess the memories (make v as one string)
    data = d.map(row => {
      console.log("=================Node:"+row.node+"==================");
      console.log('input');
      console.log(preprocessMem(row.input))
      console.log('output');
      console.log(preprocessMem(row.output));
      console.log("==============================================");
      return {
        node: row.node,
        input: preprocessMem(row.input),
        output: preprocessMem(row.output)
      };
    });
    console.log("inputMem:")
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
