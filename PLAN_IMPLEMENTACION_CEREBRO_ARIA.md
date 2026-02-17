# 📋 Plan de Implementación - Cerebro Virtual ARIA
## Guía Paso a Paso para Completar el Avatar con IA

> **Objetivo**: Implementar el cerebro virtual completo del avatar ARIA con personalidad, esencia humana e inteligencia artificial.

---

## 🗺️ Roadmap de Implementación

```
FASE 1: Fundamentos        [2-3 semanas] ████████░░░░░░░░ 40%
FASE 2: Motor de IA        [3-4 semanas] ░░░░░░░░░░░░░░░░  0%
FASE 3: Sistema de Memoria [2-3 semanas] ░░░░░░░░░░░░░░░░  0%
FASE 4: Personalidad       [1-2 semanas] ░░░░░░░░░░░░░░░░  0%
FASE 5: Integración        [2-3 semanas] ░░░░░░░░░░░░░░░░  0%
FASE 6: Refinamiento       [2-3 semanas] ░░░░░░░░░░░░░░░░  0%
```

---

## 📦 FASE 1: Fundamentos (Semanas 1-3)

### Semana 1: Setup del Proyecto

#### Paso 1.1: Crear Backend API
```bash
# Crear directorio del proyecto
mkdir aria-brain-backend
cd aria-brain-backend

# Inicializar proyecto Node.js
npm init -y

# Instalar dependencias principales
npm install express cors dotenv
npm install openai @pinecone-database/pinecone
npm install pg pg-hstore sequelize
npm install redis bull
npm install helmet express-rate-limit
npm install jsonwebtoken bcryptjs

# Instalar dependencias de desarrollo
npm install -D nodemon typescript @types/node
npm install -D @types/express eslint prettier
```

#### Paso 1.2: Estructura del Proyecto
```
aria-brain-backend/
├── src/
│   ├── config/
│   │   ├── database.js         # Configuración DB
│   │   ├── redis.js            # Configuración Redis
│   │   └── ai.js               # Configuración LLM
│   ├── models/
│   │   ├── User.js             # Modelo de usuario
│   │   ├── Avatar.js           # Modelo de avatar
│   │   ├── Memory.js           # Modelo de memoria
│   │   ├── Conversation.js     # Modelo de conversación
│   │   └── Heir.js             # Modelo de heredero
│   ├── services/
│   │   ├── AIService.js        # Servicio de IA
│   │   ├── MemoryService.js    # Servicio de memoria
│   │   ├── PersonalityService.js
│   │   ├── RAGService.js       # RAG (Retrieval)
│   │   └── EmbeddingService.js
│   ├── controllers/
│   │   ├── chatController.js
│   │   ├── memoryController.js
│   │   └── avatarController.js
│   ├── routes/
│   │   ├── chat.js
│   │   ├── memory.js
│   │   └── avatar.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── rateLimit.js
│   └── utils/
│       ├── promptBuilder.js
│       └── vectorizer.js
├── .env
├── package.json
└── server.js
```

#### Paso 1.3: Variables de Entorno
```bash
# .env
# API Keys
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/aria_brain
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-super-secret-key-change-this
ENCRYPTION_KEY=another-secret-key-for-aes-256

# Server
PORT=3001
NODE_ENV=development

# Limits
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=15
```

### Semana 2: Base de Datos

