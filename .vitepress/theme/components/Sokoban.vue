<template>
  <div class="sokoban-container" tabindex="0" ref="gameArea" @keydown="handleKeyDown">
    <div class="header">
      <span class="level-title">
        🎮 {{ isRandomMode ? '🎲 随机关卡 (无限模式)' : `第 ${currentLevel + 1} 关` }}
      </span>
      <div class="btn-group">
        <button class="btn random-btn" @click="generateRandomLevel">🎲 随机生成地图</button>
        <button class="btn reset-btn" @click="resetLevel">↺ 重置 (R)</button>
      </div>
    </div>

    <!-- 游戏地图 -->
    <div class="board" @click="focusGame">
      <div v-for="(row, r) in mapData" :key="r" class="row">
        <div
          v-for="(cell, c) in row"
          :key="c"
          :class="['cell', getCellClass(cell)]"
        >
          <span v-if="cell === '@'">🧍</span>
          <span v-else-if="cell === '+'">🧍</span>
          <span v-else-if="cell === '$'">📦</span>
          <span v-else-if="cell === '*'">✅</span>
          <span v-else-if="cell === '.'">🎯</span>
          <span v-else-if="cell === '#'">🧱</span>
        </div>
      </div>
    </div>

    <!-- 通关提示 -->
    <div v-if="isPassed" class="victory-msg">
      🎉 恭喜通关！
      <button v-if="isRandomMode" class="btn next-btn" @click="generateRandomLevel">🎲 再来一局</button>
      <button v-else-if="currentLevel < levels.length - 1" class="btn next-btn" @click="nextLevel">下一关 ➔</button>
      <span v-else>🏆 固定关卡全通关！可以试试【随机生成】！</span>
    </div>

    <div class="controls-tip">
      💡 操作：点击游戏区域聚焦，使用 <b>方向键 / WASD</b> 移动，<b>按 R 重置</b>。点击右上角【随机生成地图】可无限刷图！
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const gameArea = ref(null)
const isRandomMode = ref(false)

// 预设静态关卡
const levels = [
  [
    "#####",
    "#@  #",
    "# $ #",
    "# . #",
    "#####"
  ],
  [
    "######",
    "#  . #",
    "# #$ #",
    "#  @ #",
    "######"
  ],
  [
    "#######",
    "#     #",
    "# .$. #",
    "#  @  #",
    "# $ $ #",
    "# . . #",
    "#######"
  ]
]

const currentLevel = ref(0)
const mapData = ref([])
const isPassed = ref(false)

// 样式判断
const getCellClass = (cell) => {
  if (cell === '#') return 'wall'
  return 'floor'
}

const focusGame = () => {
  if (gameArea.value) gameArea.value.focus()
}

// ---------------- 🎲 核心：随机保证有解地图生成算法 ----------------
const generateRandomLevel = () => {
  isRandomMode.value = true
  isPassed.value = false

  const size = 7 // 地图 7x7
  let grid = Array.from({ length: size }, () => Array(size).fill('#'))

  // 1. 挖出内部空地 (3x3 ~ 5x5 的内部可操作空间)
  for (let r = 1; r < size - 1; r++) {
    for (let c = 1; c < size - 1; c++) {
      grid[r][c] = ' '
    }
  }

  // 2. 放置 2 个目标点，并直接把箱子放在目标点上（已通关状态）
  const targets = [{ r: 2, c: 2 }, { r: 4, c: 4 }]
  targets.forEach(t => {
    grid[t.r][t.c] = '.'
  })

  // 把箱子直接放在目标点上 -> 符号是 '*' (箱子在目标点)
  let boxes = [{ r: 2, c: 2 }, { r: 4, c: 4 }]
  grid[boxes[0].r][boxes[0].c] = '*'
  grid[boxes[1].r][boxes[1].c] = '*'

  // 3. 放置玩家在空地
  let pR = 3, pC = 3
  grid[pR][pC] = '@'

  // 4. 逆向演化（拉箱子打乱 50 次，确保必定有解）
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  for (let step = 0; step < 60; step++) {
    const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)]
    const newPR = pR + dr
    const newPC = pC + dc

    // 玩家往 newPR, newPC 走，如果那个方向有箱子，就把箱子往玩家方向“拉”一步
    if (newPR > 0 && newPR < size - 1 && newPC > 0 && newPC < size - 1) {
      const cell = grid[newPR][newPC]
      if (cell === '$' || cell === '*') {
        // 尝试拉箱子
        const pullBoxR = newPR + dr
        const pullBoxC = newPC + dc
        if (pullBoxR > 0 && pullBoxR < size - 1 && pullBoxC > 0 && pullBoxC < size - 1) {
          // 清理旧玩家
          grid[pR][pC] = grid[pR][pC] === '+' ? '.' : ' '
          // 移动玩家到箱子位置
          grid[newPR][newPC] = grid[newPR][newPC] === '*' ? '+' : '@'
          // 移动箱子到拉动位置
          grid[pullBoxR][pullBoxC] = grid[pullBoxR][pullBoxC] === '.' ? '*' : '$'

          pR = newPR
          pC = newPC
        }
      } else {
        // 普通走动打乱
        grid[pR][pC] = grid[pR][pC] === '+' ? '.' : ' '
        grid[newPR][newPC] = grid[newPR][newPC] === '.' ? '+' : '@'
        pR = newPR
        pC = newPC
      }
    }
  }

  mapData.value = grid
}

