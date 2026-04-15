'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TenantConfig } from '../../../lib/tenant';

interface FanGuardAppProps {
  tenant: TenantConfig;
}

// 定义全局翻译对象
const STRINGS = {
  // UI 元素
  APP_TITLE: 'FanGuard: Idol Sentiment AI',
  PRIVACY_MODE: 'Privacy Mode Active',
  TEXT_PLACEHOLDER: 'Paste comments or posts here...',
  
  // 操作按钮
  BUTTON_ANALYZE: 'Analyze',
  BUTTON_CLEAR: 'Clear',
  BUTTON_EXPORT_JSON: 'Export JSON',
  BUTTON_EXPORT_MARKDOWN: 'Export Markdown',
  
  // 看板标题
  DASHBOARD_SENTIMENT: 'Sentiment Distribution',
  DASHBOARD_THEMES: 'Discussion Themes',
  DASHBOARD_ALERTS: 'Analysis Alerts',
  
  // 情感标签
  SENTIMENT_POSITIVE: 'Positive',
  SENTIMENT_NEUTRAL: 'Neutral',
  SENTIMENT_NEGATIVE: 'Negative',
  SENTIMENT_SARCASTIC: 'Sarcastic',
  SENTIMENT_ANXIOUS: 'Anxious',
  
  // 主题类别
  TOPIC_MEMBER_UPDATES: 'Member Updates',
  TOPIC_FAN_MUTUAL_AID: 'Fan Mutual Aid',
  TOPIC_QUESTIONS_COMPLAINTS: 'Questions/Complaints',
  TOPIC_EMOTIONAL_RELEASE: 'Emotional Release',
  
  // 其他
  LOADING_MODEL: 'Loading model...',
  DOWNLOADING_MODEL: 'Downloading model...',
  ANALYZING: 'Analyzing...',
  PLEASE_ENTER_COMMENTS: 'Please enter comment content',
  ANALYSIS_FAILED: 'Analysis failed, please try again',
  PLEASE_ANALYZE_FIRST: 'Please analyze first',
  REVERSAL_TAG: '[Reversal]',
  CONFIDENCE: 'Confidence: ',
  TIME: 'Time: ',
  COMMENTS: ' comments',
  MORE_COMMENTS: '... and {count} more'
};

// 定义共享的常量对象
const CONSTANTS = {
  SENTIMENT_LABELS: {
    POSITIVE: STRINGS.SENTIMENT_POSITIVE,
    NEUTRAL: STRINGS.SENTIMENT_NEUTRAL,
    NEGATIVE: STRINGS.SENTIMENT_NEGATIVE,
    SARCASTIC: STRINGS.SENTIMENT_SARCASTIC,
    ANXIOUS: STRINGS.SENTIMENT_ANXIOUS
  },
  TOPIC_CATEGORIES: {
    MEMBER_UPDATES: STRINGS.TOPIC_MEMBER_UPDATES,
    FAN_MUTUAL_AID: STRINGS.TOPIC_FAN_MUTUAL_AID,
    QUESTIONS_COMPLAINTS: STRINGS.TOPIC_QUESTIONS_COMPLAINTS,
    EMOTIONAL_RELEASE: STRINGS.TOPIC_EMOTIONAL_RELEASE
  }
};

// 关键词映射库
const IDOL_DICT = {
  SINCERE: [
    '救赎', '感谢遇见', '一直陪伴', '永远支持', '真心喜欢',
    '永远的神', '最棒的', '一起成长', '守护你', '不离不弃',
    '心之所向', '无可替代', '引以为傲', '温暖', '正能量'
  ],
  SARCASM: [
    '差不多得了', '太甜了', '小作文', '成分', '反转了',
    '不会吧', '就这', '笑了', '懂的都懂', '经典',
    '绝了', '蚌埠住了', '合着', '原来如此', '有够好笑'
  ],
  ANXIOUS: [
    '退圈', '毕业', '私联', '炎上', '压力',
    '解散', '争议', '负面', '危机', '担心',
    '焦虑', '失眠', '崩溃', '难过', '害怕'
  ]
};

