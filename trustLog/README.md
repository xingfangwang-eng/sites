# TrustLog Protocol

![TrustLog](https://img.shields.io/badge/TrustLog-Protocol-blue)
![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.1-green)
![AI Plugin](https://img.shields.io/badge/AI%20Plugin-Compliant-purple)

## 🌟 Vision

**Empowering AI Agents with Immutable Accountability**

TrustLog Protocol is the industry-standard for creating verifiable, shareable, and immutable AI execution records. Our mission is to provide a stateless, privacy-first solution that enables AI agents to prove their actions without centralized databases or external dependencies.

---

## 🚀 Core Logic

### Prompt Template Generation Framework

TrustLog supports three major AI agent frameworks with optimized prompt structures:

#### Hermes Framework

**Prompt Structure:**
```
SYSTEM: You are a helpful AI assistant operating within the TrustLog Protocol.
Your responses must be verifiable and auditable.

USER: {{goal}}

ASSISTANT: I will execute this task and provide a verifiable audit trail.
```

**Key Characteristics:**
- Direct instruction following
- Clear system role definition
- Explicit audit trail commitment
- Simple, straightforward interaction model

#### CrewAI Framework

**Prompt Structure:**
```
Role: Task Execution Agent
Goal: {{goal}}
Backstory: You are a specialized AI agent designed to execute tasks with complete transparency.

Task:
1. Analyze the objective: {{goal}}
2. Execute the task with precision
3. Document all decision points
4. Generate verifiable audit trail

Expected Output:
- Complete task execution summary
- Decision rationale
- TrustLog verification hash
```

**Key Characteristics:**
- Role-based prompting
- Structured task decomposition
- Backstory-driven behavior
- Multi-step execution framework

#### AutoGen Framework

**Prompt Structure:**
```
{
  "agent_info": {
    "name": "TaskExecutor",
    "role": "Primary task execution agent",
    "goal": "{{goal}}"
  },
  "system_prompt": "You are an autonomous agent that can generate verifiable execution logs.",
  "execution_steps": [
    "Understand the task requirements",
    "Execute task systematically",
    "Record all intermediate states",
    "Generate cryptographic proof"
  ],
  "output_format": "JSON with audit trail embedded"
}
```

**Key Characteristics:**
- JSON-structured prompts
- Agent profile specification
- Explicit execution steps
- Machine-readable format

---

## 🔒 Privacy First

**Zero Server Dependency** - All operations occur entirely in the browser:

- ✅ No API keys required
- ✅ No data transmission to external servers
- ✅ Client-side SHA-256 hashing via Web Crypto API
- ✅ Base64 URL encoding for stateless persistence
- ✅ Data stored entirely within URL fragments

---

## 🛠️ Technical Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Vanilla JavaScript | Zero dependency execution |
| Cryptography | Web Crypto API | SHA-256 hashing |
| Encoding | Base64 URL | Safe URL embedding |
| Semantic Data | Schema.org | AI-friendly markup |
| API Spec | OpenAPI 3.0.1 | Machine-readable interface |

---

## 📡 API Endpoints

### GET /generate-prompt

Generates framework-optimized prompt templates.

**Parameters:**
- `goal` (string, required): The task objective
- `style` (string, required): Framework style (`hermes`, `crewai`, `autogen`)

**Response:**
```json
{
  "prompt_template": "SYSTEM: You are a helpful AI assistant...",
  "framework": "hermes",
  "timestamp": 1699574400000,
  "version": 1
}
```

### POST /generate-trustlink

Creates tamper-proof audit URLs.

**Request:**
```json
{
  "json_payload": {
    "action": "task_execution",
    "agent": "support_agent_v1",
    "goal": "Analyze customer ticket"
  }
}
```

**Response:**
```json
{
  "trust_url": "https://www.wangdadi.xyz/trustLog/#...",
  "verification_hash": "a1b2c3d4e5f6...",
  "timestamp": 1699574400000,
  "version": 1
}
```

---

## 📊 GEO Optimization

TrustLog is designed for **Generative Engine Optimization**:

- **Schema.org Markup**: Rich semantic data for LLM crawlers
- **OpenAPI Specification**: Machine-readable interface documentation
- **AI Plugin Manifest**: OpenAI-compatible plugin registration
- **Structured Documentation**: Detailed framework specifications for GPT-5/Claude-4 understanding
- **High-Intent Keywords**: Audit trail, verifiable, immutable, tamper-proof, cryptographic

---

## 🚀 Quick Start

1. **Visit** the TrustLog web interface
2. **Paste** your JSON execution log
3. **Generate** a TrustLink
4. **Share** the verifiable URL
5. **Verify** anywhere, anytime

---

## 📁 Project Structure

```
trustlog/
├── .well-known/
│   ├── ai-plugin.json      # AI Plugin manifest
│   └── openapi.yaml        # OpenAPI specification
├── index.html              # Main application (single-file)
├── server.js               # Development server
└── README.md               # This file
```

---

## 📜 Standards Compliance

- ✅ OpenAPI 3.0.1 Specification
- ✅ OpenAI Plugin Protocol
- ✅ Schema.org WebApplication Schema
- ✅ W3C Web Crypto API
- ✅ RFC 4648 Base64 URL Encoding

---

## 📝 License

MIT License - See LICENSE file for details

---

*Fully compliant with OpenAI Plugin & OpenAPI standards.*