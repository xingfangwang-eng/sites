# Windows 定时任务设置脚本
# 使用方法：以管理员身份运行此脚本

$TaskName = "DailySiteAutomation"
$ScriptPath = "E:\kaifa\saas"
$PythonPath = "python"

Write-Host "================================" -ForegroundColor Green
Write-Host "设置每日站点自动化定时任务" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# 检查是否以管理员身份运行
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "警告: 请以管理员身份运行此脚本" -ForegroundColor Yellow
    Write-Host "右键点击此脚本，选择'以管理员身份运行'" -ForegroundColor Yellow
    Write-Host ""
}

# 检查 Python 是否安装
Write-Host "检查 Python 安装..." -ForegroundColor Cyan
try {
    $pythonVersion = & python --version 2>&1
    Write-Host "✓ Python 已安装: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python 未安装或不在 PATH 中" -ForegroundColor Red
    Write-Host "请先安装 Python: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 检查脚本文件是否存在
Write-Host "检查脚本文件..." -ForegroundColor Cyan
$scripts = @(
    "daily_automation.py",
    "generate_static_html.py",
    "push_to_google.py",
    "sites_list.json"
)

$allFilesExist = $true
foreach ($script in $scripts) {
    $fullPath = Join-Path $ScriptPath $script
    if (Test-Path $fullPath) {
        Write-Host "✓ 找到文件: $script" -ForegroundColor Green
    } else {
        Write-Host "✗ 文件不存在: $script" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "错误: 缺少必要的文件" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 检查是否已存在同名任务
Write-Host "检查现有定时任务..." -ForegroundColor Cyan
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "发现同名任务: $TaskName" -ForegroundColor Yellow
    $response = Read-Host "是否删除并重新创建? (Y/N)"
    
    if ($response -eq 'Y' -or $response -eq 'y') {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "✓ 已删除旧任务" -ForegroundColor Green
    } else {
        Write-Host "操作已取消" -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""

# 创建定时任务
Write-Host "创建定时任务..." -ForegroundColor Cyan

try {
    # 创建任务动作
    $action = New-ScheduledTaskAction `
        -Execute $PythonPath `
        -Argument "daily_automation.py" `
        -WorkingDirectory $ScriptPath
    
    # 创建触发器（每天晚上 23:00）
    $trigger = New-ScheduledTaskTrigger `
        -Daily `
        -At 11pm
    
    # 创建任务设置
    $settings = New-ScheduledTaskSettingsSet `
        -StartWhenAvailable `
        -DontStopOnIdleEnd `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries
    
    # 创建任务主体
    $principal = New-ScheduledTaskPrincipal `
        -UserId "$env:USERNAME" `
        -LogonType Interactive `
        -RunLevel Highest
    
    # 注册任务
    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -Principal $principal `
        -Description "每天晚上自动更新站点并提交到 Google" `
        | Out-Null
    
    Write-Host "✓ 定时任务创建成功" -ForegroundColor Green
    Write-Host ""
    Write-Host "任务详情:" -ForegroundColor Cyan
    Write-Host "  名称: $TaskName"
    Write-Host "  执行时间: 每天 23:00"
    Write-Host "  工作目录: $ScriptPath"
    Write-Host "  执行脚本: daily_automation.py"
    
} catch {
    Write-Host "✗ 创建定时任务失败: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 测试任务
Write-Host "是否立即测试运行任务? (Y/N)" -ForegroundColor Cyan
$testRun = Read-Host

if ($testRun -eq 'Y' -or $testRun -eq 'y') {
    Write-Host ""
    Write-Host "手动执行任务..." -ForegroundColor Cyan
    
    try {
        Start-ScheduledTask -TaskName $TaskName
        Write-Host "✓ 任务已启动" -ForegroundColor Green
        Write-Host "请查看日志文件: $ScriptPath\automation.log" -ForegroundColor Yellow
    } catch {
        Write-Host "✗ 启动任务失败: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "设置完成" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "后续操作:" -ForegroundColor Cyan
Write-Host "1. 查看任务: 打开'任务计划程序'，找到任务 '$TaskName'"
Write-Host "2. 查看日志: $ScriptPath\automation.log"
Write-Host "3. 手动执行: Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "4. 删除任务: Unregister-ScheduledTask -TaskName '$TaskName'"
Write-Host ""
