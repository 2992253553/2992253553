// daily.js - Modified to generate a block of content to be inserted
const fs = require('fs');
const dayjs = require('dayjs');
const path = require('path');

const indexFilePath = path.join(__dirname, 'quotation_index.txt');
const readmePath = path.join(__dirname, 'README.md');
const quotationsPath = path.join(__dirname, 'quotations.md');
const outputBlockPath = path.join(__dirname, 'daily_quotation_block.txt'); // 新增：输出文件路径

function getCurrentIndex() {
  if (fs.existsSync(indexFilePath)) {
    return parseInt(fs.readFileSync(indexFilePath, 'utf-8'), 10);
  } else {
    return 0;
  }
}

function saveCurrentIndex(index) {
  fs.writeFileSync(indexFilePath, index.toString());
}

function run() {
  try {
    // 1. 读取 quotables.md 并选择每日一言
    const quotation = fs.readFileSync(quotationsPath, 'utf-8');
    const quotations = quotation.split('\n').filter((it) => it.startsWith('-'));
    let currentIndex = getCurrentIndex();
    const daily = quotations[currentIndex];
    currentIndex = (currentIndex + 1) % quotations.length; // 更新索引
    saveCurrentIndex(currentIndex);

    // 2. 格式化日期
    const date = dayjs().locale('zh-cn').format('YYYY-MM-DD');

    // 3. 构建要插入的完整内容块
    // 注意：这里生成的内容块格式是为插入到 README.md 中间设计的
    const newContentBlock = `## 每日一言
${date}

${daily}
`;

    // 4. 将格式化后的内容写入临时文件
    fs.writeFileSync(outputBlockPath, newContentBlock);

    console.log('Generated daily quotation block successfully!');
    console.log('Content to be inserted:');
    console.log(newContentBlock);

  } catch (error) {
    console.log('Error in daily.js:', error.message);
  }
}

run();