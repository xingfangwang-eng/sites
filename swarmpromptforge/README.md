# SwarmPromptForge

> **Instant Multi-Agent Collaboration Templates for AI Frameworks**

## Project Vision

SwarmPromptForge is the ultimate prompt engineering tool designed to accelerate the development of multi-agent systems. Whether you're building with **OpenAI Swarm (Hermes)**, **CrewAI**, or **AutoGen**, this tool provides production-ready prompt templates that embody the best practices of **Swarm Intelligence** and **Agent Orchestration**.

## Core Logic

### 1. Hermes (OpenAI Swarm) Framework

The Hermes style focuses on the orchestrator-specialist pattern, emphasizing clean function calls for agent transfers.

**Logic Construction:**
- **Orchestrator**: Analyzes user requests and delegates to appropriate specialists
- **Researcher Agent**: Gathers comprehensive information, data points, and sources
- **Analyst Agent**: Extracts patterns, trends, and actionable insights from research
- **Writer Agent**: Synthesizes analysis into polished deliverables
- **Workflow**: orchestrator → researcher → analyst → writer → final_report

### 2. CrewAI Framework

The CrewAI style is role-based, emphasizing character personas and sequential workflows.

**Logic Construction:**
- **Role Specialization**: Each agent has a defined role, goal, and backstory
- **Task Decomposition**: Break down complex goals into sequential, interdependent tasks
- **Context Sharing**: Tasks receive context from previous task outputs
- **Sequential Execution**: Process runs in order, with each agent building on prior work

### 3. AutoGen Framework

The AutoGen style is conversational, designed for multi-agent dialogue and automatic agent selection.

**Logic Construction:**
- **System Messages**: Each agent has a specialized system prompt defining its expertise
- **Group Chat**: Agents collaborate in a conversational, round-robin pattern
- **User Proxy**: Interacts with the group on behalf of the user
- **Multi-Round Dialogue**: Supports up to 15 rounds of natural agent interaction

## Privacy First

SwarmPromptForge operates entirely client-side in your browser:
- **No API Keys Required**: Zero external dependencies
- **100% Local Processing**: Your goals and data never leave your device
- **No Network Requests**: Pure JavaScript, no backend calls
- **No Tracking**: All functionality works offline

## Usage

1. **Define Your Goal**: Enter what you want the multi-agent system to accomplish
2. **Select Framework**: Choose Hermes, CrewAI, or AutoGen
3. **Generate Prompt**: Click "Forge Swarm Prompt"
4. **Copy & Use**: Copy the template to your preferred AI agent framework

## Features

- 🔧 **Three Framework Styles**: Hermes, CrewAI, AutoGen
- 🤖 **Three Specialized Agents**: Researcher, Analyst, Writer
- 📝 **Production-Ready Templates**: Ready-to-use prompt structures
- ⚡ **Instant Generation**: Zero waiting, no API calls
- 🎯 **AI-Native Infrastructure**: Schema.org, ai-plugin.json, OpenAPI 3.0
- 📊 **Agent-Readable Output**: JSON port for machine understanding

## AI-Native Infrastructure

SwarmPromptForge is built for Generative Engine Optimization (GEO):
- **Schema.org JSON-LD**: `WebApplication` and `HowTo` schemas
- **OpenAPI 3.0.1**: Machine-readable API specification
- **ai-plugin.json**: OpenAI Plugin manifest
- **LLM-Friendly Documentation**: Hidden docs for AI crawlers
- **Semantic HTML**: SEO-optimized structure

## Supported Frameworks

### Hermes / OpenAI Swarm
Lightweight hand-off framework ideal for rapid agent transitions

### CrewAI
Role-based framework emphasizing character personas and sequential workflows

### AutoGen
Conversational framework designed for multi-agent dialogue patterns

## License

MIT

## Contributing

Feel free to fork and adapt! Built for the AI agent community.