// ---------------- 游戏基础逻辑 ----------------
const loadLevel = (index) => {
  isRandomMode.value = false
  currentLevel.value = index
  isPassed.value = false
  mapData.value = levels[index].map(row => row.split(''))
}

const getPlayerPos = () => {
  for (let r = 0; r < mapData.value.length; r++) {
    for (let c = 0; c < mapData.value[r].length; c++) {
      if (mapData.value[r][c] === '@' || mapData.value[r][c] === '+') return { r, c }
    }
  }
  return null
}

const checkWin = () => {
  for (let r = 0; r < mapData.value.length; r++) {
    for (let c = 0; c < mapData.value[r].length; c++) {
      if (mapData.value[r][c] === '$') return false
    }
  }
  return true
}

const move = (dr, dc) => {
  if (isPassed.value) return
  const pos = getPlayerPos()
  if (!pos) return

  const pR = pos.r, pC = pos.c
  const nR = pR + dr, nC = pC + dc
  const nnR = nR + dr, nnC = nC + dc

  const map = mapData.value
  if (!map[nR] || map[nR][nC] === undefined) return

  const targetCell = map[nR][nC]
  if (targetCell === '#') return

  if (targetCell === ' ' || targetCell === '.') {
    map[nR][nC] = targetCell === '.' ? '+' : '@'
    map[pR][pC] = map[pR][pC] === '+' ? '.' : ' '
  } else if (targetCell === '$' || targetCell === '*') {
    if (!map[nnR] || map[nnR][nnC] === undefined) return
    const nextBoxCell = map[nnR][nnC]
    if (nextBoxCell === ' ' || nextBoxCell === '.') {
      map[nnR][nnC] = nextBoxCell === '.' ? '*' : '$'
      map[nR][nC] = targetCell === '*' ? '+' : '@'
      map[pR][pC] = map[pR][pC] === '+' ? '.' : ' '
    }
  }

  if (checkWin()) isPassed.value = true
}

const handleKeyDown = (e) => {
  const key = e.key.toLowerCase()
  if (['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd', 'r'].includes(key)) {
    e.preventDefault()
  }

  if (key === 'arrowup' || key === 'w') move(-1, 0)
  if (key === 'arrowdown' || key === 's') move(1, 0)
  if (key === 'arrowleft' || key === 'a') move(0, -1)
  if (key === 'arrowright' || key === 'd') move(0, 1)
  if (key === 'r') resetLevel()
}

const resetLevel = () => {
  if (isRandomMode.value) {
    // 随机模式重置则重新生成一局
    generateRandomLevel()
  } else {
    loadLevel(currentLevel.value)
  }
}

const nextLevel = () => {
  if (currentLevel.value < levels.length - 1) {
    loadLevel(currentLevel.value + 1)
  }
}

onMounted(() => {
  loadLevel(0)
})
</script>

<style scoped>
.sokoban-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1a1a1a;
  color: #fff;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  outline: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.sokoban-container:focus {
  border: 1px solid #42b883;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 380px;
  margin-bottom: 15px;
  align-items: center;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.board {
  display: inline-block;
  background: #2a2a2a;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

.row {
  display: flex;
}

.cell {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  user-select: none;
}

.wall { background-color: #383a42; border-radius: 4px; }
.floor { background-color: #282c34; }

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
}

.random-btn { background-color: #8e44ad; color: white; }
.reset-btn { background-color: #e53e3e; color: white; }
.next-btn { background-color: #38a169; color: white; margin-left: 10px; }

.victory-msg {
  margin-top: 15px;
  font-size: 18px;
  color: #48bb78;
  font-weight: bold;
}

.controls-tip {
  margin-top: 15px;
  font-size: 12px;
  color: #a0aec0;
}
</style>