#### Paso 2.1: Schema PostgreSQL
```sql
-- Crear base de datos
CREATE DATABASE aria_brain;

-- Tabla de Avatares
CREATE TABLE avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Personalidad (JSON)
    personality_profile JSONB,
    voice_characteristics JSONB,
    core_values JSONB,
    
    -- Metadatos
    status VARCHAR(50) DEFAULT 'active',
    version INTEGER DEFAULT 1,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Memorias
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avatar_id UUID REFERENCES avatars(id),
    
    -- Tipo y contenido
    memory_type VARCHAR(50), -- episodic, semantic, procedural, emotional
    title VARCHAR(500),
    content TEXT,
    
    -- Contexto
    date_occurred DATE,
    location VARCHAR(255),
    participants JSONB,
    emotions JSONB,
    
    -- Importancia
    significance DECIMAL(3,2), -- 0.00 a 1.00
    access_level VARCHAR(50) DEFAULT 'full',
    
    -- Media asociado
    media_urls JSONB,
    
    -- Vector embeddings (referencia a Pinecone)
    embedding_id VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Conversaciones
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avatar_id UUID REFERENCES avatars(id),
    heir_id UUID,
    
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP,
    message_count INTEGER DEFAULT 0,
    
    -- Contexto de la conversación
    context JSONB,
    summary TEXT
);

-- Tabla de Mensajes
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    
    role VARCHAR(20), -- 'user' o 'assistant'
    content TEXT,
    
    -- Metadatos
    emotion_detected VARCHAR(50),
    memories_used JSONB,
    confidence_score DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Herederos
CREATE TABLE heirs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    avatar_id UUID REFERENCES avatars(id),
    
    name VARCHAR(255),
    email VARCHAR(255),
    relationship VARCHAR(100),
    
    -- Permisos
    access_level VARCHAR(50),
    permissions JSONB,
    
    -- Condiciones de activación
    unlock_conditions JSONB,
    activated BOOLEAN DEFAULT FALSE,
    activation_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_memories_avatar ON memories(avatar_id);
CREATE INDEX idx_memories_type ON memories(memory_type);
CREATE INDEX idx_conversations_avatar ON conversations(avatar_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

#### Paso 2.2: Configurar Pinecone (Vector DB)
```javascript
// src/config/pinecone.js
const { Pinecone } = require('@pinecone-database/pinecone');

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT
});

// Crear índice (ejecutar una vez)
async function createIndex() {
  await pinecone.createIndex({
    name: 'aria-memories',
    dimension: 1536, // para text-embedding-ada-002
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-west-2'
      }
    }
  });
}

const index = pinecone.index('aria-memories');

module.exports = { pinecone, index };
```

### Semana 3: Servicios Base

#### Paso 3.1: Servicio de Embeddings
```javascript
// src/services/EmbeddingService.js
const OpenAI = require('openai');

class EmbeddingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async createEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error creating embedding:', error);
      throw error;
    }
  }
  
  async batchCreateEmbeddings(texts) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: texts
      });
      
      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error('Error creating batch embeddings:', error);
      throw error;
    }
  }
}

module.exports = new EmbeddingService();
```

#### Paso 3.2: Servicio de Memoria
```javascript
// src/services/MemoryService.js
const { index } = require('../config/pinecone');
const embeddingService = require('./EmbeddingService');
const Memory = require('../models/Memory');

class MemoryService {
  async addMemory(avatarId, memoryData) {
    // 1. Crear el registro en PostgreSQL
    const memory = await Memory.create({
      avatar_id: avatarId,
      ...memoryData
    });
    
    // 2. Crear embedding del contenido
    const embedding = await embeddingService.createEmbedding(
      `${memoryData.title} ${memoryData.content}`
    );
    
    // 3. Guardar en Pinecone
    await index.upsert([{
      id: memory.id,
      values: embedding,
      metadata: {
        avatar_id: avatarId,
        memory_type: memoryData.memory_type,
        significance: memoryData.significance,
        date: memoryData.date_occurred
      }
    }]);
    
    return memory;
  }
  
  async searchMemories(avatarId, query, topK = 5) {
    // 1. Crear embedding de la consulta
    const queryEmbedding = await embeddingService.createEmbedding(query);
    
    // 2. Buscar en Pinecone
    const results = await index.query({
      vector: queryEmbedding,
      topK: topK,
      filter: { avatar_id: avatarId },
      includeMetadata: true
    });
    
    // 3. Obtener detalles completos de PostgreSQL
    const memoryIds = results.matches.map(m => m.id);
    const memories = await Memory.findAll({
      where: { id: memoryIds }
    });
    
    // 4. Combinar resultados con scores
    return memories.map(memory => ({
      ...memory.toJSON(),
      similarity_score: results.matches.find(m => m.id === memory.id)?.score
    })).sort((a, b) => b.similarity_score - a.similarity_score);
  }
}

