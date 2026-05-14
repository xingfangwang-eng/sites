document.addEventListener('DOMContentLoaded', function() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }

    var dropZone = document.getElementById('dropZone');
    var runButton = document.getElementById('runButton');
    var fileListBody = document.getElementById('fileListBody');
    var heatmapBody = document.getElementById('heatmapBody');

    runButton.addEventListener('click', function() {
        waitForTypeScript(function() {
            runButton.textContent = 'Running simulation...';
            runButton.disabled = true;
            setTimeout(function() {
                runButton.textContent = 'Run Pressure Simulation';
                runButton.disabled = false;
            }, 2000);
        });
    });

    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', async function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        var items = e.dataTransfer.items;
        if (items && items.length > 0) {
            await handleDataTransferItems(items);
        }
    });

    renderScanHistory();
});

var tsParser = null;
var fileDataList = [];
var fileContents = {};

function waitForTypeScript(callback) {
    if (typeof ts !== 'undefined') {
        tsParser = ts;
        callback();
    } else {
        setTimeout(function() {
            waitForTypeScript(callback);
        }, 100);
    }
}

async function handleDataTransferItems(items) {
    var allFiles = [];

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.kind === 'file') {
            var entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
            if (entry) {
                var files = await readEntry(entry);
                allFiles = allFiles.concat(files);
            } else {
                var file = item.getAsFile();
                if (file) {
                    allFiles.push(file);
                }
            }
        }
    }

    var tsFiles = allFiles.filter(function(file) {
        return file.name.endsWith('.ts') || file.name.endsWith('.tsx');
    });

    if (tsFiles.length > 0) {
        await initParser();
        await processFiles(tsFiles);
    }
}

function readEntry(entry) {
    return new Promise(function(resolve) {
        if (entry.isFile) {
            entry.file(function(file) {
                resolve([file]);
            });
        } else if (entry.isDirectory) {
            var reader = entry.createReader();
            var allFiles = [];
            var readCount = 0;
            var readCallback = function(entries) {
                readCount++;
                var pending = entries.length;
                if (pending === 0) {
                    if (readCount > 1) {
                        readCallback = function() {};
                    }
                    resolve(allFiles);
                    return;
                }
                var pendingCount = pending;
                for (var i = 0; i < entries.length; i++) {
                    (function(entry) {
                        if (entry.isFile) {
                            entry.file(function(file) {
                                allFiles.push(file);
                                pendingCount--;
                                if (pendingCount === 0) {
                                    if (readCount === 1) {
                                        readCallback = function(moreEntries) {
                                            if (moreEntries.length > 0) {
                                                for (var j = 0; j < moreEntries.length; j++) {
                                                    entries.push(moreEntries[j]);
                                                }
                                            }
                                            readCount = 0;
                                            readCallback(entries);
                                        };
                                        readCallback([]);
                                    }
                                }
                            });
                        } else {
                            pendingCount--;
                            if (pendingCount === 0) {
                                if (readCount === 1) {
                                    readCallback = function() {};
                                }
                            }
                        }
                    })(entries[i]);
                }
            };
            reader.readEntries(readCallback);
        } else {
            resolve([]);
        }
    });
}

async function initParser() {
    if (tsParser) return;

    return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.src = 'https://unpkg.com/typescript@latest/lib/typescript.js';
        script.onload = function() {
            tsParser = TypeScript;
            resolve();
        };
        script.onerror = function() {
            tsParser = null;
            resolve();
        };
        document.head.appendChild(script);
    });
}

async function processFiles(files) {
    fileDataList = [];
    fileContents = {};

    var processedCount = 0;
    var batchSize = 3;

    function processBatch() {
        return new Promise(function(resolve) {
            requestIdleCallback(async function(deadline) {
                while (processedCount < files.length && deadline.timeRemaining() > 0) {
                    var endIndex = Math.min(processedCount + batchSize, files.length);
                    
                    for (var i = processedCount; i < endIndex; i++) {
                        var file = files[i];
                        var content = await readFileContent(file);
                        fileContents[file.name] = content;
                        var stats = analyzeContent(content, file.name);
                        var pressureResult = calculateTSServerPressure(content);
                        fileDataList.push({
                            name: file.name,
                            lines: stats.lines,
                            characters: stats.characters,
                            importCount: stats.importCount,
                            imports: stats.imports,
                            typeAliasCount: stats.typeAliasCount,
                            interfaceCount: stats.interfaceCount,
                            genericDepth: stats.genericDepth,
                            complexity: calculateComplexity(stats),
                            pressureResult: pressureResult,
                            issues: stats.issues,
                            hasCycle: false
                        });
                    }
                    
                    processedCount = endIndex;
                    
                    renderFileList(fileDataList);
                    renderHeatmap(fileDataList);
                    renderSuggestions(fileDataList);
                }

                if (processedCount < files.length) {
                    setTimeout(processBatch, 50);
                } else {
                    detectCycles();
                    saveToLocalStorage();
                    renderScanHistory();
                    renderComparison();
                    resolve();
                }
            });
        });
    }

    await processBatch();
}

function readFileContent(file) {
    return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function() {
            resolve('');
        };
        reader.readAsText(file);
    });
}

