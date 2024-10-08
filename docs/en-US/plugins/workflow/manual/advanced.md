# 进阶使用

从 [快速开始](./index.md) 中我们已经了解了工作流最基本的用法，本篇进一步介绍其中一些更深入的概念。

## 使用变量

正如程序语言中的变量，在工作流中**变量**是用于串接和组织流程的重要工具。

在工作流触发后执行每个节点时，一些配置项可以选择使用变量，变量的来源即该节点的前序数据，包括以下几类：

- 触发上下文数据：表单触发、数据表触发等情况下，单行数据对象可以被所有节点使用。
- 上游节点数据：流程进行到任意节点时，之前已完成的节点的结果数据。
- 局域变量：当节点处在一些特殊分支结构内时，可以使用对应分支内特有的局域变量，例如循环结构中可以使用每轮循环的数据对象。
- 系统变量：一些内置的系统参数，如当前时间等。

我们在 [快速开始](./index.md) 中已经多次使用了变量的功能，例如在运算节点中，我们可以使用变量来引用触发上下文数据，来进行计算：

![运算节点使用函数及变量](https://github.com/nocobase/nocobase/assets/525658/cabf5289-0bfc-4768-b48e-b9c6b66b0434)

在更新节点中，使用触发上下文数据作为筛选条件的变量，并引用运算节点的结果作为更新数据的字段值变量：

![更新数据节点变量](https://github.com/nocobase/nocobase/assets/525658/c7303e35-c7e9-430b-b391-fc35a468c4cd)

变量的内部是一个 JSON 结构，通常可以按 JSON 的路径使用数据的特定部分。由于很多变量基于 NocoBase 的数据表结构，关系数据将会作为对象的属性按层级组成类似树的结构，例如我们可以选择查询到数据的关系数据的某个字段的值。另外当关系数据是对多的结构时，变量可能会是一个数组。

选择变量在大多数时候会需要选到最后一层值属性，通常是简单数据类型，如数字、字符串等。但当变量层级中有数组时，末级的属性也会被映射成一个数组，只有对应的节点支持数组的情况下，才能正确处理数组数据。例如在运算节点中，一些计算引擎有专门处理数组的函数，又比如在循环节点中，循环对象也可以直接选择一个数组。

举个例子，当一个查询节点查询了多条数据时，节点结果将会是一个包含多行同构数据的数组：

```json
[
  {
    "id": 1,
    "title": "标题1"
  },
  {
    "id": 2,
    "title": "标题2"
  }
]
```

但是在后续节点中将其作为变量使用时，如果选择的变量是 `节点数据/查询节点/标题` 的形式，将会得到一个被映射后是对应字段值的数组：

```json
["标题1", "标题2"]
```

如果是多维数组（如多对多关系字段），将会得到一个对应字段被拍平后的一维数组。

## 执行计划（历史记录）

每个工作流触发后，会创建对应的执行计划，以跟踪此次任务的执行。每个执行计划都有一个状态值用于表示当前的执行状态，该状态在执行历史的列表和详情中都可以查看到：

![执行计划状态](https://github.com/nocobase/nocobase/assets/525658/f7b9e66d-c393-40ab-bba3-ef7265641371)

当主流程分支中的节点全部都以“完成”状态执行到流程终点时，整个执行计划将以“完成”状态结束。当主流程分支中的节点出现“失败”、“出错”、“取消”、“拒绝”等终态时，整个执行计划将以对应的状态**提前终止**。当主流程分支中的节点出现“等待”状态时，整个执行计划将暂停执行，但仍显示“执行中”的状态，直到等待的节点被恢复后继续执行。不同的节点类型对等待状态的处理方式不同，比如人工节点需要等待人工处理，而延时节点需要等待时间到达后继续执行。

执行计划的状态如下表：

| 状态   | 对应主流程最后执行的节点状态 | 含义                                             |
| ------ | ---------------------------- | ------------------------------------------------ |
| 队列中 | -                            | 流程已触发并生成执行计划，排队等待调度器安排执行 |
| 进行中 | 等待                         | 节点要求暂停，等待进一步输入或回调再继续         |
| 完成   | 完成                         | 未遇到任何问题，所有节点按预期逐个执行完成。     |
| 失败   | 失败                         | 由于未满足节点配置，导致失败。                   |
| 出错   | 出错                         | 节点遇到未捕获的程序错误，提前结束。             |
| 取消   | 取消                         | 等待中的节点被流程管理者从外部取消执行，提前结束 |
| 拒绝   | 拒绝                         | 在人工处理的节点中，被人工拒绝不再继续后续流程   |

在 [快速开始](./index.md) 的例子中，我们已经知道查看工作流的执行历史的详情可以检查执行过程中所有节点的执行是否正常，以及每个已执行的节点的执行状态和结果数据，在一些高级的流程和节点中，节点的结果还可能有多个，例如循环节点的结果：

![多次执行的节点结果](https://github.com/nocobase/nocobase/assets/525658/afe49575-21cf-4c0c-9d9e-1559eb53e8b6)

:::info{title=提示}
工作流可以被并发的触发，但执行是逐个排队执行的，即使同时触发多个工作流，也会依次执行，不会并行执行。所以出现“队列中”的情况时，代表有其他工作流正在执行，需要等待。

“进行中”的状态只代表该执行计划已经开始，且通常由于内部节点的等待状态而暂停，并不代表该执行计划抢占了队头的执行资源。所以存在“进行中”的执行计划时，其他“队列中”的执行计划仍可被调度开始执行。
:::

## 节点执行状态

执行计划的状态是由其中每个节点的执行决定的，在一次触发后的执行计划中，每个节点执行后会产生一个执行状态，状态则会决定后续流程是否继续执行。通常情况下，节点执行成功后，会继续执行下一个节点，直到所有节点依次执行完成，或者被中断。当遇到流程控制相关节点时，如分支、循环、并行、延时等，会根据节点配置的条件，以及运行时的上下文数据，决定下一个节点的执行流向。

每个节点执行后可能产生的状态如下表：

| 状态 | 是否是终态 | 是否提前终止 | 含义                                                   |
| ---- | :--------: | :----------: | ------------------------------------------------------ |
| 等待 |     否     |      否      | 节点要求暂停，等待进一步输入或回调再继续               |
| 完成 |     是     |      否      | 未遇到任何问题，执行成功，继续执行下一个节点直至结束。 |
| 失败 |     是     |      是      | 由于未满足节点配置，导致失败。                         |
| 出错 |     是     |      是      | 节点遇到未捕获的程序错误，提前结束。                   |
| 取消 |     是     |      是      | 等待中的节点被流程管理者从外部取消执行，提前结束       |
| 拒绝 |     是     |      是      | 在人工处理的节点中，被人工拒绝不再继续后续流程         |

除等待状态外，其他状态都是节点执行的终态，只有终态是“完成”的状态，才会继续执行，否则都会提前终止整个流程的执行。当节点处在分支流程中时（并行分支、条件判断、循环等），节点执行产生的终态会由开启分支的节点接管处理，并以此类推决定整个流程的流转。

例如当我们使用了“‘是’则继续”模式的条件节点时，当执行时如果结果为“否”，则会提前终止整个流程的执行，并已失败状态退出，不再执行后续节点，如下图所示：

![节点执行失败](https://github.com/nocobase/nocobase/assets/525658/a21e8641-e68e-4c87-856e-8b01191d047d)

:::info{title=提示}
所有非“完成”的终止状态都可以被视为失败，但失败的原因不同，可以通过查看节点的执行结果来进一步了解失败的原因。
:::

## 自动删除历史记录

当工作流的触发较为频繁时，可以通过配置自动删除历史记录来减少干扰，同时也将降低数据库的存储压力。

同样在工作流的新建和编辑弹窗中可以配置对应流程是否自动删除历史记录：

![自动删除历史记录配置](https://github.com/nocobase/nocobase/assets/525658/14c4cb5c-1b5f-4182-a0ba-5311e2cc5d7f)

自动删除可以根据执行结果的状态来进行配置，大部分情况下，建议仅勾选“完成”状态，这样可以保留执行失败的记录，以便后续排查问题。

建议在调试工作流时不要开启自动删除历史记录，以便通过历史记录来检查工作流的执行逻辑是否符合预期。

:::info{title=提示}
删除工作流的历史并不会减少工作流已执行过的计数。
:::

## 工作流的版本

在已配置的工作流触发至少一次以后，如希望修改工作流的配置或其中的节点，需要通过创建新版本后再修改，这样同时也保证了当回顾已触发过的工作流历史执行记录时不受未来修改的影响。

在工作流的配置页面，可以在右上角的版本菜单查看已有的工作流版本：

![查看工作流版本](https://github.com/nocobase/nocobase/assets/525658/b1138bc7-33b5-4309-a4cc-4de9f59fe529)

在其右侧的更多操作（“…”）菜单中，可以选择基于当前查看的版本复制到新版本：

![复制工作流为新版本](https://github.com/nocobase/nocobase/assets/525658/bfce7fdf-e774-46e4-961b-58ca2499cf56)

复制到新版本之后，点击“启用”/“停用”开关，将对应版本切换到启用状态后，新的工作流版本将会生效。

如需重新选择旧版本，从版本菜单中切换后，再次点击“启用”/“停用”开关切换至启用状态后，当前查看的版本将生效，后续触发将执行对应版本的流程。

当需要停用工作流时，点击“启用”/“停用”开关切换至停用状态后，该工作流将不再会被触发。

:::info{title=提示}
与工作流管理列表中的“复制”工作流不同，“复制到新版本”的工作流仍会归集在同一组工作流中，只是可以通过版本区分。但复制工作流则会被视为一个全新的工作流，与之前工作流的版本无关，且执行次数也会归零。
:::
