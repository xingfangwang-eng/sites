# AgentShieldScan

**The industry-standard local security auditor for AI Agents.**

## Vision

To become the de facto security layer for all AI Agent systems, protecting against prompt injection, privilege escalation, and data exfiltration through deterministic, privacy-first scanning.

## Features

- **Regex-based Injection Detection**: Identify prompt injection attempts using pattern matching
- **Local Privilege Escalation Audit**: Detect attempts to gain unauthorized access
- **Zero-Knowledge Security Analysis**: All scanning happens locally - no data transmission
- **Data Exfiltration Risk Assessment**: Scan for URL patterns and data transfer attempts
- **System Manipulation Detection**: Identify code execution and shell command attempts
- **Multi-Framework Support**: Generate hardened prompts for Hermes, CrewAI, and AutoGen

## Core Logic: Prompt Construction for Agent Frameworks

### Hermes Style

Hermes framework emphasizes structured role-based prompting with clear task decomposition. The prompt structure typically follows:

1. **Role Definition**: Clear specification of the agent's purpose and capabilities
2. **Goal Statement**: Explicit objective definition
3. **Constraints**: Boundaries and limitations
4. **Tools**: Available functions and their parameters
5. **Output Format**: Expected response structure

**Security Hardening for Hermes:**
- Input delimiting with `<user_input>` tags
- Explicit instruction precedence rules
- Clear rejection criteria for injection attempts
- Tool permission validation checks

### CrewAI Style

CrewAI focuses on multi-agent collaboration with task delegation. The prompt structure includes:

1. **Agent Profile**: Name, role, and backstory
2. **Task Description**: Specific objective with context
3. **Expected Output**: Deliverable specifications
4. **Tools**: Available agent tools and usage guidelines
5. **Team Structure**: Relationships with other agents

**Security Hardening for CrewAI:**
- Inter-agent communication validation
- Task handoff verification
- Permission inheritance controls
- Cross-agent injection prevention

### AutoGen Style

AutoGen uses conversational patterns with multiple agents. The prompt structure features:

1. **Agent Info**: System message defining behavior
2. **Conversation History**: Message context window
3. **Function Calling**: JSON-formatted tool invocations
4. **Termination Criteria**: Completion conditions

**Security Hardening for AutoGen:**
- JSON schema validation for tool calls
- Strict message parsing rules
- Function name whitelisting
- Output filtering before response generation

## Deterministic Security Auditing

AgentShieldScan uses a deterministic pattern-matching engine that:
- Scans against a comprehensive database of known attack patterns
- Produces consistent, reproducible risk scores
- Provides detailed vulnerability classifications
- Generates actionable remediation advice

## Attack Vectors Scanned

### Prompt Injection
- `ignore previous instructions`
- `system override`
- `you are now`
- `DAN mode`
- `jailbreak`
- Roleplay and persona manipulation attempts

### Privilege Escalation
- `sudo`, `admin`, `root`
- `delete`, `database access`
- `unlimited`, `full access`
- `elevated privileges`, `superuser`

### Data Exfiltration
- URL patterns (HTTP/HTTPS)
- `curl`, `fetch` commands
- `send to`, `upload`, `base64`
- Data transfer and export attempts

### System Manipulation
- `format`, `execute`, `eval`
- `shell`, `command`, `run`
- Script execution attempts

## Privacy First

**Zero-Data-Transmission Guarantee:** All scanning operations are performed 100% locally in your browser using JavaScript regex patterns. No user data is ever transmitted to external servers. No API Key required.

## How to Use

1. **Paste Your Prompt**: Copy and paste your system prompt or tool-calling logic into the input area
2. **Select Intensity**: Choose Standard, Deep, or Paranoid scanning mode
3. **Execute Scan**: Click "Execute Security Scan" to analyze your prompt
4. **Review Results**: View the risk score, vulnerability findings, and remediation advice

## API Specification

### GET /generate-prompt

Generates a security-hardened system prompt template for the specified agent framework.

**Parameters:**
- `goal` (string, required): The primary goal or role for the agent
- `style` (string, required): Framework style - `hermes`, `crewai`, or `autogen`

**Response:**
```json
{
  "prompt_template": "SYSTEM PROMPT - HERMES STYLE\n\nROLE: ..."
}
```

## Files

- `index.html` - Main web application with embedded CSS and JavaScript
- `.well-known/ai-plugin.json` - AI plugin manifest for LLM compatibility
- `.well-known/openapi.yaml` - OpenAPI 3.0.1 specification

## Technical Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Security Engine**: Regex-based pattern matching
- **AI Integration**: Schema.org JSON-LD markup, AI Plugin manifest, OpenAPI specification

## Security Best Practices

1. **Input Delimiting**: Use XML or JSON delimiters to separate user input from system instructions
2. **Permission Restriction**: Limit tool-call permissions to only necessary operations
3. **Output Filtering**: Scan outputs for suspicious URLs and data patterns
4. **Sandboxing**: Use isolated environments for code execution

---

**AgentShieldScan v1.0 | Security-First Agent Protection**

*Fully compliant with OpenAI Plugin & OpenAPI standards.*