function analyzeContent(content, fileName) {
    var lines = content.split('\n').length;
    var characters = content.length;
    var importCount = 0;
    var imports = [];

    var importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
    var match;
    while ((match = importRegex.exec(content)) !== null) {
        importCount++;
        imports.push(match[1]);
    }

    var typeAliasCount = 0;
    var interfaceCount = 0;
    var genericDepth = 0;
    var maxGenericDepth = 0;

    var issues = {
        critical: [],
        warning: [],
        info: []
    };

    var giantInterfaces = [];
    var giantTypes = [];
    var deepIntersections = [];
    var nonConstEnums = [];

    if (tsParser) {
        try {
            var sourceFile = tsParser.createSourceFile(
                fileName,
                content,
                tsParser.ScriptTarget.Latest,
                true,
                tsParser.ScriptKind.TSX
            );

            function visit(node) {
                if (tsParser.SyntaxKind[node.kind] === 'TypeAliasDeclaration') {
                    typeAliasCount++;
                    if (node.type && node.type.kind === tsParser.SyntaxKind.TypeLiteral) {
                        var members = node.type.members;
                        if (members && members.length > 20) {
                            giantTypes.push(node.name.getText());
                        }
                    }
                }

                if (tsParser.SyntaxKind[node.kind] === 'InterfaceDeclaration') {
                    interfaceCount++;
                    var members = node.members;
                    if (members && members.length > 20) {
                        giantInterfaces.push(node.name.getText());
                    }
                }

                if (node.kind === tsParser.SyntaxKind.IntersectionTypeNode) {
                    var depth = countIntersectionDepth(node);
                    if (depth > 3) {
                        deepIntersections.push({ depth: depth, text: node.getText() });
                    }
                }

                if (tsParser.SyntaxKind[node.kind] === 'EnumDeclaration') {
                    if (!node.constKeyword) {
                        nonConstEnums.push(node.name.getText());
                    }
                }

                if (node.kind === tsParser.SyntaxKind.TypeReference ||
                    node.kind === tsParser.SyntaxKind.ArrayTypeNode ||
                    node.kind === tsParser.SyntaxKind.TupleTypeNode) {
                    var depth = countGenericDepth(node);
                    if (depth > maxGenericDepth) {
                        maxGenericDepth = depth;
                    }
                }

                tsParser.forEachChild(node, visit);
            }

            function countGenericDepth(node) {
                var depth = 0;
                if (node.typeArguments && node.typeArguments.length > 0) {
                    depth = 1;
                    for (var i = 0; i < node.typeArguments.length; i++) {
                        var childDepth = countGenericDepth(node.typeArguments[i]);
                        if (childDepth + 1 > depth) {
                            depth = childDepth + 1;
                        }
                    }
                } else if (node.elementType) {
                    depth = 1 + countGenericDepth(node.elementType);
                }
                return depth;
            }

            function countIntersectionDepth(node) {
                var depth = 1;
                if (node.types) {
                    for (var i = 0; i < node.types.length; i++) {
                        var child = node.types[i];
                        if (child.kind === tsParser.SyntaxKind.IntersectionTypeNode) {
                            var childDepth = countIntersectionDepth(child);
                            if (childDepth + 1 > depth) {
                                depth = childDepth + 1;
                            }
                        }
                    }
                }
                return depth;
            }

            visit(sourceFile);
            genericDepth = maxGenericDepth;

            if (giantInterfaces.length > 0) {
                issues.critical.push('Giant Interface: ' + giantInterfaces.join(', ') + ' (>20 members)');
            }
            if (giantTypes.length > 0) {
                issues.warning.push('Giant Type: ' + giantTypes.join(', ') + ' (>20 members)');
            }
            if (deepIntersections.length > 0) {
                issues.warning.push('Deep Intersection Types: ' + deepIntersections.length + ' (nesting depth > 3)');
            }
            if (nonConstEnums.length > 0) {
                issues.info.push('Non-const enum: ' + nonConstEnums.join(', ') + ' (consider using const enum)');
            }
            if (maxGenericDepth > 3) {
                issues.warning.push('Deep Generic Nesting: max depth ' + maxGenericDepth);
            }

        } catch (e) {
        }
    }

    return {
        lines: lines,
        characters: characters,
        importCount: importCount,
        imports: imports,
        typeAliasCount: typeAliasCount,
        interfaceCount: interfaceCount,
        genericDepth: genericDepth,
        issues: issues
    };
}

function calculateComplexity(stats) {
    var complexity = 1;
    complexity += Math.floor(stats.lines / 100);
    complexity += stats.importCount;
    complexity += stats.typeAliasCount * 2;
    complexity += stats.interfaceCount * 2;
    complexity += stats.genericDepth * 3;
    return Math.min(complexity, 10);
}

function detectCycles() {
    if (fileDataList.length < 2) return;

    var graph = {};
    var fileNameMap = {};

    for (var i = 0; i < fileDataList.length; i++) {
        var file = fileDataList[i];
        var baseName = file.name.replace(/\.(ts|tsx)$/, '');
        fileNameMap[baseName] = file;
        graph[baseName] = [];

        if (file.imports) {
            for (var j = 0; j < file.imports.length; j++) {
                var imported = file.imports[j];
                var importedBase = imported.replace(/\.(ts|tsx)$/, '');
                if (fileNameMap[importedBase]) {
                    graph[baseName].push(importedBase);
                }
            }
        }
    }

    var visited = {};
    var recStack = {};
    var cycles = [];

    function dfs(node, path) {
        if (!visited[node]) {
            visited[node] = true;
            recStack[node] = true;

            if (graph[node]) {
                for (var k = 0; k < graph[node].length; k++) {
                    var neighbor = graph[node][k];
                    if (!visited[neighbor]) {
                        var newPath = path.concat([neighbor]);
                        var cycle = dfs(neighbor, newPath);
                        if (cycle) return cycle;
                    } else if (recStack[neighbor]) {
                        var cycleStart = path.indexOf(neighbor);
                        if (cycleStart !== -1) {
                            return path.slice(cycleStart).concat([neighbor]);
                        }
                    }
                }
            }
        }
        recStack[node] = false;
        return null;
    }

    for (var name in graph) {
        if (!visited[name]) {
            var cycle = dfs(name, [name]);
            if (cycle) {
                cycles.push(cycle);
            }
        }
    }

    for (var c = 0; c < cycles.length; c++) {
        var cycle = cycles[c];
        for (var f = 0; f < cycle.length; f++) {
            var cycleFile = fileNameMap[cycle[f]];
            if (cycleFile) {
                cycleFile.hasCycle = true;
                if (!cycleFile.issues) cycleFile.issues = { critical: [], warning: [], info: [] };
                if (cycleFile.issues.critical.indexOf('Circular Dependency') === -1) {
                    cycleFile.issues.critical.push('Circular Dependency: ' + cycle.join(' -> '));
                }
            }
        }
    }

    if (cycles.length > 0) {
        console.log('Detected circular dependencies:', cycles);
    }
}

