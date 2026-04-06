#!/bin/bash

# 每日站点自动化定时任务设置脚本
# 使用方法：chmod +x setup_cron.sh && ./setup_cron.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_NAME="daily_automation.py"
CRON_JOB="0 23 * * * cd $SCRIPT_DIR && /usr/bin/python3 $SCRIPT_NAME >> $SCRIPT_DIR/automation.log 2>&1"

echo "================================"
echo "设置每日站点自动化定时任务"
echo "================================"
echo ""

# 检查 Python3 是否安装
echo "检查 Python3 安装..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    echo "✓ Python3 已安装: $PYTHON_VERSION"
else
    echo "✗ Python3 未安装"
    echo "请先安装 Python3: sudo apt-get install python3 (Ubuntu/Debian)"
    exit 1
fi

echo ""

# 检查脚本文件是否存在
echo "检查脚本文件..."
FILES=(
    "daily_automation.py"
    "generate_static_html.py"
    "push_to_google.py"
    "sites_list.json"
)

ALL_FILES_EXIST=true
for file in "${FILES[@]}"; do
    if [ -f "$SCRIPT_DIR/$file" ]; then
        echo "✓ 找到文件: $file"
    else
        echo "✗ 文件不存在: $file"
        ALL_FILES_EXIST=false
    fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
    echo ""
    echo "错误: 缺少必要的文件"
    exit 1
fi

echo ""

# 检查是否已存在相同的 cron 任务
echo "检查现有 cron 任务..."
if crontab -l 2>/dev/null | grep -q "daily_automation.py"; then
    echo "发现已存在的定时任务"
    read -p "是否删除并重新创建? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # 删除旧任务
        crontab -l 2>/dev/null | grep -v "daily_automation.py" | crontab -
        echo "✓ 已删除旧任务"
    else
        echo "操作已取消"
        exit 0
    fi
fi

echo ""

# 添加新的 cron 任务
echo "创建定时任务..."
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

if [ $? -eq 0 ]; then
    echo "✓ 定时任务创建成功"
    echo ""
    echo "任务详情:"
    echo "  执行时间: 每天 23:00"
    echo "  工作目录: $SCRIPT_DIR"
    echo "  执行脚本: $SCRIPT_NAME"
    echo "  日志文件: $SCRIPT_DIR/automation.log"
else
    echo "✗ 创建定时任务失败"
    exit 1
fi

echo ""

# 显示当前的 cron 任务
echo "当前的 cron 任务:"
echo "----------------------------------------"
crontab -l
echo "----------------------------------------"

echo ""

# 测试任务
read -p "是否立即测试运行任务? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "手动执行任务..."
    cd "$SCRIPT_DIR"
    python3 "$SCRIPT_NAME"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ 任务执行完成"
        echo "请查看日志文件: $SCRIPT_DIR/automation.log"
    else
        echo ""
        echo "✗ 任务执行失败"
    fi
fi

echo ""
echo "================================"
echo "设置完成"
echo "================================"
echo ""
echo "后续操作:"
echo "1. 查看任务: crontab -l"
echo "2. 查看日志: tail -f $SCRIPT_DIR/automation.log"
echo "3. 手动执行: cd $SCRIPT_DIR && python3 $SCRIPT_NAME"
echo "4. 删除任务: crontab -e (删除相关行)"
echo ""