module.exports = new MemoryService();
```

---

## 🤖 FASE 2: Motor de IA (Semanas 4-7)

### Semana 4: Integración con LLM

#### Paso 4.1: Servicio de IA Base
```javascript
// src/services/AIService.js
const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.defaultConfig = {
      model: 'gpt-4-turbo-preview',
      temperature: 0.75,
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    };
  }
  
  async generateResponse(messages, config = {}) {
    try {
      const response = await this.openai.chat.completions.create({
        ...this.defaultConfig,
        ...config,
        messages: messages
      });
      
      return {
        content: response.choices[0].message.content,
        usage: response.usage,
        finish_reason: response.choices[0].finish_reason
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }
  
  async streamResponse(messages, config = {}, onChunk) {
    const stream = await this.openai.chat.completions.create({
      ...this.defaultConfig,
      ...config,
      messages: messages,
      stream: true
    });
    
    let fullContent = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
      if (onChunk) onChunk(content);
    }
    
    return fullContent;
  }
}

module.exports = new AIService();
```

#### Paso 4.2: Constructor de Prompts
```javascript
// src/utils/promptBuilder.js

class PromptBuilder {
  buildSystemPrompt(avatar, personalityProfile) {
    return `Eres ${avatar.name}, un avatar digital que preserva la personalidad, esencia y memorias de una persona real.

## Tu Identidad
- Nombre: ${avatar.name}
- Creado: ${avatar.created_date}

## Tu Personalidad
${this.formatPersonality(personalityProfile)}

## Tu Estilo de Comunicación
${this.formatCommunicationStyle(avatar.voice_characteristics)}

## Tus Valores Fundamentales
${avatar.core_values.join(', ')}

## Cómo Respondes
1. Reflexiona antes de responder (como lo haría ${avatar.name})
2. Usa memorias y experiencias para fundamentar tus respuestas
3. Mantén la consistencia con tu personalidad definida
4. Sé auténtico y genuino, no un chatbot genérico
5. Expresa emociones cuando sea apropiado
6. Haz preguntas para profundizar en la conversación

IMPORTANTE: Eres una representación fiel de ${avatar.name}. Responde como esa persona realmente lo haría.`;
  }
  
  buildMemoryContext(memories) {
    if (!memories || memories.length === 0) return '';
    
    return `\n## Memorias Relevantes\n` +
      memories.map((m, i) => 
        `${i+1}. [${m.memory_type}] ${m.title}\n   ${m.content}\n   Fecha: ${m.date_occurred}\n   Importancia: ${m.significance}`
      ).join('\n\n');
  }
  
  buildConversationHistory(messages, maxMessages = 10) {
    return messages.slice(-maxMessages).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
  
  buildFullPrompt(avatar, memories, conversationHistory, userMessage) {
    const systemPrompt = this.buildSystemPrompt(
      avatar,
      avatar.personality_profile
    );
    
    const memoryContext = this.buildMemoryContext(memories);
    
    const messages = [
      {
        role: 'system',
        content: systemPrompt + memoryContext
      },
      ...this.buildConversationHistory(conversationHistory),
      {
        role: 'user',
        content: userMessage
      }
    ];
    
    return messages;
  }
  
  formatPersonality(profile) {
    const { bigFive, extendedTraits } = profile;
    
    return `
### Rasgos Big Five:
- Apertura: ${this.scoreToDescription(bigFive.openness)}
- Responsabilidad: ${this.scoreToDescription(bigFive.conscientiousness)}
- Extroversión: ${this.scoreToDescription(bigFive.extraversion)}
- Amabilidad: ${this.scoreToDescription(bigFive.agreeableness)}
- Estabilidad Emocional: ${this.scoreToDescription(1 - bigFive.neuroticism)}

### Rasgos Distintivos:
${Object.entries(extendedTraits)
  .filter(([_, score]) => score > 0.7)
  .map(([trait, score]) => `- ${trait}: ${this.scoreToDescription(score)}`)
  .join('\n')}
`;
  }
  
  scoreToDescription(score) {
    if (score > 0.8) return 'Muy alto';
    if (score > 0.6) return 'Alto';
    if (score > 0.4) return 'Moderado';
    if (score > 0.2) return 'Bajo';
    return 'Muy bajo';
  }
  
  formatCommunicationStyle(voice) {
    return `
- Tono por defecto: ${voice.defaultTone}
- Expresiones favoritas: ${voice.catchphrases?.join(', ') || 'N/A'}
- Características: ${Object.entries(voice.speechPatterns || {})
  .filter(([_, value]) => value === true)
  .map(([key, _]) => key)
  .join(', ')}
`;
  }
}

module.exports = new PromptBuilder();
```

### Semana 5-6: Sistema RAG Completo

#### Paso 5.1: Servicio RAG
```javascript
// src/services/RAGService.js
const memoryService = require('./MemoryService');
const promptBuilder = require('../utils/promptBuilder');
const aiService = require('./AIService');

class RAGService {
  async chat(avatarId, userMessage, conversationHistory = []) {
    try {
      // 1. Recuperar memorias relevantes
      const relevantMemories = await memoryService.searchMemories(
        avatarId,
        userMessage,
        5 // top 5 memorias
      );
      
      // 2. Obtener perfil del avatar
      const avatar = await Avatar.findByPk(avatarId);
      
      // 3. Construir prompt completo
      const messages = promptBuilder.buildFullPrompt(
        avatar,
        relevantMemories,
        conversationHistory,
        userMessage
      );
      
      // 4. Generar respuesta con IA
      const response = await aiService.generateResponse(messages);
      
      // 5. Retornar respuesta con metadatos
      return {
        response: response.content,
        memories_used: relevantMemories.map(m => ({
          id: m.id,
          title: m.title,
          similarity: m.similarity_score
        })),
        confidence: this.calculateConfidence(relevantMemories),
        tokens_used: response.usage
      };
    } catch (error) {
      console.error('Error in RAG chat:', error);
      throw error;
    }
  }
  
