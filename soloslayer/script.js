document.addEventListener('DOMContentLoaded', () => {
    const currentRoleDisplay = document.getElementById('current-role');
    const timerDisplay = document.getElementById('timer');
    const hiddenCostDisplay = document.getElementById('hidden-cost');
    const focusScoreDisplay = document.getElementById('focus-score');
    const contextDebtDisplay = document.getElementById('context-debt');
    const switchRatioDisplay = document.getElementById('switch-ratio');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const unloadTextarea = document.getElementById('unload-textarea');
    const unloadBtn = document.getElementById('unload-btn');
    const roleBtns = document.querySelectorAll('.role-btn');
    const roleNames = document.querySelectorAll('.role-name');
    const rolePoints = document.querySelectorAll('.role-points');
    const generateBtn = document.getElementById('generate-btn');
    const exportBtn = document.getElementById('export-btn');
    const emptyState = document.getElementById('empty-state');
    const priorityGroups = document.querySelectorAll('.priority-group');
    const priorityBadges = document.querySelectorAll('.priority-badge.sortable');
    const logBtn = document.getElementById('log-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.getElementById('sidebar-content');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const reportBtn = document.getElementById('report-btn');
    const reportModalOverlay = document.getElementById('report-modal-overlay');
    const reportModalClose = document.getElementById('report-modal-close');
    const reportModalBody = document.getElementById('report-modal-body');
    const completedTasksList = document.getElementById('completed-tasks-list');
    const efficiencySummary = document.getElementById('efficiency-summary');
    const generateReportBtn = document.getElementById('generate-report-btn');
    const copyReportBtn = document.getElementById('copy-report-btn');
    const reportMarkdown = document.getElementById('report-markdown');

    const STATE_KEY = 'soloslayer_state';
    const TASKS_KEY = 'soloslayer_tasks';
    const LAST_DATE_KEY = 'soloslayer_last_date';
    const ROLE_NAMES_KEY = 'soloslayer_role_names';
    const ROLE_POINTS_KEY = 'soloslayer_role_points';
    const SWITCH_HISTORY_KEY = 'soloslayer_switch_history';

    const taskTemplates = {
        Product: {
            'task-a1': { text: 'Complete product requirements draft', priority: 'A' },
            'task-a2': { text: 'Define core feature user stories', priority: 'A' },
            'task-a3': { text: 'Plan Q2 product roadmap', priority: 'A' },
            'task-b1': { text: 'Analyze competitor feature differences', priority: 'B' },
            'task-b2': { text: 'Design new feature prototype', priority: 'B' },
            'task-c1': { text: 'Archive product documentation', priority: 'C' }
        },
        Developer: {
            'task-a1': { text: 'Fix login flow bug', priority: 'A' },
            'task-a2': { text: 'Optimize homepage loading performance', priority: 'A' },
            'task-a3': { text: 'Implement payment integration', priority: 'A' },
            'task-b1': { text: 'Write unit test cases', priority: 'B' },
            'task-b2': { text: 'Refactor core module code', priority: 'B' },
            'task-c1': { text: 'Backup database', priority: 'C' }
        },
        Marketing: {
            'task-a1': { text: 'Publish 3 Twitter growth posts', priority: 'A' },
            'task-a2': { text: 'Reply to potential client inquiries', priority: 'A' },
            'task-a3': { text: 'Update website marketing copy', priority: 'A' },
            'task-b1': { text: 'Analyze last week traffic data', priority: 'B' },
            'task-b2': { text: 'Plan next week promotion campaign', priority: 'B' },
            'task-c1': { text: 'Archive marketing materials', priority: 'C' }
        }
    };

    const defaultRoleNames = {
        Product: 'Product',
        Developer: 'Developer',
        Marketing: 'Marketing'
    };

    const defaultState = {
        currentRole: 'Product',
        roles: {
            Product: { activeSeconds: 0, currentSessionSeconds: 0 },
            Developer: { activeSeconds: 0, currentSessionSeconds: 0 },
            Marketing: { activeSeconds: 0, currentSessionSeconds: 0 }
        },
        switchingSeconds: 0,
        todayHiddenCost: 0,
        totalSwitchCount: 0,
        totalSwitchingSeconds: 0,
        lastUpdate: Date.now()
    };

    const state = loadState();
    const tasks = loadTasks();
    const roleNamesMap = loadRoleNames();
    const rolePointsMap = loadRolePoints();
    const switchHistory = loadSwitchHistory();
    let activeTimer = null;
    let switchingTimer = null;
    let switchStartTime = null;
    let pendingFromRole = null;

    function getTodayString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    function loadState() {
        try {
            const saved = localStorage.getItem(STATE_KEY);
            if (saved) {
                const savedState = JSON.parse(saved);
                const lastDate = localStorage.getItem(LAST_DATE_KEY);
                if (lastDate !== getTodayString()) {
                    return { ...defaultState };
                }
                return { ...defaultState, ...savedState };
            }
        } catch (e) {
            console.error('Failed to load state:', e);
        }
        return { ...defaultState };
    }

    function loadTasks() {
        try {
            const saved = localStorage.getItem(TASKS_KEY);
            if (saved) {
                const savedTasks = JSON.parse(saved);
                const lastDate = localStorage.getItem(LAST_DATE_KEY);
                if (lastDate !== getTodayString()) {
                    return { ...taskTemplates };
                }
                return savedTasks;
            }
        } catch (e) {
            console.error('Failed to load tasks:', e);
        }
        return { ...taskTemplates };
    }

    function loadRoleNames() {
        try {
            const saved = localStorage.getItem(ROLE_NAMES_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load role names:', e);
        }
        return { ...defaultRoleNames };
    }

    function loadRolePoints() {
        try {
            const saved = localStorage.getItem(ROLE_POINTS_KEY);
            if (saved) {
                const savedPoints = JSON.parse(saved);
                const lastDate = localStorage.getItem(LAST_DATE_KEY);
                if (lastDate !== getTodayString()) {
                    return { Product: 0, Developer: 0, Marketing: 0 };
                }
                return savedPoints;
            }
        } catch (e) {
            console.error('Failed to load role points:', e);
        }
        return { Product: 0, Developer: 0, Marketing: 0 };
    }

    function saveState() {
        try {
            state.lastUpdate = Date.now();
            localStorage.setItem(STATE_KEY, JSON.stringify(state));
            localStorage.setItem(LAST_DATE_KEY, getTodayString());
        } catch (e) {
            console.error('Failed to save state:', e);
        }
    }

    function saveTasks() {
        try {
            localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
            localStorage.setItem(LAST_DATE_KEY, getTodayString());
        } catch (e) {
            console.error('Failed to save tasks:', e);
        }
    }

    function saveRoleNames() {
        try {
            localStorage.setItem(ROLE_NAMES_KEY, JSON.stringify(roleNamesMap));
        } catch (e) {
            console.error('Failed to save role names:', e);
        }
    }

    function saveRolePoints() {
        try {
            localStorage.setItem(ROLE_POINTS_KEY, JSON.stringify(rolePointsMap));
            localStorage.setItem(LAST_DATE_KEY, getTodayString());
        } catch (e) {
            console.error('Failed to save role points:', e);
        }
    }

    function loadSwitchHistory() {
        try {
            const saved = localStorage.getItem(SWITCH_HISTORY_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load switch history:', e);
        }
        return [];
    }

    function saveSwitchHistory() {
        try {
            localStorage.setItem(SWITCH_HISTORY_KEY, JSON.stringify(switchHistory));
        } catch (e) {
            console.error('Failed to save switch history:', e);
        }
    }

    function formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function addSwitchLog(fromRole, toRole, content) {
        const now = new Date();
        const logEntry = {
            id: Date.now(),
            timestamp: now.toISOString(),
            fromRole: fromRole,
            toRole: toRole,
            content: content.trim(),
            duration: state.roles[fromRole].currentSessionSeconds
        };
        switchHistory.unshift(logEntry);
        
        if (switchHistory.length > 50) {
            switchHistory.pop();
        }
        
        saveSwitchHistory();
        updateSidebarContent();
    }

    function updateSidebarContent() {
        if (switchHistory.length === 0) {
            sidebarContent.innerHTML = '<div class="empty-log">No switch records yet</div>';
            return;
        }

        let html = '';
        switchHistory.forEach(entry => {
            const date = new Date(entry.timestamp);
            const durationMinutes = Math.floor(entry.duration / 60);
            const durationSeconds = entry.duration % 60;
            const durationStr = durationMinutes > 0 
                ? `${durationMinutes}m${durationSeconds}s` 
                : `${durationSeconds}s`;
            
            html += `
                <div class="log-entry">
                    <div class="log-timestamp">${formatTime(date)}</div>
                    <div class="log-transition">
                        <span class="log-from">[${roleNamesMap[entry.fromRole] || entry.fromRole}]</span>
                        <span class="log-arrow">-></span>
                        <span class="log-to">[${roleNamesMap[entry.toRole] || entry.toRole}]</span>
                        <span class="log-duration">(${durationStr})</span>
                    </div>
                    <div class="log-content">${entry.content || 'No offloading content recorded'}</div>
                </div>
            `;
        });
        
        sidebarContent.innerHTML = html;
    }

    function openSidebar() {
        updateSidebarContent();
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }

    function openReportModal() {
        reportModalOverlay.classList.add('active');
        updateChartBars();
        updateCompletedTasks();
    }

    function closeReportModal() {
        reportModalOverlay.classList.remove('active');
    }

    function updateChartBars() {
        const totalSeconds = Object.values(state.roles).reduce((sum, role) => sum + role.activeSeconds, 0);
        
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach(bar => {
            const role = bar.dataset.role;
            const seconds = state.roles[role]?.activeSeconds || 0;
            const percentage = totalSeconds > 0 ? Math.round((seconds / totalSeconds) * 100) : 0;
            const barFill = bar.querySelector('.bar-fill');
            const barPercentage = bar.querySelector('.bar-percentage');
            
            barFill.style.width = `${percentage}%`;
            barPercentage.textContent = `${percentage}%`;
        });
    }

    function updateCompletedTasks() {
        const completedTasks = [];
        
        Object.keys(tasks).forEach(role => {
            const roleTasks = tasks[role];
            Object.keys(roleTasks).forEach(taskId => {
                const task = roleTasks[taskId];
                if (task.priority === 'A') {
                    const checkbox = document.getElementById(taskId);
                    if (checkbox && checkbox.checked) {
                        completedTasks.push({
                            text: task.text,
                            role: role
                        });
                    }
                }
            });
        });
        
        if (completedTasks.length === 0) {
            completedTasksList.innerHTML = '<li class="no-tasks">No completed Priority A tasks</li>';
        } else {
            let html = '';
            completedTasks.forEach(task => {
                html += `<li>✓ ${task.text} (${roleNamesMap[task.role] || task.role})</li>`;
            });
            completedTasksList.innerHTML = html;
        }
    }

    function generateEfficiencySummary() {
        const totalSeconds = Object.values(state.roles).reduce((sum, role) => sum + role.activeSeconds, 0);
        const switchRatio = parseFloat(calculateSwitchRatio());
        const focusScore = calculateFocusScore();
        
        let topRole = null;
        let maxSeconds = 0;
        Object.keys(state.roles).forEach(role => {
            if (state.roles[role].activeSeconds > maxSeconds) {
                maxSeconds = state.roles[role].activeSeconds;
                topRole = role;
            }
        });
        
        let summary = '';
        
        if (topRole) {
            summary += `Today **${roleNamesMap[topRole] || topRole}** role contributed the most, `;
        }
        
        if (switchRatio < 10) {
            summary += `Context Debt controlled within **${switchRatio}%** - Excellent performance.`;
        } else if (switchRatio < 20) {
            summary += `Context Debt at **${switchRatio}%** - Good performance, keep it up.`;
        } else if (switchRatio < 30) {
            summary += `Context Debt at **${switchRatio}%** - Need to reduce role switches.`;
        } else {
            summary += `Context Debt high at **${switchRatio}%** - Recommend focusing on single role.`;
        }
        
        summary += ` Focus Score: **${focusScore}/100**.`;
        
        if (state.totalSwitchCount > 5) {
            summary += ` ${state.totalSwitchCount} switches today, recommend optimizing workflow.`;
        }
        
        return summary;
    }

    function generateMarkdownReport() {
        const today = getTodayString();
        const totalSeconds = Object.values(state.roles).reduce((sum, role) => sum + role.activeSeconds, 0);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        
        let markdown = `# 📊 SoloSlayer Daily Report\n\n`;
        markdown += `**Date**: ${today}\n\n`;
        
        markdown += `## ⏱️ Work Duration\n`;
        markdown += `Today's total work **${hours}h ${minutes}m**\n\n`;
        
        markdown += `## 📈 Role Distribution\n`;
        Object.keys(state.roles).forEach(role => {
            const seconds = state.roles[role].activeSeconds;
            const percentage = totalSeconds > 0 ? Math.round((seconds / totalSeconds) * 100) : 0;
            const roleHours = Math.floor(seconds / 3600);
            const roleMinutes = Math.floor((seconds % 3600) / 60);
            markdown += `- **${roleNamesMap[role] || role}**: ${roleHours}h${roleMinutes}m (${percentage}%)\n`;
        });
        markdown += '\n';
        
        const completedTasks = [];
        Object.keys(tasks).forEach(role => {
            const roleTasks = tasks[role];
            Object.keys(roleTasks).forEach(taskId => {
                const task = roleTasks[taskId];
                if (task.priority === 'A') {
                    const checkbox = document.getElementById(taskId);
                    if (checkbox && checkbox.checked) {
                        completedTasks.push(task.text);
                    }
                }
            });
        });
        
        markdown += `## ✅ Completed Priority A Tasks\n`;
        if (completedTasks.length === 0) {
            markdown += `No completed Priority A tasks\n\n`;
        } else {
            completedTasks.forEach(task => {
                markdown += `- ✅ ${task}\n`;
            });
            markdown += '\n';
        }
        
        markdown += `## 📝 Efficiency Summary\n`;
        markdown += generateEfficiencySummary();
        markdown += '\n\n';
        
        markdown += `---\n`;
        markdown += `*Measured by SoloSlayer - Context Switching Killer.*`;
        
        return markdown;
    }

    function generateReport() {
        const summary = generateEfficiencySummary();
        efficiencySummary.textContent = summary;
        
        const markdown = generateMarkdownReport();
        reportMarkdown.value = markdown;
    }

    async function copyReport() {
        try {
            await navigator.clipboard.writeText(reportMarkdown.value);
            alert('Markdown report copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Copy failed, please copy manually');
        }
    }

    function saveRolePoints() {
        try {
            localStorage.setItem(ROLE_POINTS_KEY, JSON.stringify(rolePointsMap));
            localStorage.setItem(LAST_DATE_KEY, getTodayString());
        } catch (e) {
            console.error('Failed to save role points:', e);
        }
    }

    function updateRoleNamesDisplay() {
        roleNames.forEach(span => {
            const originalRole = span.dataset.role;
            span.textContent = roleNamesMap[originalRole] || originalRole;
        });
        currentRoleDisplay.textContent = roleNamesMap[state.currentRole] || state.currentRole;
    }

    function updateRolePointsDisplay() {
        rolePoints.forEach(span => {
            const roleBtn = span.closest('.role-btn');
            const originalRole = roleBtn.dataset.role;
            span.textContent = `${rolePointsMap[originalRole] || 0} Points`;
        });
    }

    function startActiveTimer() {
        if (activeTimer) clearInterval(activeTimer);
        activeTimer = setInterval(() => {
            state.roles[state.currentRole].activeSeconds++;
            state.roles[state.currentRole].currentSessionSeconds++;
            updateTimerDisplay();
            updateEfficiencyMetrics();
        }, 1000);
    }

    function stopActiveTimer() {
        if (activeTimer) {
            clearInterval(activeTimer);
            activeTimer = null;
        }
    }

    function startSwitchingTimer() {
        if (switchingTimer) clearInterval(switchingTimer);
        state.switchingSeconds = 0;
        switchingTimer = setInterval(() => {
            state.switchingSeconds++;
            state.totalSwitchingSeconds++;
            updateEfficiencyMetrics();
        }, 1000);
    }

    function stopSwitchingTimer() {
        if (switchingTimer) {
            clearInterval(switchingTimer);
            switchingTimer = null;
        }
    }

    function updateTimerDisplay() {
        const totalSeconds = state.roles[state.currentRole].activeSeconds;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function updateHiddenCostDisplay() {
        const costPerSecond = 0.05;
        const switchingCost = Math.floor(state.switchingSeconds * costPerSecond);
        const totalCost = state.todayHiddenCost + switchingCost;
        hiddenCostDisplay.textContent = `$${totalCost.toLocaleString()}.00`;
    }

    function calculateFocusScore() {
        const totalActiveSeconds = Object.values(state.roles).reduce((sum, role) => sum + role.activeSeconds, 0);
        const deepWorkBonus = calculateDeepWorkBonus();
        const switchPenalty = calculateSwitchPenalty();
        
        let baseScore = totalActiveSeconds > 0 ? Math.min(100, totalActiveSeconds / 36) : 0;
        let score = baseScore + deepWorkBonus - switchPenalty;
        
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    function calculateDeepWorkBonus() {
        const BONUS_THRESHOLD = 45 * 60;
        const MAX_BONUS = 25;
        let bonus = 0;
        
        Object.values(state.roles).forEach(role => {
            const sessions = Math.floor(role.activeSeconds / BONUS_THRESHOLD);
            bonus += sessions * 5;
        });
        
        return Math.min(bonus, MAX_BONUS);
    }

    function calculateSwitchPenalty() {
        const SWITCH_PENALTY = 5;
        const FREQUENT_SWITCH_THRESHOLD = 3;
        
        let penalty = state.totalSwitchCount * SWITCH_PENALTY;
        
        if (state.totalSwitchCount > FREQUENT_SWITCH_THRESHOLD) {
            penalty += (state.totalSwitchCount - FREQUENT_SWITCH_THRESHOLD) * 3;
        }
        
        return penalty;
    }

    function calculateContextDebtMinutes() {
        const MIN_SWITCH_TIME = 15 * 60;
        let totalDebt = state.totalSwitchingSeconds;
        
        if (state.totalSwitchCount > 0) {
            totalDebt += state.totalSwitchCount * MIN_SWITCH_TIME;
        }
        
        return Math.floor(totalDebt / 60);
    }

    function calculateSwitchRatio() {
        const totalActiveSeconds = Object.values(state.roles).reduce((sum, role) => sum + role.activeSeconds, 0);
        const totalTime = totalActiveSeconds + state.totalSwitchingSeconds;
        
        if (totalTime === 0) return 0;
        
        return ((state.totalSwitchingSeconds / totalTime) * 100).toFixed(1);
    }

    function updateEfficiencyMetrics() {
        const focusScore = calculateFocusScore();
        const contextDebtMinutes = calculateContextDebtMinutes();
        const switchRatio = calculateSwitchRatio();

        focusScoreDisplay.textContent = focusScore;
        
        contextDebtDisplay.textContent = `${contextDebtMinutes} min`;
        if (contextDebtMinutes >= 60) {
            contextDebtDisplay.style.color = '#ff4444';
        } else if (contextDebtMinutes >= 30) {
            contextDebtDisplay.style.color = '#ffaa00';
        } else {
            contextDebtDisplay.style.color = '#00ff00';
        }
        
        switchRatioDisplay.textContent = `${switchRatio}%`;
        updateHiddenCostDisplay();
    }

    function checkUnloadValid() {
        const isValid = unloadTextarea.value.length > 20;
        modalCloseBtn.disabled = !isValid;
        modalCloseBtn.style.opacity = isValid ? '1' : '0.5';
        modalCloseBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }

    function switchRole(targetRole) {
        if (targetRole === state.currentRole) return;

        stopActiveTimer();
        
        pendingFromRole = state.currentRole;
        switchStartTime = Date.now();
        
        unloadTextarea.value = '';
        checkUnloadValid();
        modalOverlay.classList.add('active');
        unloadTextarea.focus();
        
        startSwitchingTimer();
    }

    function confirmSwitch(targetRole) {
        stopSwitchingTimer();
        
        state.todayHiddenCost += Math.floor(state.switchingSeconds * 0.05);
        state.totalSwitchCount++;
        state.switchingSeconds = 0;
        
        if (pendingFromRole) {
            addSwitchLog(pendingFromRole, targetRole, unloadTextarea.value);
            pendingFromRole = null;
        }
        
        Object.keys(state.roles).forEach(role => {
            if (role !== targetRole) {
                state.roles[role].currentSessionSeconds = 0;
            }
        });
        
        modalOverlay.classList.remove('active');
        unloadTextarea.value = '';
        
        state.currentRole = targetRole;
        currentRoleDisplay.textContent = roleNamesMap[targetRole] || targetRole;
        
        roleBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.role === targetRole);
        });
        
        updateEfficiencyMetrics();
        startActiveTimer();
    }

    function generateTodayTasks() {
        const lastDate = localStorage.getItem(LAST_DATE_KEY);
        if (lastDate === getTodayString()) {
            alert("Today's tasks have already been generated! Come back tomorrow.");
            return;
        }

        Object.keys(taskTemplates).forEach(role => {
            tasks[role] = { ...taskTemplates[role] };
        });

        rolePointsMap.Product = 0;
        rolePointsMap.Developer = 0;
        rolePointsMap.Marketing = 0;

        localStorage.setItem(LAST_DATE_KEY, getTodayString());
        saveTasks();
        saveRolePoints();
        
        location.reload();
    }

    function formatSeconds(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function exportReport() {
        const today = getTodayString();
        let report = `=== SoloSlayer Report ${today} ===\n\n`;
        
        report += '[Role Configuration]\n';
        Object.entries(roleNamesMap).forEach(([key, value]) => {
            report += `${key}: ${value} (${rolePointsMap[key] || 0} points)\n`;
        });
        report += '\n';

        report += '[Role Time Statistics]\n';
        let totalActiveSeconds = 0;
        Object.keys(state.roles).forEach(role => {
            const secs = state.roles[role].activeSeconds;
            totalActiveSeconds += secs;
            report += `${roleNamesMap[role] || role}: ${formatSeconds(secs)}\n`;
        });
        report += `Total Active Time: ${formatSeconds(totalActiveSeconds)}\n\n`;

        report += '[Hidden Cost Analysis]\n';
        const costPerSecond = 0.05;
        const switchingCost = Math.floor(state.switchingSeconds * costPerSecond);
        const totalCost = state.todayHiddenCost + switchingCost;
        const costRatio = totalActiveSeconds > 0 
            ? ((totalCost / (totalActiveSeconds * costPerSecond)) * 100).toFixed(1) 
            : '0.0';
        report += `Today's Hidden Cost: $${totalCost.toLocaleString()}\n`;
        report += `Switch Count: ${state.totalSwitchCount} times\n`;
        report += `Switch Duration: ${formatSeconds(state.switchingSeconds)}\n`;
        report += `Cost Ratio: ${costRatio}%\n\n`;

        report += '[Efficiency Metrics]\n';
        report += `Focus Score: ${calculateFocusScore()}/100\n`;
        report += `Context Debt: ${calculateContextDebtMinutes()} min\n`;
        report += `Switch Rate: ${calculateSwitchRatio()}%\n\n`;

        report += '[Task Completion]\n';
        Object.keys(tasks).forEach(role => {
            report += `\n${roleNamesMap[role] || role}:\n`;
            const roleTasks = tasks[role];
            let completed = 0;
            let total = 0;
            Object.keys(roleTasks).forEach(taskId => {
                total++;
                const task = roleTasks[taskId];
                const checkbox = document.getElementById(taskId);
                const isChecked = checkbox ? checkbox.checked : false;
                if (isChecked) completed++;
                report += `  [${isChecked ? '✓' : ' '}] ${task.priority} - ${task.text}\n`;
            });
            report += `  Completed: ${completed}/${total} (${total > 0 ? ((completed / total) * 100).toFixed(0) : '0'}%)\n`;
        });

        report += '\n=== End of Report ===\n';
        report += 'SoloSlayer - Multi-Role System for Solo Founders';

        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SoloSlayer_Report_${today}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function sortByPriority(priority) {
        const taskSection = document.querySelector('.task-section');
        const groups = Array.from(priorityGroups);
        
        groups.sort((a, b) => {
            const priorityOrder = { 'A': 0, 'B': 1, 'C': 2 };
            if (a.dataset.priority === priority) return -1;
            if (b.dataset.priority === priority) return 1;
            return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
        });

        groups.forEach(group => {
            taskSection.appendChild(group);
        });
    }

    function toggleEmptyState() {
        const hasTasks = localStorage.getItem(TASKS_KEY) !== null;
        const lastDate = localStorage.getItem(LAST_DATE_KEY);
        const isToday = lastDate === getTodayString();
        
        priorityGroups.forEach(group => {
            group.style.display = hasTasks && isToday ? 'block' : 'none';
        });
        emptyState.style.display = (hasTasks && isToday) ? 'none' : 'block';
        document.querySelector('.section-title').style.display = (hasTasks && isToday) ? 'block' : 'none';
    }

    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchRole(btn.dataset.role);
        });
    });

    roleNames.forEach(span => {
        span.addEventListener('blur', () => {
            const originalRole = span.dataset.role;
            const newName = span.textContent.trim() || originalRole;
            roleNamesMap[originalRole] = newName;
            saveRoleNames();
            updateRoleNamesDisplay();
        });

        span.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                span.blur();
            }
        });
    });

    priorityBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            const priority = badge.textContent;
            sortByPriority(priority);
        });
    });

    generateBtn.addEventListener('click', generateTodayTasks);
    exportBtn.addEventListener('click', exportReport);
    logBtn.addEventListener('click', openSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    reportBtn.addEventListener('click', openReportModal);
    reportModalClose.addEventListener('click', closeReportModal);
    reportModalOverlay.addEventListener('click', (e) => {
        if (e.target === reportModalOverlay) {
            closeReportModal();
        }
    });
    generateReportBtn.addEventListener('click', generateReport);
    copyReportBtn.addEventListener('click', copyReport);

    unloadTextarea.addEventListener('input', checkUnloadValid);

    modalCloseBtn.addEventListener('click', () => {
        if (!modalCloseBtn.disabled) {
            const targetRole = Array.from(roleBtns).find(b => !b.classList.contains('active'))?.dataset.role;
            if (targetRole) {
                confirmSwitch(targetRole);
            }
        }
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            stopSwitchingTimer();
            modalOverlay.classList.remove('active');
            unloadTextarea.value = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            stopSwitchingTimer();
            modalOverlay.classList.remove('active');
            unloadTextarea.value = '';
        }
    });

    unloadBtn.addEventListener('click', () => {
        unloadTextarea.value = '';
        checkUnloadValid();
        modalOverlay.classList.add('active');
        unloadTextarea.focus();
    });

    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const taskId = checkbox.id;
            const taskItem = checkbox.closest('.task-item');
            const taskRolesSpan = taskItem.querySelector('.task-roles');
            const roles = taskRolesSpan ? taskRolesSpan.textContent.split(',').map(r => r.trim()) : [];
            
            if (checkbox.checked) {
                taskItem.classList.add('completed');
                roles.forEach(role => {
                    if (rolePointsMap[role] !== undefined) {
                        const points = taskItem.dataset.priority === 'A' ? 10 : taskItem.dataset.priority === 'B' ? 5 : 3;
                        rolePointsMap[role] += points;
                    }
                });
                saveRolePoints();
                updateRolePointsDisplay();
            } else {
                taskItem.classList.remove('completed');
                roles.forEach(role => {
                    if (rolePointsMap[role] !== undefined) {
                        const points = taskItem.dataset.priority === 'A' ? 10 : taskItem.dataset.priority === 'B' ? 5 : 3;
                        rolePointsMap[role] = Math.max(0, rolePointsMap[role] - points);
                    }
                });
                saveRolePoints();
                updateRolePointsDisplay();
            }

            Object.keys(tasks).forEach(role => {
                if (tasks[role][taskId]) {
                    tasks[role][taskId].completed = checkbox.checked;
                }
            });
            saveTasks();
        });
    });

    currentRoleDisplay.textContent = roleNamesMap[state.currentRole] || state.currentRole;
    roleBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.role === state.currentRole);
    });

    updateRoleNamesDisplay();
    updateRolePointsDisplay();
    updateTimerDisplay();
    updateEfficiencyMetrics();
    toggleEmptyState();
    startActiveTimer();

    function ensureCanonicalUrl() {
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        const PRODUCTION_DOMAIN = 'https://www.wangdadi.xyz/soloslayer';
        
        if (canonicalLink) {
            canonicalLink.href = PRODUCTION_DOMAIN;
        } else {
            const newCanonical = document.createElement('link');
            newCanonical.rel = 'canonical';
            newCanonical.href = PRODUCTION_DOMAIN;
            document.head.appendChild(newCanonical);
        }
    }

    ensureCanonicalUrl();

    setInterval(() => {
        saveState();
        saveTasks();
        saveRolePoints();
        ensureCanonicalUrl();
    }, 1000);
});