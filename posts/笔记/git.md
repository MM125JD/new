# 报错原因汇总
```
error: your local changes would be overwritten by revert.
错误：你的本地修改将被 revert（撤销/回滚操作）覆盖。

hint: commit your changes or stash them to proceed.
提示：请提交（commit）你的修改，或将其暂存（stash）以继续操作。

fatal: revert failed
致命错误：revert 操作失败
```
这句话的意思是：Git 发现你本地有**还没保存/提交的代码修改**。为了防止在回滚（revert）历史记录时把你现有的代码冲掉，Git 自动暂停了这次回滚。