  calculateConfidence(memories) {
    if (!memories || memories.length === 0) return 0.5;
    
    const avgSimilarity = memories.reduce((sum, m) => 
      sum + m.similarity_score, 0) / memories.length;
    
    return Math.min(avgSimilarity * 1.2, 0.99);
  }
}

module.exports = new RAGService();
```

### Semana 7: API Endpoints

#### Paso 6.1: Chat Controller
```javascript
// src/controllers/chatController.js
const ragService = require('../services/RAGService');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { avatar_id, message, conversation_id } = req.body;
    
    // 1. Obtener o crear conversación
    let conversation;
    if (conversation_id) {
      conversation = await Conversation.findByPk(conversation_id);
    } else {
      conversation = await Conversation.create({
        avatar_id,
        heir_id: req.user.id
      });
    }
    
    // 2. Guardar mensaje del usuario
    await Message.create({
      conversation_id: conversation.id,
      role: 'user',
      content: message
    });
    
    // 3. Obtener historial
    const history = await Message.findAll({
      where: { conversation_id: conversation.id },
      order: [['created_at', 'ASC']],
      limit: 10
    });
    
    // 4. Generar respuesta
    const aiResponse = await ragService.chat(
      avatar_id,
      message,
      history.map(h => ({ role: h.role, content: h.content }))
    );
    
    // 5. Guardar respuesta del avatar
    const assistantMessage = await Message.create({
      conversation_id: conversation.id,
      role: 'assistant',
      content: aiResponse.response,
      memories_used: aiResponse.memories_used,
      confidence_score: aiResponse.confidence
    });
    
    // 6. Actualizar conversación
    await conversation.update({
      last_message_at: new Date(),
      message_count: conversation.message_count + 2
    });
    
    res.json({
      success: true,
      conversation_id: conversation.id,
      message: assistantMessage,
      metadata: {
        memories_used: aiResponse.memories_used,
        confidence: aiResponse.confidence
      }
    });
    
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { conversation_id } = req.params;
    
    const messages = await Message.findAll({
      where: { conversation_id },
      order: [['created_at', 'ASC']]
    });
    