// 聚类桶关键词
const CLUSTER_KEYWORDS = {
  'Member Updates': [
    '活动', '行程', '直播', '更新', '动态',
    '状态', '近况', '消息', '新闻', '照片',
    '视频', '分享', '日常', '生活', '工作',
    'concert', 'new song', 'album', 'event', 'schedule',
    'live', 'interview', 'variety', 'movie', 'TV show'
  ],
  'Fan Mutual Aid': [
    '互助', '帮助', '分享', '资源', '链接',
    '教程', '指南', '建议', '支持', '合作',
    '组队', '一起', '组织', '协调', '收集',
    'support', 'vote', 'ranking', 'fund', 'merchandise',
    'banner', 'light stick', 'support song', 'support event'
  ],
  'Questions/Complaints': [
    '质疑', '吐槽', '不满', '抱怨', '批评',
    '问题', '错误', '失误', '失望', '愤怒',
    '生气', '吐槽', '抱怨', '指责', '批评',
    'complain', 'question', 'dissatisfied', 'disappointed', 'angry',
    'protest', 'oppose', 'criticize', 'accuse', 'complaint'
  ],
  'Emotional Release': [
    '开心', '难过', '感动', '激动', '兴奋',
    '伤心', '愤怒', '焦虑', '紧张', '害怕',
    '喜悦', '悲伤', '痛苦', '快乐', '幸福',
    'happy', 'glad', 'excited', 'thrilled', 'moved',
    'sad', 'upset', 'depressed', 'angry', 'anxious'
  ]
};

// 情感分析器
class SentimentAnalyzer {
  private isLoading: boolean;
  private loadingProgress: number;

  constructor() {
    this.isLoading = false;
    this.loadingProgress = 0;
  }

