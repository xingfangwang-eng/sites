# Cron Job 配置说明

## 📅 定时任务配置

### Linux/Mac 系统（使用 crontab）

#### 1. 打开 crontab 编辑器

```bash
crontab -e
```

#### 2. 添加定时任务

```bash
# 每天晚上 23:00 执行自动化任务
0 23 * * * cd /path/to/saas && /usr/bin/python3 daily_automation.py >> automation.log 2>&1

# 或者每天凌晨 2:00 执行
0 2 * * * cd /path/to/saas && /usr/bin/python3 daily_automation.py >> automation.log 2>&1
```

#### 3. 保存并退出

- Vim: 按 `Esc`，输入 `:wq`，按 `Enter`
- Nano: 按 `Ctrl+O` 保存，按 `Ctrl+X` 退出

#### 4. 查看定时任务

```bash
crontab -l
```

#### 5. 查看执行日志

```bash
tail -f automation.log
```


### Windows 系统（使用任务计划程序）

#### 方法一：使用任务计划程序（GUI）

1. **打开任务计划程序**
   - 按 `Win + R`，输入 `taskschd.msc`，按 `Enter`

2. **创建基本任务**
   - 点击右侧"创建基本任务"
   - 名称：`每日站点自动化`
   - 描述：`每天晚上自动更新站点并提交到 Google`

3. **设置触发器**
   - 选择"每天"
   - 设置时间：`23:00:00`
   - 点击"下一步"

4. **设置操作**
   - 选择"启动程序"
   - 程序或脚本：`python`
   - 添加参数：`daily_automation.py`
   - 起始于：`E:\kaifa\saas`
   - 点击"下一步"

5. **完成设置**
   - 勾选"当单击'完成'时，打开此任务属性的对话框"
   - 点击"完成"

#### 方法二：使用 PowerShell 脚本

创建 `setup_scheduled_task.ps1` 文件：

```powershell
# 创建定时任务
$action = New-ScheduledTaskAction -Execute "python" -Argument "daily_automation.py" -WorkingDirectory "E:\kaifa\saas"
$trigger = New-ScheduledTaskTrigger -Daily -At 11pm
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -DontStopOnIdleEnd
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERNAME" -LogonType Interactive -RunLevel Highest

Register-ScheduledTask -TaskName "DailySiteAutomation" -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "每天晚上自动更新站点并提交到 Google"
```

运行脚本：

```powershell
powershell -ExecutionPolicy Bypass -File setup_scheduled_task.ps1
```


### Docker 容器（使用 cron）

#### 1. 创建 Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# 安装 cron
RUN apt-get update && apt-get install -y cron

# 复制脚本
COPY *.py ./
COPY sites_list.json ./

# 安装依赖
RUN pip install requests

# 添加 cron 任务
RUN echo "0 23 * * * cd /app && python daily_automation.py >> /var/log/automation.log 2>&1" > /etc/cron.d/daily-automation
RUN chmod 0644 /etc/cron.d/daily-automation
RUN crontab /etc/cron.d/daily-automation

# 创建日志文件
RUN touch /var/log/automation.log

# 启动 cron
CMD ["cron", "-f"]
```

#### 2. 构建并运行

```bash
docker build -t site-automation .
docker run -d --name automation site-automation
```

#### 3. 查看日志

```bash
docker exec -it automation tail -f /var/log/automation.log
```


## 🔧 配置环境变量

### Google Search Console API（可选）

如果需要使用 Google Search Console API，需要配置：

```bash
# Linux/Mac
export GOOGLE_SEARCH_CONSOLE_API_KEY="your_api_key_here"
export MAIN_SITE_URL="https://wangdadi.xyz"

# Windows
set GOOGLE_SEARCH_CONSOLE_API_KEY=your_api_key_here
set MAIN_SITE_URL=https://wangdadi.xyz
```

### 获取 API Key

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目或选择现有项目
3. 启用 Search Console API
4. 创建凭证（API Key 或 OAuth2）
5. 复制 API Key


## 📊 监控和日志

### 日志文件位置

- `automation.log` - 主自动化任务日志
- `google_submit.log` - Google 提交日志

### 查看日志

```bash
# 实时查看日志
tail -f automation.log

# 查看最近 100 行
tail -n 100 automation.log

# 搜索错误
grep "错误" automation.log
grep "ERROR" automation.log
```

### 日志轮转

创建 `/etc/logrotate.d/site-automation`：

```
/path/to/saas/automation.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0644 user group
}
```


## ⚙️ 手动执行

如果需要手动执行：

```bash
# 执行完整流程
python daily_automation.py

# 只生成静态 HTML
python generate_static_html.py

# 只提交到 Google
python push_to_google.py
```


## 🔍 故障排除

### 问题：定时任务没有执行

**解决方案：**
1. 检查 cron 服务是否运行：`systemctl status cron`
2. 检查脚本路径是否正确
3. 检查 Python 路径：`which python3`
4. 查看系统日志：`grep CRON /var/log/syslog`

### 问题：权限不足

**解决方案：**
```bash
# 给脚本添加执行权限
chmod +x daily_automation.py
chmod +x generate_static_html.py
chmod +x push_to_google.py
```

### 问题：Python 模块缺失

**解决方案：**
```bash
pip install requests
```

### 问题：Windows 任务计划程序不执行

**解决方案：**
1. 检查 Python 是否在 PATH 中
2. 使用完整路径：`C:\Python39\python.exe`
3. 检查工作目录设置
4. 查看任务历史记录


## 📧 邮件通知（可选）

如果希望在任务完成后收到邮件通知，可以修改 `daily_automation.py`：

```python
import smtplib
from email.mime.text import MIMEText

def send_email(subject: str, body: str):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = 'your_email@gmail.com'
    msg['To'] = 'recipient@example.com'
    
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login('your_email@gmail.com', 'your_password')
        server.send_message(msg)
```


## 🎯 最佳实践

1. **测试脚本** - 先手动执行确保脚本正常工作
2. **设置日志** - 记录所有执行结果
3. **监控错误** - 定期检查日志文件
4. **备份数据** - 定期备份 `sites_list.json`
5. **环境变量** - 使用环境变量存储敏感信息
6. **错误处理** - 脚本中添加完善的错误处理
7. **通知机制** - 重要错误时发送通知


## 📞 技术支持

如有问题，请联系：
- Email: 457239850@qq.com