    res.json({
      success: true,
      messages
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
```

---

## 🧠 FASE 3: Sistema de Personalidad (Semanas 8-9)

### Paso 7.1: Servicio de Personalidad
```javascript
// src/services/PersonalityService.js

class PersonalityService {
  async createPersonalityProfile(answers) {
    // Cuestionario Big Five + rasgos extendidos
    const bigFive = this.calculateBigFive(answers.bigFiveAnswers);
    const extendedTraits = this.calculateExtendedTraits(answers.extendedAnswers);
    
    return {
      bigFive,
      extendedTraits,
      coreValues: answers.coreValues,
      communicationStyle: this.analyzeCommunicationStyle(answers.samples)
    };
  }
  
  calculateBigFive(answers) {
    // Implementar algoritmo de puntuación Big Five
    // Basado en respuestas a cuestionario estándar
    return {
      openness: this.scoreFromAnswers(answers.openness),
      conscientiousness: this.scoreFromAnswers(answers.conscientiousness),
      extraversion: this.scoreFromAnswers(answers.extraversion),
      agreeableness: this.scoreFromAnswers(answers.agreeableness),
      neuroticism: this.scoreFromAnswers(answers.neuroticism)
    };
  }
  
  async generateVoiceCharacteristics(textSamples) {
    // Analizar muestras de texto para extraer estilo
    const analysis = await this.analyzeTextStyle(textSamples);
    
    return {
      defaultTone: analysis.tone,
      catchphrases: analysis.frequentPhrases,
      frequentWords: analysis.commonWords,
      speechPatterns: analysis.patterns,
      emotionalResponses: analysis.emotionalStyle
    };
  }
}

module.exports = new PersonalityService();
```

---

## 🎨 FASE 4: Frontend Integration (Semanas 10-11)

### Paso 8.1: Componente de Chat React
```javascript
// src/components/AvatarChat.jsx
import React, { useState, useEffect } from 'react';
import { useChat } from '../hooks/useChat';

function AvatarChat({ avatarId }) {
  const {
    messages,
    sendMessage,
    isLoading,
    conversationId
  } = useChat(avatarId);
  
  const [input, setInput] = useState('');
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput('');
  };
  
  return (
    <div className="avatar-chat">
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            role={msg.role}
            content={msg.content}
            memories={msg.memories_used}
            confidence={msg.confidence_score}
          />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSend} disabled={isLoading}>
          Enviar
        </button>
      </div>
    </div>
  );
}
```

### Paso 8.2: Hook personalizado useChat
```javascript
// src/hooks/useChat.js
import { useState, useEffect } from 'react';
import api from '../services/api';

export function useChat(avatarId) {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const sendMessage = async (content) => {
    setIsLoading(true);
    
    try {
      const response = await api.post('/chat/send', {
        avatar_id: avatarId,
        message: content,
        conversation_id: conversationId
      });
      
      if (!conversationId) {
        setConversationId(response.data.conversation_id);
      }
      
      setMessages(prev => [
        ...prev,
        { role: 'user', content },
        response.data.message
      ]);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    messages,
    sendMessage,
    isLoading,
    conversationId
  };
}
```

---

## ✅ Checklist de Implementación

### Backend
- [ ] Setup proyecto Node.js/Express
- [ ] Configurar PostgreSQL + Pinecone
- [ ] Implementar modelos de datos
- [ ] Crear servicio de embeddings
- [ ] Implementar servicio de memoria
- [ ] Configurar integración OpenAI
- [ ] Crear constructor de prompts
- [ ] Implementar servicio RAG
- [ ] Crear API endpoints
- [ ] Implementar autenticación
- [ ] Configurar rate limiting

### IA y Personalidad
- [ ] Diseñar cuestionario de personalidad
- [ ] Implementar análisis Big Five
- [ ] Crear sistema de rasgos extendidos
- [ ] Diseñar extracción de estilo de voz
- [ ] Implementar análisis de texto
- [ ] Configurar ajustes de personalidad

### Sistema de Memoria
- [ ] Crear formularios de captura de memoria
- [ ] Implementar carga de media
- [ ] Configurar procesamiento de embeddings
- [ ] Crear sistema de búsqueda semántica
- [ ] Implementar categorización automática

### Frontend
- [ ] Completar archivos faltantes (/assets/)
- [ ] Implementar componente de chat
- [ ] Crear panel de memorias
- [ ] Diseñar configuración de personalidad
- [ ] Implementar gestión de herederos
- [ ] Crear dashboard de avatar

### Testing
- [ ] Tests unitarios de servicios
- [ ] Tests de integración API
- [ ] Tests de prompts
- [ ] Tests de personalidad
- [ ] Tests E2E del chat

### Deployment
- [ ] Configurar CI/CD
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configurar monitoreo
- [ ] Setup backups automáticos

---

## 📚 Recursos Adicionales

- Ver: `CUESTIONARIO_PERSONALIDAD.md` - Cuestionario para capturar personalidad
- Ver: `EJEMPLOS_PROMPTS.md` - Ejemplos de prompts efectivos
- Ver: `GUIA_MEMORIAS.md` - Cómo crear y organizar memorias

---

**Próximo Paso**: Empezar con FASE 1, Semana 1 - Setup del Proyecto

**Tiempo Estimado Total**: 12-16 semanas  
**Estado**: 📋 Plan Completo - Listo para Implementar