function calculateTSServerPressure(code) {
    var result = {
        nestedGenerics: 0,
        complexUnionTypes: 0,
        anyUsage: 0,
        circularImports: 0,
        avgParseTime: 0,
        crashIndex: 0,
        scoreBreakdown: {
            nestedGenerics: 0,
            complexUnionTypes: 0,
            anyUsage: 0,
            circularImports: 0
        }
    };

    if (!tsParser || !code) {
        return result;
    }

    var nestedGenericRegex = /<[^<>]+<[^<>]+>>/g;
    var match;
    while ((match = nestedGenericRegex.exec(code)) !== null) {
        result.nestedGenerics++;
    }

    var unionTypeRegex = /(\w+\s*\|\s*){5,}/g;
    while ((match = unionTypeRegex.exec(code)) !== null) {
        result.complexUnionTypes++;
    }

    var anyRegex = /\bany\b|\bas\s+any\b/g;
    while ((match = anyRegex.exec(code)) !== null) {
        result.anyUsage++;
    }

    var importMap = {};
    var importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
    while ((match = importRegex.exec(code)) !== null) {
        var imported = match[1];
        if (!importMap[imported]) {
            importMap[imported] = [];
        }
    }

    var reExportRegex = /export\s*\{\s*.*?\s*\}\s*from\s+['"](.*?)['"]/g;
    var exportMap = {};
    while ((match = reExportRegex.exec(code)) !== null) {
        var reExported = match[1];
        if (!exportMap[reExported]) {
            exportMap[reExported] = [];
        }
    }

    var totalParseTime = 0;
    var iterations = 100;

    for (var i = 0; i < iterations; i++) {
        var startTime = Date.now();
        try {
            tsParser.createSourceFile(
                'temp_' + i + '.ts',
                code,
                tsParser.ScriptTarget.Latest,
                true,
                tsParser.ScriptKind.TS
            );
        } catch (e) {
        }
        totalParseTime += Date.now() - startTime;
    }

    result.avgParseTime = totalParseTime / iterations;

    result.scoreBreakdown.nestedGenerics = result.nestedGenerics * 10;
    result.scoreBreakdown.complexUnionTypes = result.complexUnionTypes * 15;
    result.scoreBreakdown.anyUsage = result.anyUsage * 1;
    result.scoreBreakdown.circularImports = result.circularImports * 50;

    var totalScore = result.scoreBreakdown.nestedGenerics +
                     result.scoreBreakdown.complexUnionTypes +
                     result.scoreBreakdown.anyUsage +
                     result.scoreBreakdown.circularImports;

    var parseTimeFactor = result.avgParseTime * 2;
    var memoryEstimate = code.length * 0.8;
    var typeDensityFactor = (result.nestedGenerics + result.complexUnionTypes) * 5;

    result.crashIndex = Math.round(totalScore + parseTimeFactor + (memoryEstimate / 1000) + typeDensityFactor);

    return result;
}

function renderFileList(data) {
    if (data.length === 0) {
        fileListBody.innerHTML = '<div class="empty-state">No .ts/.tsx files</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var complexityClass = item.complexity <= 3 ? 'complexity-low' : (item.complexity <= 7 ? 'complexity-medium' : 'complexity-high');
        html += '<div class="file-item">';
        html += '<span class="file-name">' + item.name + '</span>';
        html += '<div class="file-meta">';
        html += '<span>' + item.lines + ' lines</span>';
        html += '<span class="complexity-badge ' + complexityClass + '">' + item.complexity + '</span>';
        html += '</div>';
        html += '</div>';
    }
    fileListBody.innerHTML = html;
}

function renderHeatmap(data) {
    if (data.length === 0) {
        heatmapBody.innerHTML = '<div class="heatmap-label">File Parsing Pressure Distribution</div><div class="heatmap-grid"><div class="empty-state">Waiting for data...</div></div>';
        return;
    }

    var maxLines = 0;
    var maxComplexity = 0;
    for (var k = 0; k < data.length; k++) {
        if (data[k].lines > maxLines) maxLines = data[k].lines;
        if (data[k].complexity > maxComplexity) maxComplexity = data[k].complexity;
    }

    var html = '<div class="heatmap-label">File Parsing Pressure Distribution (click for details)</div>';
    html += '<div class="heatmap-grid">';
    var totalCells = Math.max(36, data.length);
    for (var i = 0; i < totalCells; i++) {
        var index = i % data.length;
        var item = data[index];
        var sizePercent = maxLines > 0 ? 50 + (item.lines / maxLines) * 50 : 75;
        var pressure = item.complexity;
        var colorIndex = Math.min(Math.floor(pressure / 2), 5);
        var color = getHeatmapColor(colorIndex);
        html += '<div class="heatmap-cell" data-index="' + index + '" style="background:#' + color + ';width:' + sizePercent + '%;height:' + sizePercent + '%;font-size:' + (6 + sizePercent / 10) + 'px;cursor:pointer;" onclick="showFileDetail(' + index + ')">' + (i + 1) + '</div>';
    }
    html += '</div>';
    heatmapBody.innerHTML = html;
}

function getHeatmapColor(index) {
    var colors = ['0d1117', '238636', '3fb950', '89d185', 'da3633', 'f85149'];
    return colors[Math.min(index, 5)];
}

function showFileDetail(index) {
    if (!fileDataList || !fileDataList[index]) return;

    var item = fileDataList[index];
    var bottleneckHtml = '<div class="suggestion-title">File Details: ' + item.name + '</div>';

    if (item.hasCycle) {
        bottleneckHtml += '<div class="suggestion-item critical-tag">⚠️ Has circular dependency</div>';
    }

    bottleneckHtml += '<div class="suggestion-item">Lines: ' + item.lines + '</div>';
    bottleneckHtml += '<div class="suggestion-item">Characters: ' + item.characters + '</div>';
    bottleneckHtml += '<div class="suggestion-item">Imports: ' + item.importCount + '</div>';
    bottleneckHtml += '<div class="suggestion-item">Type Aliases: ' + item.typeAliasCount + '</div>';
    bottleneckHtml += '<div class="suggestion-item">Interfaces: ' + item.interfaceCount + '</div>';
    bottleneckHtml += '<div class="suggestion-item">Generic Depth: ' + item.genericDepth + '</div>';
    bottleneckHtml += '<div class="suggestion-item">Complexity: ' + item.complexity + '</div>';

    if (item.issues) {
        if (item.issues.critical && item.issues.critical.length > 0) {
            bottleneckHtml += '<div class="suggestion-title">CRITICAL</div>';
            for (var c = 0; c < item.issues.critical.length; c++) {
                bottleneckHtml += '<div class="suggestion-item critical-item">🔴 ' + item.issues.critical[c] + '</div>';
            }
        }

        if (item.issues.warning && item.issues.warning.length > 0) {
            bottleneckHtml += '<div class="suggestion-title">WARNING</div>';
            for (var w = 0; w < item.issues.warning.length; w++) {
                bottleneckHtml += '<div class="suggestion-item warning-item">🟡 ' + item.issues.warning[w] + '</div>';
            }
        }

        if (item.issues.info && item.issues.info.length > 0) {
            bottleneckHtml += '<div class="suggestion-title">INFO</div>';
            for (var i = 0; i < item.issues.info.length; i++) {
                bottleneckHtml += '<div class="suggestion-item info-item">🔵 ' + item.issues.info[i] + '</div>';
            }
        }
    }

    if (item.pressureResult) {
        bottleneckHtml += '<div class="suggestion-title">Performance Metrics</div>';
        bottleneckHtml += '<div class="suggestion-item">Avg Parse Time: ' + item.pressureResult.avgParseTime.toFixed(2) + ' ms</div>';
        bottleneckHtml += '<div class="suggestion-item">TSServer Crash Index: ' + item.pressureResult.crashIndex + '</div>';
    }

    document.getElementById('bottleneckFiles').innerHTML = bottleneckHtml;
}

function renderSuggestions(data) {
    if (data.length === 0) {
        document.getElementById('concurrencySuggestions').innerHTML = '<div class="empty-state">Waiting for data...</div>';
        document.getElementById('bottleneckFiles').innerHTML = '<div class="empty-state">Waiting for data...</div>';
        document.getElementById('memoryStats').innerHTML = '<div class="empty-state">Waiting for data...</div>';
        return;
    }

    var totalComplexity = 0;
    var totalParseTime = 0;
    var totalLines = 0;
    var totalImports = 0;
    var totalTypeAliases = 0;
    var totalInterfaces = 0;
    var hasIndexExport = false;
    var indexExports = 0;
    var hasGiantIndex = false;

    for (var j = 0; j < data.length; j++) {
        totalComplexity += data[j].complexity;
        if (data[j].pressureResult) {
            totalParseTime += data[j].pressureResult.avgParseTime;
        }
        totalLines += data[j].lines;
        totalImports += data[j].importCount;
        totalTypeAliases += data[j].typeAliasCount;
        totalInterfaces += data[j].interfaceCount;

        if (data[j].name === 'index.ts' || data[j].name === 'index.tsx') {
            hasIndexExport = true;
            if (data[j].lines > 500 || data[j].importCount > 20) {
                hasGiantIndex = true;
            }
        }
    }

    var avgComplexity = totalComplexity / data.length;
    var avgParseTime = data.length > 0 ? totalParseTime / data.length : 0;

    var concurrencyHtml = '';

    if (avgComplexity > 80) {
        concurrencyHtml += '<div class="suggestion-item">[Suggestion] Enable incremental: true</div>';
    }

    concurrencyHtml += '<div class="suggestion-item">Enable parallel parsing for TypeScript projects</div>';
    concurrencyHtml += '<div class="suggestion-item">Optimize dependency graph traversal order</div>';

    if (data.length > 5) {
        concurrencyHtml += '<div class="suggestion-item">Enable incremental compilation mode</div>';
    }

    if (hasGiantIndex) {
        concurrencyHtml += '<div class="suggestion-item">[Warning] Export convergence bottleneck</div>';
    }

    var suggestedMemory = Math.max(2048, Math.floor(data.length * 128 + avgParseTime * 10));
    concurrencyHtml += '<div class="suggestion-item">Suggested max-old-space-size: ' + suggestedMemory + '</div>';

    document.getElementById('concurrencySuggestions').innerHTML = concurrencyHtml;

    var sortedByComplexity = data.slice().sort(function(a, b) {
        return b.complexity - a.complexity;
    });
    var bottleneckHtml = '';
    for (var i = 0; i < Math.min(3, sortedByComplexity.length); i++) {
        var crashInfo = sortedByComplexity[i].pressureResult ? ' Crash Index: ' + sortedByComplexity[i].pressureResult.crashIndex : '';
        bottleneckHtml += '<div class="suggestion-item">' + sortedByComplexity[i].name + ' (Complexity: ' + sortedByComplexity[i].complexity + crashInfo + ')</div>';
    }
    document.getElementById('bottleneckFiles').innerHTML = bottleneckHtml;

    var estimatedMemory = Math.floor(totalLines * 0.8);
    var memoryHtml = '<div class="stat-row"><span class="stat-label">Estimated Parse Memory</span><span class="stat-value">' + estimatedMemory + ' KB</span></div>';
    memoryHtml += '<div class="stat-row"><span class="stat-label">Total Files</span><span class="stat-value">' + data.length + '</span></div>';
    memoryHtml += '<div class="stat-row"><span class="stat-label">Total Lines</span><span class="stat-value">' + totalLines + '</span></div>';
    memoryHtml += '<div class="stat-row"><span class="stat-label">Total Imports</span><span class="stat-value">' + totalImports + '</span></div>';
    memoryHtml += '<div class="stat-row"><span class="stat-label">Type Aliases</span><span class="stat-value">' + totalTypeAliases + '</span></div>';
    memoryHtml += '<div class="stat-row"><span class="stat-label">Interfaces</span><span class="stat-value">' + totalInterfaces + '</span></div>';
    memoryHtml += '<div class="stat-row"><span class="stat-label">Avg Complexity</span><span class="stat-value">' + avgComplexity.toFixed(1) + '</span></div>';
    memoryHtml += '<div class="stat-row"><span class="stat-label">Avg Parse Time</span><span class="stat-value">' + avgParseTime.toFixed(2) + ' ms</span></div>';
    document.getElementById('memoryStats').innerHTML = memoryHtml;
}

function generateReport() {
    if (fileDataList.length === 0) {
        alert('No analysis data. Please drop TypeScript files first.');
        return;
    }

    var report = [];
    report.push('====================================');
    report.push('    TSBeast Analysis Report');
    report.push('    TypeScript Performance Analyzer');
    report.push('====================================');
    report.push('');
    report.push('Generated: ' + new Date().toLocaleString());
    report.push('');

    var totalComplexity = 0;
    var totalParseTime = 0;
    var totalLines = 0;
    var totalImports = 0;
    var totalNestedGenerics = 0;
    var totalComplexUnionTypes = 0;
    var totalAnyUsage = 0;

    report.push('=== File Analysis Details ===');
    report.push('-----------------------------------');

    for (var i = 0; i < fileDataList.length; i++) {
        var item = fileDataList[i];
        report.push('');
        report.push('File: ' + item.name);
        report.push('  Lines: ' + item.lines);
        report.push('  Characters: ' + item.characters);
        report.push('  Imports: ' + item.importCount);
        report.push('  Type Aliases: ' + item.typeAliasCount);
        report.push('  Interfaces: ' + item.interfaceCount);
        report.push('  Generic Depth: ' + item.genericDepth);
        report.push('  Complexity: ' + item.complexity);

        if (item.pressureResult) {
            var pr = item.pressureResult;
            report.push('  Nested Generics: ' + pr.nestedGenerics);
            report.push('  Complex Union Types: ' + pr.complexUnionTypes);
            report.push('  Any Usage: ' + pr.anyUsage);
            report.push('  Avg Parse Time: ' + pr.avgParseTime.toFixed(2) + ' ms');
            report.push('  TSServer Crash Index: ' + pr.crashIndex);

            totalNestedGenerics += pr.nestedGenerics;
            totalComplexUnionTypes += pr.complexUnionTypes;
            totalAnyUsage += pr.anyUsage;
            totalParseTime += pr.avgParseTime;
        }

        totalComplexity += item.complexity;
        totalLines += item.lines;
        totalImports += item.importCount;
    }

    report.push('');
    report.push('=== Project Summary ===');
    report.push('-----------------------------------');
    report.push('Total Files: ' + fileDataList.length);
    report.push('Total Lines: ' + totalLines);
    report.push('Total Imports: ' + totalImports);
    report.push('Avg Complexity: ' + (totalComplexity / fileDataList.length).toFixed(2));
    report.push('Total Nested Generics: ' + totalNestedGenerics);
    report.push('Total Complex Union Types: ' + totalComplexUnionTypes);
    report.push('Total Any Usage: ' + totalAnyUsage);
    report.push('Avg Parse Time: ' + (totalParseTime / fileDataList.length).toFixed(2) + ' ms');

    var avgComplexity = totalComplexity / fileDataList.length;
    report.push('');
    report.push('=== Optimization Suggestions ===');
    report.push('-----------------------------------');

    if (avgComplexity > 80) {
        report.push('[Suggestion] Enable incremental: true');
    }

    for (var idx = 0; idx < fileDataList.length; idx++) {
        if (fileDataList[idx].name === 'index.ts' || fileDataList[idx].name === 'index.tsx') {
            if (fileDataList[idx].lines > 500 || fileDataList[idx].importCount > 20) {
                report.push('[Warning] Export convergence bottleneck: index.ts');
            }
        }
    }

    var suggestedMemory = Math.max(2048, Math.floor(fileDataList.length * 128 + (totalParseTime / fileDataList.length) * 10));
    report.push('[Suggestion] max-old-space-size: ' + suggestedMemory);
    report.push('');
    report.push('====================================');
    report.push('         TSBeast Report End');
    report.push('====================================');

    var blob = new Blob([report.join('\n')], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'TS_BEAST_LOG.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveToLocalStorage() {
    if (fileDataList.length === 0) return;

    var totalComplexity = 0;
    var totalCrashIndex = 0;
    for (var i = 0; i < fileDataList.length; i++) {
        totalComplexity += fileDataList[i].complexity;
        if (fileDataList[i].pressureResult) {
            totalCrashIndex += fileDataList[i].pressureResult.crashIndex;
        }
    }

    var scanRecord = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        projectName: fileDataList.length > 0 ? fileDataList[0].name.split('/')[0] || 'Unknown Project' : 'Unknown Project',
        fileCount: fileDataList.length,
        totalComplexity: Math.round(totalComplexity),
        avgComplexity: Math.round(totalComplexity / fileDataList.length),
        totalCrashIndex: Math.round(totalCrashIndex),
        avgCrashIndex: fileDataList.length > 0 ? Math.round(totalCrashIndex / fileDataList.length) : 0
    };

    var history = getScanHistory();
    history.unshift(scanRecord);
    history = history.slice(0, 3);
    localStorage.setItem('tsbeast_scan_history', JSON.stringify(history));
}

function getScanHistory() {
    var stored = localStorage.getItem('tsbeast_scan_history');
    return stored ? JSON.parse(stored) : [];
}

function renderScanHistory() {
    var history = getScanHistory();
    var historyContainer = document.getElementById('scanHistory');
    if (!historyContainer) return;

    if (history.length === 0) {
        historyContainer.innerHTML = '<div class="empty-state">No scan records</div>';
        return;
    }

    var html = '';
    for (var i = 0; i < history.length; i++) {
        var record = history[i];
        html += '<div class="history-item">';
        html += '<div class="history-header">';
        html += '<span class="history-project">' + record.projectName + '</span>';
        html += '<span class="history-time">' + record.timestamp + '</span>';
        html += '</div>';
        html += '<div class="history-stats">';
        html += '<span>Files: ' + record.fileCount + '</span>';
        html += '<span>Avg Complexity: ' + record.avgComplexity + '</span>';
        html += '<span>Crash Index: ' + record.avgCrashIndex + '</span>';
        html += '</div>';
        html += '</div>';
    }
    historyContainer.innerHTML = html;
}

function killSession() {
    fileDataList = [];
    fileContents = {};

    if (fileListBody) {
        fileListBody.innerHTML = '<div class="empty-state">Waiting for files...</div>';
    }
    if (heatmapBody) {
        heatmapBody.innerHTML = '<div class="heatmap-label">File Parsing Pressure Distribution</div><div class="heatmap-grid"><div class="empty-state">Waiting for data...</div></div>';
    }
    if (document.getElementById('concurrencySuggestions')) {
        document.getElementById('concurrencySuggestions').innerHTML = '<div class="empty-state">Waiting for data...</div>';
    }
    if (document.getElementById('bottleneckFiles')) {
        document.getElementById('bottleneckFiles').innerHTML = '<div class="empty-state">Waiting for data...</div>';
    }
    if (document.getElementById('memoryStats')) {
        document.getElementById('memoryStats').innerHTML = '<div class="empty-state">Waiting for data...</div>';
    }
    if (document.getElementById('scanHistory')) {
        document.getElementById('scanHistory').innerHTML = '<div class="empty-state">No scan records</div>';
    }

    if (runButton) {
        runButton.textContent = 'Run Pressure Simulation';
        runButton.disabled = false;
    }
}

var currentTsConfig = {
    compilerOptions: {}
};

var suggestedTsConfig = {
    compilerOptions: {}
};

var baselineSnapshot = null;

function saveBaseline() {
    if (fileDataList.length === 0) {
        alert('Please drop files to scan first.');
        return;
    }

    var totalComplexity = 0;
    var totalParseTime = 0;
    var totalLines = 0;
    var totalImports = 0;
    var totalCrashIndex = 0;

    for (var i = 0; i < fileDataList.length; i++) {
        totalComplexity += fileDataList[i].complexity;
        if (fileDataList[i].pressureResult) {
            totalParseTime += fileDataList[i].pressureResult.avgParseTime;
            totalCrashIndex += fileDataList[i].pressureResult.crashIndex;
        }
        totalLines += fileDataList[i].lines;
        totalImports += fileDataList[i].importCount;
    }

    baselineSnapshot = {
        timestamp: new Date().toLocaleString(),
        fileCount: fileDataList.length,
        totalLines: totalLines,
        totalImports: totalImports,
        avgComplexity: Math.round(totalComplexity / fileDataList.length),
        avgParseTime: fileDataList.length > 0 ? (totalParseTime / fileDataList.length) : 0,
        avgCrashIndex: fileDataList.length > 0 ? Math.round(totalCrashIndex / fileDataList.length) : 0
    };

    alert('Baseline snapshot saved!');
    renderComparison();
}

function generateOptimizedConfig() {
    if (fileDataList.length === 0) {
        alert('Please drop TypeScript files to analyze first.');
        return;
    }

    var config = {
        compilerOptions: {
            target: 'ES2020',
            module: 'commonjs',
            lib: ['ES2020', 'DOM'],
            declaration: true,
            sourceMap: true,
            strict: true,
            esModuleInterop: true,
            skipLibCheck: false,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: false,
            incremental: false
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist']
    };

    if (fileDataList.length > 100) {
        config.compilerOptions.skipLibCheck = true;
        config.compilerOptions.incremental = true;
    }

    var typeCount = 0;
    var hasDuplicateTypes = false;
    var typeNames = {};
    for (var i = 0; i < fileDataList.length; i++) {
        typeCount += fileDataList[i].typeAliasCount + fileDataList[i].interfaceCount;
        if (fileDataList[i].issues && fileDataList[i].issues.warning) {
            for (var j = 0; j < fileDataList[i].issues.warning.length; j++) {
                if (fileDataList[i].issues.warning[j].includes('Giant')) {
                    hasDuplicateTypes = true;
                    break;
                }
            }
        }
    }

    if (hasDuplicateTypes || typeCount > 200) {
        config.compilerOptions.declarationMap = true;
        config.compilerOptions.emitDeclarationOnly = false;
    }

    var paths = inferPathsFromFiles();
    if (Object.keys(paths).length > 0) {
        config.compilerOptions.baseUrl = '.';
        config.compilerOptions.paths = paths;
    }

    var avgComplexity = 0;
    for (var k = 0; k < fileDataList.length; k++) {
        avgComplexity += fileDataList[k].complexity;
    }
    avgComplexity /= fileDataList.length;

    if (avgComplexity > 7) {
        config.compilerOptions.noUnusedLocals = true;
        config.compilerOptions.noUnusedParameters = true;
        config.compilerOptions.exactOptionalPropertyTypes = true;
    }

    var hasCycle = false;
    for (var m = 0; m < fileDataList.length; m++) {
        if (fileDataList[m].hasCycle) {
            hasCycle = true;
            break;
        }
    }
    if (hasCycle) {
        config.compilerOptions.skipLibCheck = true;
    }

    suggestedTsConfig = config;

    var currentConfigEl = document.getElementById('currentConfig');
    var suggestedConfigEl = document.getElementById('suggestedConfig');

    currentConfigEl.textContent = JSON.stringify(currentTsConfig, null, 2);
    suggestedConfigEl.innerHTML = highlightConfigDiff(JSON.stringify(config, null, 2));
}

function inferPathsFromFiles() {
    var paths = {};
    var dirs = {};

    for (var i = 0; i < fileDataList.length; i++) {
        var name = fileDataList[i].name;
        var parts = name.split('/');
        if (parts.length > 1) {
            var dir = parts.slice(0, -1).join('/');
            dirs[dir] = (dirs[dir] || 0) + 1;
        }
    }

    var commonDirs = Object.keys(dirs).filter(function(dir) {
        return dirs[dir] >= 3;
    });

    for (var j = 0; j < commonDirs.length; j++) {
        var dir = commonDirs[j];
        var alias = '@' + dir.replace(/[\\/]/g, '');
        paths[alias + '/*'] = [dir + '/*'];
    }

    if (fileDataList.some(function(f) { return f.name.includes('src'); })) {
        paths['@src/*'] = ['src/*'];
    }
    if (fileDataList.some(function(f) { return f.name.includes('components'); })) {
        paths['@components/*'] = ['src/components/*'];
    }
    if (fileDataList.some(function(f) { return f.name.includes('utils'); })) {
        paths['@utils/*'] = ['src/utils/*'];
    }
    if (fileDataList.some(function(f) { return f.name.includes('types'); })) {
        paths['@types/*'] = ['src/types/*'];
    }

    return paths;
}

function highlightConfigDiff(jsonStr) {
    var config = JSON.parse(jsonStr);
    var highlighted = [];
    var keys = Object.keys(config.compilerOptions);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = config.compilerOptions[key];
        var isRecommended = false;

        if (key === 'skipLibCheck' && value === true) isRecommended = true;
        if (key === 'incremental' && value === true) isRecommended = true;
        if (key === 'declarationMap' && value === true) isRecommended = true;
        if (key === 'paths' && Object.keys(value).length > 0) isRecommended = true;
        if (key === 'noUnusedLocals' && value === true) isRecommended = true;
        if (key === 'noUnusedParameters' && value === true) isRecommended = true;

        if (isRecommended) {
            highlighted.push('    "<span class=\\"diff-add\\">' + key + '</span>": ' + JSON.stringify(value));
        } else {
            highlighted.push('    "' + key + '": ' + JSON.stringify(value));
        }
    }

    var includeExclude = [];
    if (config.include) {
        includeExclude.push('  "include": ' + JSON.stringify(config.include));
    }
    if (config.exclude) {
        includeExclude.push('  "exclude": ' + JSON.stringify(config.exclude));
    }

    return '{\n  "compilerOptions": {\n' + highlighted.join(',\n') + '\n  }' +
           (includeExclude.length > 0 ? ',\n' + includeExclude.join(',\n') : '') + '\n}';
}

function downloadOptimizedConfig() {
    if (Object.keys(suggestedTsConfig.compilerOptions).length === 0) {
        alert('Please generate optimized config first.');
        return;
    }

    var blob = new Blob([JSON.stringify(suggestedTsConfig, null, 2)], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tsconfig.optimized.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function renderComparison() {
    var comparisonBody = document.getElementById('comparisonBody');
    if (!comparisonBody) return;

    if (!baselineSnapshot) {
        comparisonBody.innerHTML = '<div class="empty-state">Save a baseline first, then scan again to compare</div>';
        return;
    }

    if (fileDataList.length === 0) {
        comparisonBody.innerHTML = '<div class="empty-state">No current scan data</div>';
        return;
    }

    var totalComplexity = 0;
    var totalParseTime = 0;
    var totalLines = 0;
    var totalImports = 0;
    var totalCrashIndex = 0;

    for (var i = 0; i < fileDataList.length; i++) {
        totalComplexity += fileDataList[i].complexity;
        if (fileDataList[i].pressureResult) {
            totalParseTime += fileDataList[i].pressureResult.avgParseTime;
            totalCrashIndex += fileDataList[i].pressureResult.crashIndex;
        }
        totalLines += fileDataList[i].lines;
        totalImports += fileDataList[i].importCount;
    }

    var current = {
        fileCount: fileDataList.length,
        totalLines: totalLines,
        totalImports: totalImports,
        avgComplexity: Math.round(totalComplexity / fileDataList.length),
        avgParseTime: fileDataList.length > 0 ? (totalParseTime / fileDataList.length) : 0,
        avgCrashIndex: fileDataList.length > 0 ? Math.round(totalCrashIndex / fileDataList.length) : 0
    };

    var parseTimeChange = baselineSnapshot.avgParseTime > 0 
        ? ((current.avgParseTime - baselineSnapshot.avgParseTime) / baselineSnapshot.avgParseTime * 100) 
        : 0;
    var complexityChange = current.avgComplexity - baselineSnapshot.avgComplexity;
    var crashIndexChange = current.avgCrashIndex - baselineSnapshot.avgCrashIndex;

    var parseTimeClass = parseTimeChange < -5 ? 'improvement' : (parseTimeChange > 5 ? 'regression' : 'no-change');
    var complexityClass = complexityChange < 0 ? 'improvement' : (complexityChange > 0 ? 'regression' : 'no-change');
    var crashClass = crashIndexChange < 0 ? 'improvement' : (crashIndexChange > 0 ? 'regression' : 'no-change');

    var parseTimeText = parseTimeChange < 0 ? parseTimeChange.toFixed(1) + '%' : '+' + parseTimeChange.toFixed(1) + '%';
    var complexityText = complexityChange < 0 ? complexityChange : '+' + complexityChange;
    var crashText = crashIndexChange < 0 ? crashIndexChange : '+' + crashIndexChange;

    var html = '';
    html += '<table class="comparison-table">';
    html += '<thead>';
    html += '<tr><th>Metric</th><th>Baseline</th><th>Current</th><th>Change</th></tr>';
    html += '</thead>';
    html += '<tbody>';
    html += '<tr>';
    html += '<td>Files</td>';
    html += '<td class="value-cell">' + baselineSnapshot.fileCount + '</td>';
    html += '<td class="value-cell">' + current.fileCount + '</td>';
    html += '<td class="value-cell ' + (current.fileCount === baselineSnapshot.fileCount ? 'no-change' : 'improvement') + '">';
    html += current.fileCount === baselineSnapshot.fileCount ? '0' : (current.fileCount > baselineSnapshot.fileCount ? '+' : '') + (current.fileCount - baselineSnapshot.fileCount);
    html += '</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Total Lines</td>';
    html += '<td class="value-cell">' + baselineSnapshot.totalLines + '</td>';
    html += '<td class="value-cell">' + current.totalLines + '</td>';
    html += '<td class="value-cell ' + (current.totalLines === baselineSnapshot.totalLines ? 'no-change' : 'improvement') + '">';
    html += current.totalLines === baselineSnapshot.totalLines ? '0' : (current.totalLines > baselineSnapshot.totalLines ? '+' : '') + (current.totalLines - baselineSnapshot.totalLines);
    html += '</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Parse Time</td>';
    html += '<td class="value-cell">' + baselineSnapshot.avgParseTime.toFixed(2) + ' ms</td>';
    html += '<td class="value-cell">' + current.avgParseTime.toFixed(2) + ' ms</td>';
    html += '<td class="value-cell ' + parseTimeClass + '">' + parseTimeText + '</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Complexity</td>';
    html += '<td class="value-cell">' + baselineSnapshot.avgComplexity + '</td>';
    html += '<td class="value-cell">' + current.avgComplexity + '</td>';
    html += '<td class="value-cell ' + complexityClass + '">' + baselineSnapshot.avgComplexity + ' -> ' + current.avgComplexity + '</td>';
    html += '</tr>';
    html += '<tr>';
    html += '<td>Crash Index</td>';
    html += '<td class="value-cell">' + baselineSnapshot.avgCrashIndex + '</td>';
    html += '<td class="value-cell">' + current.avgCrashIndex + '</td>';
    html += '<td class="value-cell ' + crashClass + '">' + crashText + '</td>';
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';

    var estimatedDelayReduction = Math.round(baselineSnapshot.avgParseTime - current.avgParseTime);
    var hintText = '';
    if (estimatedDelayReduction > 0) {
        hintText = 'Through this optimization, your VSCode type hint delay is expected to decrease by ' + estimatedDelayReduction + ' ms';
    } else if (estimatedDelayReduction < 0) {
        hintText = 'Current code complexity has increased, VSCode type hint delay is expected to increase by ' + Math.abs(estimatedDelayReduction) + ' ms';
    } else {
        hintText = 'Code complexity has remained essentially unchanged, VSCode type hint delay is expected to have no significant change';
    }

    html += '<div class="conversion-hint">' + hintText + '</div>';

    comparisonBody.innerHTML = html;
}

function exportAuditReport() {
    if (fileDataList.length === 0) {
        alert('Please drop files to scan first.');
        return;
    }

    var reportContent = generateAuditReportHTML();
    
    var blob = new Blob([reportContent], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'TSBeast_Audit_Report.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateAuditReportHTML() {
    var totalComplexity = 0;
    var totalParseTime = 0;
    var totalIssues = { critical: 0, warning: 0, info: 0 };
    var totalLines = 0;
    var totalImports = 0;

    for (var i = 0; i < fileDataList.length; i++) {
        totalComplexity += fileDataList[i].complexity;
        if (fileDataList[i].pressureResult) {
            totalParseTime += fileDataList[i].pressureResult.avgParseTime;
        }
        totalLines += fileDataList[i].lines;
        totalImports += fileDataList[i].importCount;
        
        if (fileDataList[i].issues) {
            totalIssues.critical += fileDataList[i].issues.critical ? fileDataList[i].issues.critical.length : 0;
            totalIssues.warning += fileDataList[i].issues.warning ? fileDataList[i].issues.warning.length : 0;
            totalIssues.info += fileDataList[i].issues.info ? fileDataList[i].issues.info.length : 0;
        }
    }

    var avgComplexity = Math.round(totalComplexity / fileDataList.length);
    var avgParseTime = fileDataList.length > 0 ? (totalParseTime / fileDataList.length).toFixed(2) : 0;
    
    var healthScore = calculateHealthScore(avgComplexity, totalIssues);
    var healthLevel = getHealthLevel(healthScore);

    var sortedByComplexity = fileDataList.slice().sort(function(a, b) {
        return b.complexity - a.complexity;
    });
    var topBottlenecks = sortedByComplexity.slice(0, 5);

    var dependencyDepth = calculateDependencyDepth();

    var html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TSBeast Technical Audit Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 12px; line-height: 1.6; color: #1a1a1a; background: #fff; }
        .container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #333; }
        .header h1 { font-size: 18px; font-weight: bold; color: #000; }
        .header .subtitle { font-size: 11px; color: #666; margin-top: 5px; }
        .header .date { font-size: 10px; color: #999; margin-top: 3px; }
        
        .score-card { background: #f5f5f5; padding: 20px; margin-bottom: 20px; border-radius: 4px; }
        .score-label { font-size: 11px; color: #666; margin-bottom: 5px; }
        .score-value { font-size: 36px; font-weight: bold; }
        .score-value.excellent { color: #008000; }
        .score-value.good { color: #4a8c4a; }
        .score-value.warning { color: #b8860b; }
        .score-value.critical { color: #dc143c; }
        .score-level { font-size: 12px; margin-top: 5px; font-weight: bold; }
        
        .section { margin-bottom: 25px; }
        .section-title { font-size: 14px; font-weight: bold; color: #000; margin-bottom: 12px; padding-bottom: 5px; border-bottom: 1px solid #ccc; }
        
        .table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .table th, .table td { padding: 8px 6px; text-align: left; border-bottom: 1px solid #eee; }
        .table th { background: #f5f5f5; font-weight: bold; color: #333; }
        .table .rank { width: 30px; text-align: center; }
        .table .complexity { width: 60px; text-align: right; }
        .table .crash-index { width: 70px; text-align: right; }
        
        .chart-container { margin: 15px 0; }
        .chart-bar { display: flex; align-items: center; margin-bottom: 6px; }
        .chart-label { width: 100px; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .chart-bar-fill { height: 16px; background: #333; margin-left: 10px; }
        .chart-bar-fill.low { background: #008000; }
        .chart-bar-fill.medium { background: #b8860b; }
        .chart-bar-fill.high { background: #dc143c; }
        .chart-value { width: 40px; text-align: right; margin-left: 10px; font-size: 10px; }
        
        .dependency-tree { margin-left: 20px; font-size: 11px; }
        .dependency-node { margin: 4px 0; }
        .dependency-node::before { content: '├─ '; color: #666; }
        .dependency-leaf::before { content: '└─ '; color: #666; }
        
        .suggestions-list { list-style: none; padding-left: 15px; }
        .suggestions-list li { margin-bottom: 8px; font-size: 11px; position: relative; }
        .suggestions-list li::before { content: '•'; position: absolute; left: -12px; color: #333; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .stat-item { background: #f5f5f5; padding: 12px; border-radius: 4px; }
        .stat-label { font-size: 10px; color: #666; }
        .stat-value { font-size: 16px; font-weight: bold; color: #000; }
        
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #333; font-size: 10px; color: #666; }
        .footer a { color: #333; text-decoration: none; border-bottom: 1px dotted #666; }
        .footer .tool-desc { margin-bottom: 10px; }
        .footer .badge { display: inline-block; padding: 2px 6px; background: #333; color: #fff; font-size: 9px; border-radius: 2px; margin-top: 10px; }
        
        @media print {
            body { font-size: 10px; }
            .container { margin: 10px auto; }
            .header { margin-bottom: 15px; padding-bottom: 10px; }
            .score-card { padding: 15px; }
            .score-value { font-size: 28px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>TSBeast - TypeScript Audit Report</h1>
            <div class="subtitle">TypeScript Performance Auditing Tool</div>
            <div class="date">Generated: ${new Date().toLocaleString()}</div>
        </div>

        <div class="score-card">
            <div class="score-label">Overall Project Health Score</div>
            <div class="score-value ${healthLevel}">${healthScore}</div>
            <div class="score-level">${getHealthLevelText(healthScore)}</div>
        </div>

        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">Total Files</div>
                <div class="stat-value">${fileDataList.length}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Total Lines</div>
                <div class="stat-value">${totalLines.toLocaleString()}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Total Dependencies</div>
                <div class="stat-value">${totalImports}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Avg Parse Time</div>
                <div class="stat-value">${avgParseTime} ms</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">⚠️ Top 5 Bottleneck Files</div>
            <table class="table">
                <thead>
                    <tr><th class="rank">Rank</th><th>Filename</th><th class="complexity">Complexity</th><th class="crash-index">Crash Index</th></tr>
                </thead>
                <tbody>`;

    for (var j = 0; j < topBottlenecks.length; j++) {
        var file = topBottlenecks[j];
        var crashIndex = file.pressureResult ? file.pressureResult.crashIndex : 'N/A';
        html += `<tr>
            <td class="rank">${j + 1}</td>
            <td>${file.name}</td>
            <td class="complexity">${file.complexity}</td>
            <td class="crash-index">${crashIndex}</td>
        </tr>`;
    }

    html += `</tbody></table>
        </div>

        <div class="section">
            <div class="section-title">📊 Complexity Distribution</div>
            <div class="chart-container">`;

    for (var k = 0; k < Math.min(10, sortedByComplexity.length); k++) {
        var f = sortedByComplexity[k];
        var width = (f.complexity / 10) * 100;
        var level = f.complexity <= 3 ? 'low' : (f.complexity <= 7 ? 'medium' : 'high');
        html += `<div class="chart-bar">
            <div class="chart-label">${f.name}</div>
            <div class="chart-bar-fill ${level}" style="width: ${width}%"></div>
            <div class="chart-value">${f.complexity}</div>
        </div>`;
    }

    html += `</div>
        </div>

        <div class="section">
            <div class="section-title">🔗 Dependency Depth Distribution</div>
            <div class="dependency-tree">`;

    for (var d = 0; d < dependencyDepth.length; d++) {
        var depth = dependencyDepth[d];
        var prefix = d === dependencyDepth.length - 1 ? 'dependency-leaf' : 'dependency-node';
        html += `<div class="dependency-node ${prefix}">Depth ${depth.depth}: ${depth.count} files</div>`;
    }

    html += `</div>
        </div>

        <div class="section">
            <div class="section-title">🔧 Optimization Suggestions</div>
            <ul class="suggestions-list">`;

    var suggestions = generateOptimizationSuggestions(avgComplexity, totalIssues, fileDataList.length);
    for (var s = 0; s < suggestions.length; s++) {
        html += `<li>${suggestions[s]}</li>`;
    }

    html += `</ul>
        </div>

        <div class="section">
            <div class="section-title">📋 Issue Statistics</div>
            <div class="stats-grid">
                <div class="stat-item" style="background: #ffeaea;">
                    <div class="stat-label">CRITICAL</div>
                    <div class="stat-value" style="color: #dc143c;">${totalIssues.critical}</div>
                </div>
                <div class="stat-item" style="background: #fff8e1;">
                    <div class="stat-label">WARNING</div>
                    <div class="stat-value" style="color: #b8860b;">${totalIssues.warning}</div>
                </div>
                <div class="stat-item" style="background: #e6f7ff;">
                    <div class="stat-label">INFO</div>
                    <div class="stat-value" style="color: #1e90ff;">${totalIssues.info}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Total</div>
                    <div class="stat-value">${totalIssues.critical + totalIssues.warning + totalIssues.info}</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <div class="tool-desc">
                <strong>TSBeast</strong> - TypeScript Performance Analyzer, a tool for detecting and optimizing TypeScript project performance bottlenecks.
                Identifies performance killers such as circular dependencies, type bloat, and complex generics through static analysis, helping developers improve IDE responsiveness and compilation efficiency.
            </div>
            <div>Project: <a href="https://github.com/example/tsbeast" target="_blank">https://github.com/example/tsbeast</a></div>
            <div>Report generated by: TSBeast v1.0.0</div>
            <div class="badge">TSBeast Audit Report</div>
        </div>
    </div>
</body>
</html>`;

    return html;
}

function calculateHealthScore(avgComplexity, issues) {
    var score = 100;
    score -= avgComplexity * 2;
    score -= issues.critical * 10;
    score -= issues.warning * 3;
    score -= issues.info * 1;
    return Math.max(0, Math.round(score));
}

function getHealthLevel(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'warning';
    return 'critical';
}

function getHealthLevelText(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Attention';
    return 'Critical';
}

function calculateDependencyDepth() {
    var depthMap = {};
    for (var i = 0; i < fileDataList.length; i++) {
        var depth = fileDataList[i].importCount > 0 ? Math.min(Math.floor(fileDataList[i].importCount / 5) + 1, 5) : 1;
        depthMap[depth] = (depthMap[depth] || 0) + 1;
    }
    
    var result = [];
    for (var depth in depthMap) {
        result.push({ depth: parseInt(depth), count: depthMap[depth] });
    }
    result.sort(function(a, b) { return a.depth - b.depth; });
    return result;
}

function generateOptimizationSuggestions(avgComplexity, issues, fileCount) {
    var suggestions = [];
    
    if (avgComplexity > 8) {
        suggestions.push('[High Priority] Consider splitting giant type definitions, decompose complex types into smaller ones');
    }
    
    if (issues.critical > 0) {
        suggestions.push('[High Priority] Fix all CRITICAL issues, especially circular dependencies');
    }
    
    if (fileCount > 100) {
        suggestions.push('Enable incremental mode to speed up incremental compilation');
        suggestions.push('Consider using skipLibCheck to skip third-party library type checking');
    }
    
    if (issues.warning > issues.critical * 2) {
        suggestions.push('Batch process WARNING level type bloat issues');
    }
    
    if (avgComplexity > 6) {
        suggestions.push('Review generic usage, avoid excessive nesting');
    }
    
    suggestions.push('Run TSBeast regularly for performance audits');
    
    return suggestions;
}

function copyCitation() {
    var citeCode = document.getElementById('citeCode');
    var citeButton = document.getElementById('citeButton');
    
    navigator.clipboard.writeText(citeCode.textContent).then(function() {
        var originalText = citeButton.textContent;
        citeButton.textContent = 'Copied!';
        citeButton.style.background = '#3fb950';
        citeButton.style.color = '#0d1117';
        
        setTimeout(function() {
            citeButton.textContent = originalText;
            citeButton.style.background = '';
            citeButton.style.color = '';
        }, 2000);
    }).catch(function(err) {
        console.error('Copy failed:', err);
        alert('Copy failed, please copy manually');
    });
