### Footprint  

Footprint is a visualized debugger for static analyzer [Sparrow](https://github.com/ropas/sparrow).

Please read the instructions below to use.

#### 1. Usage

##### 1.1 AST / Def-Use graph visualization

* AST visualization

![alt text](/asset/image/demo1.png "AST")  

* AST + Def-Use chain visualization

![alt text](/asset/image/demo2.png "AST + Def-Use")

##### 1.2 Alarm / Log visualization

* Unfolded

![alt text](/asset/image/demo3.png "Unfolded")  

* Folded

![alt text](/asset/image/demo4.png "Folded")  

##### 1.3 Navigate & Edit Analyzer Code

![alt text](/asset/image/CODE.png "Folded")  

#### 2. Footprint Resources

* [D3](https://d3js.org/) - D3 javascript library for data visualization

* [D3 Force-Weighted Graph](https://github.com/d3/d3-force) - D3 force weighted graph to express program cfg & def-use chain

* [Sparrow](https://github.com/ropas/sparrow) - Sparrow alarms for debugger input

* [Bootstrap](https://getbootstrap.com/) - Bootstrap Front-end framework

* [Ace](https://ace.c9.io/) - Ace Code Editor for Analyzer Code Edit

* Fps(footprint) 

    * Incremental trace information for analysis results. Includes memory analysis dump trace.  

* Rank(for Fps)

    * Rank scores for alarm significance rate based on def-use chain.  

#### 3. Demo

Uses below resources to visualize the analysis result & debug.

```
* Short example of exec.c ( 50 LOC ) *
demo/short/cfg.json - Control flow graph including callgraph & def-use chain
demo/short/log.json - Analysis result & memory stack trace including Fps
demo/short/alarm.txt - Sparrow alarm result

* Long example of gzip.c ( 1000 LOC ) *
demo/long/cfg.json - Control flow graph including callgraph & def-use chain
demo/long/log.json - Analysis result & memory stack trace including Fps
demo/long/alarm.txt - Sparrow alarm result
```