  async initialize(progressCallback: (progress: number, cached: boolean) => void) {
    // 模拟模型加载过程
    this.isLoading = true;
    this.loadingProgress = 0;

    try {
      // 模拟加载进度
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        this.loadingProgress = i;
        if (progressCallback) {
          progressCallback(i, false);
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize sentiment analyzer:', error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async analyze(text: string) {
    try {
      // 基于关键词的简单情感分析
      const results = this.keywordBasedAnalysis(text);
      // 应用情感加权算法
      return this.applySentimentWeighting(text, results);
    } catch (error) {
      console.error('Error in analyze:', error);
      return [{ label: 'Neutral', score: 0.5 }];
    }
  }

  // 基于关键词的简单情感分析
  keywordBasedAnalysis(text: string) {
    let score = 0;
    let label = 'Neutral';

    try {
      // 检查真诚词
      const sincereCount = IDOL_DICT.SINCERE.filter(word => text.includes(word)).length;
      // 检查阴阳怪气词
      const sarcasmCount = IDOL_DICT.SARCASM.filter(word => text.includes(word)).length;
      // 检查焦虑词
      const anxiousCount = IDOL_DICT.ANXIOUS.filter(word => text.includes(word)).length;

      // 计算情感得分
      score = sincereCount * 0.2 - sarcasmCount * 0.15 - anxiousCount * 0.1;

      // 确定情感标签
      if (score > 0.3) {
        label = 'Positive';
      } else if (score < -0.2) {
        label = 'Negative';
      } else if (sarcasmCount > 0) {
        label = 'Sarcastic';
      } else if (anxiousCount > 0) {
        label = 'Anxious';
      }
    } catch (error) {
      console.error('Error in keywordBasedAnalysis:', error);
    }

    return [{ label, score: Math.abs(score) }];
  }

  // 情感加权算法
  applySentimentWeighting(text: string, results: { label: string; score: number }[]) {
    try {
      let finalResults = [...results];
      
      // 检查阴阳怪气表情
      const sarcasmEmojis = ['😅', '🤡', '🙄', '😏', '😒'];
      const hasSarcasmEmoji = sarcasmEmojis.some(emoji => text.includes(emoji));
      
      // 检查关键词
      const hasSincereWords = IDOL_DICT.SINCERE.some(word => text.includes(word));
      const hasSarcasmWords = IDOL_DICT.SARCASM.some(word => text.includes(word));
      const hasAnxiousWords = IDOL_DICT.ANXIOUS.some(word => text.includes(word));
      
      // 应用加权逻辑
      if (hasSarcasmEmoji && finalResults[0].score > 0.5 && finalResults[0].label.includes('Positive')) {
        // 如果检测到阴阳怪气表情且情感值为正，强制设为疑似阴阳怪气
        finalResults = [{
          label: 'Sarcastic',
          score: 0.9
        }];
      } else if (hasSarcasmWords) {
        // 如果包含阴阳怪气词，降低正面情感分数
        finalResults = finalResults.map(result => {
          if (result.label.includes('Positive')) {
            return {
              ...result,
              score: Math.max(0.1, result.score * 0.5),
              label: 'Sarcastic'
            };
          }
          return result;
        });
      } else if (hasSincereWords) {
        // 如果包含真诚词，提高正面情感分数
        finalResults = finalResults.map(result => {
          if (result.label.includes('Positive')) {
            return {
              ...result,
              score: Math.min(1.0, result.score * 1.2)
            };
          }
          return result;
        });
      } else if (hasAnxiousWords) {
        // 如果包含焦虑词，调整为负面情感
        finalResults = [{
          label: 'Anxious',
          score: 0.8
        }];
      }
      
      return finalResults;
    } catch (error) {
      console.error('Error in applySentimentWeighting:', error);
      return results;
    }
  }

  // 文本聚类逻辑
  clusterComments(comments: string[]) {
    try {
      const clusters: { [key: string]: string[] } = {
        'Member Updates': [],
        'Fan Mutual Aid': [],
        'Questions/Complaints': [],
        'Emotional Release': []
      };

      comments.forEach(comment => {
        let maxScore = 0;
        let bestCluster = 'Emotional Release'; // 默认类别

        // 计算每个聚类的得分
        Object.entries(CLUSTER_KEYWORDS).forEach(([cluster, keywords]) => {
          let score = 0;
          keywords.forEach(keyword => {
            if (comment.includes(keyword)) {
              score++;
            }
          });
          if (score > maxScore) {
            maxScore = score;
            bestCluster = cluster;
          }
        });

        clusters[bestCluster].push(comment);
      });

      return clusters;
    } catch (error) {
      console.error('Error in clusterComments:', error);
      return {
        'Member Updates': [],
        'Fan Mutual Aid': [],
        'Questions/Complaints': [],
        'Emotional Release': []
      };
    }
  }

  // 反转追踪器
  detectReversal(text: string) {
    try {
      // 分割句子
      const sentences = text.split(/[\n。！？.!?]/).filter(s => s.trim());
      
      if (sentences.length < 2) {
        return false;
      }

      // 分割前50%和后50%内容
      const midPoint = Math.floor(sentences.length / 2);
      const firstHalf = sentences.slice(0, midPoint).join(' ');
      const secondHalf = sentences.slice(midPoint).join(' ');

      // 检查前半部分是否为正向
      const hasPositiveWords = IDOL_DICT.SINCERE.some(word => firstHalf.includes(word));
      
      // 检查后半部分是否出现负向核心词
      const hasNegativeWords = IDOL_DICT.SARCASM.some(word => secondHalf.includes(word)) ||
                             IDOL_DICT.ANXIOUS.some(word => secondHalf.includes(word));

      return hasPositiveWords && hasNegativeWords;
    } catch (error) {
      console.error('Error in detectReversal:', error);
      return false;
    }
  }
}

const sentimentAnalyzer = new SentimentAnalyzer();

export default function FanGuardApp({ tenant }: FanGuardAppProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCached, setIsCached] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<{
    comment: string;
    result: { label: string; score: number };
    hasReversal: boolean;
  }[]>([])
  const [clusters, setClusters] = useState<{ [key: string]: string[] }>({
    'Member Updates': [],
    'Fan Mutual Aid': [],
    'Questions/Complaints': [],
    'Emotional Release': []
  })
  
  // 使用useMemo强制派生统计数据
  const stats = useMemo(() => {
    if (!analysisResults || analysisResults.length === 0) {
      return {
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        total: 0,
        topicCounts: {
          'Member Updates': 0,
          'Fan Mutual Aid': 0,
          'Questions/Complaints': 0,
          'Emotional Release': 0
        }
      }
    }

    // 计算情感分布
    const sentimentStats = analysisResults.reduce((acc, item) => {
      const label = item.result.label
      if (label === CONSTANTS.SENTIMENT_LABELS.POSITIVE) {
        acc.positiveCount++
      } else if (label === CONSTANTS.SENTIMENT_LABELS.NEUTRAL) {
        acc.neutralCount++
      } else if (
        label === CONSTANTS.SENTIMENT_LABELS.NEGATIVE ||
        label === CONSTANTS.SENTIMENT_LABELS.SARCASTIC ||
        label === CONSTANTS.SENTIMENT_LABELS.ANXIOUS
      ) {
        acc.negativeCount++
      }
      return acc
    }, { positiveCount: 0, neutralCount: 0, negativeCount: 0, total: analysisResults.length })

    // 计算主题分布
    const topicCounts = {
      'Member Updates': clusters['Member Updates']?.length || 0,
      'Fan Mutual Aid': clusters['Fan Mutual Aid']?.length || 0,
      'Questions/Complaints': clusters['Questions/Complaints']?.length || 0,
      'Emotional Release': clusters['Emotional Release']?.length || 0
    }

    return {
      ...sentimentStats,
      topicCounts
    }
  }, [analysisResults, clusters])

  const handleAnalyze = async () => {
    console.log('开始分析...')
    if (!text.trim()) {
      alert(STRINGS.PLEASE_ENTER_COMMENTS)
      return
    }

    setLoading(true)
    setProgress(0)

    try {
      console.log('初始化情感分析器...')
      await sentimentAnalyzer.initialize((progressValue, cached) => {
        setProgress(progressValue)
        setIsCached(cached)
        console.log('加载进度:', progressValue, '%')
      })

      // 聚类分析（如果输入包含多条评论，按换行分割）
      console.log('进行聚类分析...')
      const comments = text.split('\n').filter(comment => comment.trim())
      console.log('分割后的评论:', comments)
      const newClusters = sentimentAnalyzer.clusterComments(comments)
      console.log('聚类结果:', newClusters)
      
      // 对每条评论单独进行分析
      console.log('对每条评论单独分析...')
      const individualResults = []
      for (const comment of comments) {
        const commentResult = await sentimentAnalyzer.analyze(comment)
        const commentHasReversal = sentimentAnalyzer.detectReversal(comment)
        individualResults.push({
          comment,
          result: commentResult[0],
          hasReversal: commentHasReversal
        })
      }
      console.log('单独分析结果:', individualResults)
      
      // 更新状态
      setAnalysisResults(individualResults)
      setClusters(newClusters)
      console.log('分析完成，更新状态')
    } catch (error) {
      console.error('Analysis error:', error)
      alert(STRINGS.ANALYSIS_FAILED)
    } finally {
      setLoading(false)
      console.log('分析过程结束')
    }
  }

  const handleClear = () => {
    setText('')
    setAnalysisResults([])
    setClusters({
      'Member Updates': [],
      'Fan Mutual Aid': [],
      'Questions/Complaints': [],
      'Emotional Release': []
    })
  }

  const handleExport = () => {
    if (!analysisResults || analysisResults.length === 0) {
      alert(STRINGS.PLEASE_ANALYZE_FIRST)
      return
    }

    const exportData = {
      sentiment: analysisResults,
      clusters: clusters
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Sentiment_Report_${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportMarkdown = () => {
    if (!analysisResults || analysisResults.length === 0) {
      alert(STRINGS.PLEASE_ANALYZE_FIRST)
      return
    }

    // 生成Markdown内容
    let markdown = `# FanGuard Idol Sentiment Analysis Report\n\n`
    markdown += `Generated at: ${new Date().toLocaleString()}\n\n`
    
    // 情感分析结果
    markdown += `## Sentiment Analysis Results\n`
    // 计算总体情感分布
    const positiveCount = analysisResults.filter(item => item.result.label === CONSTANTS.SENTIMENT_LABELS.POSITIVE).length
    const neutralCount = analysisResults.filter(item => item.result.label === CONSTANTS.SENTIMENT_LABELS.NEUTRAL).length
    const negativeCount = analysisResults.filter(item => 
      item.result.label === CONSTANTS.SENTIMENT_LABELS.NEGATIVE ||
      item.result.label === CONSTANTS.SENTIMENT_LABELS.SARCASTIC ||
      item.result.label === CONSTANTS.SENTIMENT_LABELS.ANXIOUS
    ).length
    
    markdown += `- ${STRINGS.SENTIMENT_POSITIVE}: ${positiveCount} (${Math.round((positiveCount / analysisResults.length) * 100)}%)\n`
    markdown += `- ${STRINGS.SENTIMENT_NEUTRAL}: ${neutralCount} (${Math.round((neutralCount / analysisResults.length) * 100)}%)\n`
    markdown += `- ${STRINGS.SENTIMENT_NEGATIVE}: ${negativeCount} (${Math.round((negativeCount / analysisResults.length) * 100)}%)\n\n`

    // 文本聚类结果
    markdown += `## Text Clustering Results\n`
    Object.entries(clusters).forEach(([cluster, comments]) => {
      markdown += `### ${cluster} (${comments.length} ${STRINGS.COMMENTS})\n`
      comments.forEach(comment => {
        markdown += `- ${comment}\n`
      })
      markdown += `\n`
    })

    // 生成并下载文件
    const dataBlob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Sentiment_Report_${new Date().toISOString().slice(0, 10)}.md`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-bold mb-4" style={{ color: tenant.theme.primaryColor }}>
          {STRINGS.APP_TITLE}
        </h2>
        <p className="text-gray-600 mb-6">
          Analyze fan comments and social media posts to understand sentiment trends.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <textarea
            className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder={STRINGS.TEXT_PLACEHOLDER}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          
          {/* 进度条 */}
          {loading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{isCached ? STRINGS.LOADING_MODEL : STRINGS.DOWNLOADING_MODEL}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* 控制台 */}
          <div className="mt-4 flex flex-wrap gap-4">
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
              style={{
                background: `linear-gradient(90deg, ${tenant.theme.primaryColor}, ${tenant.theme.secondaryColor})`,
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? STRINGS.ANALYZING : STRINGS.BUTTON_ANALYZE}
            </button>
            <button 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors duration-200 font-medium"
              onClick={handleClear}
              disabled={loading}
            >
              {STRINGS.BUTTON_CLEAR}
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={handleExport}
              disabled={loading || !analysisResults || analysisResults.length === 0}
            >
              {STRINGS.BUTTON_EXPORT_JSON}
            </button>
            <button 
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
              style={{
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={handleExportMarkdown}
              disabled={loading || !analysisResults || analysisResults.length === 0}
            >
              {STRINGS.BUTTON_EXPORT_MARKDOWN}
            </button>
          </div>
        </div>
      </section>
      
      {/* 结果面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 情感分布柱状图 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">{STRINGS.DASHBOARD_SENTIMENT}</h2>
          <div className="h-48 rounded-lg flex items-end justify-around p-4" style={{ background: `${tenant.theme.secondaryColor}20` }}>
            {analysisResults && analysisResults.length > 0 ? (
              <>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 bg-blue-500 rounded-t-md" 
                    style={{ 
                      height: `${stats.total > 0 ? Math.round((stats.positiveCount / stats.total) * 100) : 0}%` 
                    }}
                  >
                    <span className="text-xs text-white font-bold px-1">{stats.positiveCount}</span>
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{STRINGS.SENTIMENT_POSITIVE}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 bg-yellow-500 rounded-t-md" 
                    style={{ 
                      height: `${stats.total > 0 ? Math.round((stats.neutralCount / stats.total) * 100) : 0}%` 
                    }}
                  >
                    <span className="text-xs text-white font-bold px-1">{stats.neutralCount}</span>
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{STRINGS.SENTIMENT_NEUTRAL}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 bg-red-500 rounded-t-md" 
                    style={{ 
                      height: `${stats.total > 0 ? Math.round((stats.negativeCount / stats.total) * 100) : 0}%` 
                    }}
                  >
                    <span className="text-xs text-white font-bold px-1">{stats.negativeCount}</span>
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{STRINGS.SENTIMENT_NEGATIVE}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-blue-500 rounded-t-md" style={{ height: '60%' }}></div>
                  <span className="text-xs mt-2 text-gray-600">{STRINGS.SENTIMENT_POSITIVE}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-yellow-500 rounded-t-md" style={{ height: '30%' }}></div>
                  <span className="text-xs mt-2 text-gray-600">{STRINGS.SENTIMENT_NEUTRAL}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-red-500 rounded-t-md" style={{ height: '10%' }}></div>
                  <span className="text-xs mt-2 text-gray-600">{STRINGS.SENTIMENT_NEGATIVE}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 核心讨论主题 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">{STRINGS.DASHBOARD_THEMES}</h2>
          <ul className="space-y-2">
            {analysisResults && analysisResults.length > 0 ? (
              Object.entries(stats.topicCounts).map(([cluster, count], index) => {
                return (
                  <li key={index} className={`flex items-center p-2 ${index % 2 === 0 ? `${tenant.theme.primaryColor}20` : `${tenant.theme.secondaryColor}20`} rounded-md`} style={{ background: index % 2 === 0 ? `${tenant.theme.primaryColor}20` : `${tenant.theme.secondaryColor}20` }}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-pink-500' : index === 2 ? 'bg-purple-500' : 'bg-green-500'}`}></span>
                    <span className="text-sm">{cluster} ({count} {STRINGS.COMMENTS})</span>
                  </li>
                )
              })
            ) : (
              <>
                <li className="flex items-center p-2 rounded-md" style={{ background: `${tenant.theme.primaryColor}20` }}>
                  <span className="w-2 h-2 rounded-full mr-2 bg-blue-500"></span>
                  <span className="text-sm">Performance (23 {STRINGS.COMMENTS})</span>
                </li>
                <li className="flex items-center p-2 rounded-md" style={{ background: `${tenant.theme.secondaryColor}20` }}>
                  <span className="w-2 h-2 rounded-full mr-2 bg-pink-500"></span>
                  <span className="text-sm">Member Interaction (15 {STRINGS.COMMENTS})</span>
                </li>
                <li className="flex items-center p-2 rounded-md" style={{ background: `${tenant.theme.primaryColor}20` }}>
                  <span className="w-2 h-2 rounded-full mr-2 bg-purple-500"></span>
                  <span className="text-sm">Song Quality (8 {STRINGS.COMMENTS})</span>
                </li>
                <li className="flex items-center p-2 rounded-md" style={{ background: `${tenant.theme.secondaryColor}20` }}>
                  <span className="w-2 h-2 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">Fan Benefits (5 {STRINGS.COMMENTS})</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* 预警评论列表 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">{STRINGS.DASHBOARD_ALERTS}</h2>
          <div className="space-y-3">
            {analysisResults && analysisResults.length > 0 ? (
              analysisResults
                .filter(item => 
                  item.result.label === CONSTANTS.SENTIMENT_LABELS.NEGATIVE || 
                  item.result.label === CONSTANTS.SENTIMENT_LABELS.ANXIOUS || 
                  item.result.label === CONSTANTS.SENTIMENT_LABELS.SARCASTIC ||
                  item.hasReversal
                )
                .slice(0, 2)
                .map((item, index) => (
                  <div key={index} className={`p-3 ${item.hasReversal ? 'bg-yellow-50 border border-yellow-100' : 'bg-red-50 border border-red-100'} rounded-md`}>
                    <p className="text-sm text-gray-800 mb-1">Comment: {item.comment.substring(0, 30)}{item.comment.length > 30 ? '...' : ''}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Sentiment: {item.result.label}</span>
                      <span>{STRINGS.TIME}{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
            ) : (
              <>
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm text-red-800 mb-1">Comment: This is a negative comment that needs attention</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Sentiment: -0.8</span>
                    <span>{STRINGS.TIME}{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p className="text-sm text-yellow-800 mb-1">Comment: This comment is neutral but may be controversial</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Sentiment: 0.0</span>
                    <span>{STRINGS.TIME}{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* 分析结果 */}
      {analysisResults && analysisResults.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* 情感分析结果 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Sentiment Analysis Results</h2>
            <div className="space-y-4">
              {/* 显示总体情感分布 */}
              <div className="p-3 border border-gray-100 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{STRINGS.SENTIMENT_POSITIVE}</span>
                  <span className="text-sm text-gray-600">{stats.positiveCount} ({Math.round((stats.positiveCount / stats.total) * 100)}%)</span>
                </div>
              </div>
              <div className="p-3 border border-gray-100 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{STRINGS.SENTIMENT_NEUTRAL}</span>
                  <span className="text-sm text-gray-600">{stats.neutralCount} ({Math.round((stats.neutralCount / stats.total) * 100)}%)</span>
                </div>
              </div>
              <div className="p-3 border border-gray-100 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{STRINGS.SENTIMENT_NEGATIVE}</span>
                  <span className="text-sm text-gray-600">{stats.negativeCount} ({Math.round((stats.negativeCount / stats.total) * 100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 结果列表 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Comment Analysis List</h2>
            <div className="space-y-4">
              {analysisResults.map((item, index) => {
                // 根据情感标签选择颜色
                let badgeColor = 'bg-blue-100 text-blue-800';
                if (item.result.label.includes(STRINGS.SENTIMENT_NEGATIVE) || item.result.label.includes(STRINGS.SENTIMENT_ANXIOUS)) {
                  badgeColor = 'bg-red-100 text-red-800';
                } else if (item.result.label.includes(STRINGS.SENTIMENT_NEUTRAL)) {
                  badgeColor = 'bg-yellow-100 text-yellow-800';
                } else if (item.result.label.includes(STRINGS.SENTIMENT_SARCASTIC)) {
                  badgeColor = 'bg-purple-100 text-purple-800';
                }
                
                return (
                  <div key={index} className="p-4 border border-gray-100 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
                          {item.result.label}
                        </span>
                        {item.hasReversal && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {STRINGS.REVERSAL_TAG}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{Math.round(item.result.score * 100)}%</span>
                    </div>
                    <p className="text-sm text-gray-700">{item.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 文本聚类结果 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Text Clustering Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(clusters).map(([cluster, comments]) => (
                <div key={cluster} className="p-4 border border-gray-100 rounded-md">
                  <h3 className="font-medium mb-2 text-gray-700">{cluster}</h3>
                  <p className="text-sm text-gray-600 mb-2">{comments.length} {STRINGS.COMMENTS}</p>
                  <ul className="text-sm space-y-1">
                    {comments.slice(0, 3).map((comment, index) => (
                      <li key={index} className="truncate">{comment}</li>
                    ))}
                    {comments.length > 3 && (
                      <li className="text-gray-500">{STRINGS.MORE_COMMENTS.replace('{count}', (comments.length - 3).toString())}</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
