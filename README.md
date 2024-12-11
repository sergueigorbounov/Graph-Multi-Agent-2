# **README Étendu - Test Technique Développeur Fullstack**

---
![demo.png](public/demo.png)
### **🚀 [Application Déployée sur Vercel](https://graph-iaf4xjib0-sergueis-projects-5c54ca99.vercel.app)**  
Aucune installation nécessaire, testez directement l'application en ligne ! 🎄

---

## **Résumé du Projet**

Ce projet met en avant l'intégration d'outils avancés comme **LangGraph**, **LangChain**, et **NestJS** pour construire une architecture backend orchestrée par des agents communicants. Il démontre une expertise dans la création de workflows sophistiqués tout en intégrant des pratiques modernes de développement en TypeScript.

Le système est centré sur la gestion d'un panier d'achat enrichi par des recherches intelligentes et utilise une orchestration multi-agent avancée. L'application, déployée sur **Vercel**, propose également une interface engageante avec des fonctionnalités interactives comme un Easter egg.

👉 **[Graph Multi-Agent sur Vercel](https://graph-iaf4xjib0-sergueis-projects-5c54ca99.vercel.app)** 👈

---

## **Objectifs Techniques et Approche**

### **Intégration avec NestJS et TypeScript**

Le choix de **NestJS** comme framework backend était stratégique pour ses avantages suivants :
- **Modularité** : Simplifie l'intégration de services complexes, comme les agents définis dans **LangGraph**.
- **Support TypeScript** : Permet une typage strict, réduisant les erreurs et augmentant la maintenabilité.
- **Injecteurs de dépendances** : Utilisés pour brancher les agents et outils nécessaires dans les modules correspondants.

### **Principales Innovations**

#### **1. Conception Graphique avec LangGraph**
- Mise en place d'une orchestration des agents à l'aide d'un graphe défini via **LangGraph**.
- Gestion centralisée des états avec des annotations spécifiques, facilitant la communication entre agents.

#### **2. Utilisation de Technologies Avancées**
- **LangChain** pour orchestrer les prompts et interactions complexes.
- **Tavily** pour les recherches dynamiques sur Internet.
- **OpenAI API** pour les réponses basées sur des modèles LLM.

#### **3. Intégration Avancée des Modules**
- Les agents sont conçus en tant que **services NestJS**, intégrés dans des modules distincts pour une séparation des responsabilités.
- Les workflows sont orchestrés au sein d'un module dédié, qui utilise les agents comme dépendances.

---

## **Étapes de Développement**

### **1. Définir l’État**
- Une structure partagée est utilisée pour gérer les messages et états des agents. Cela est réalisé grâce à LangGraph et des annotations spécifiques.
- Exemple TypeScript :
  ```typescript
  const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
      default: () => [],
    }),
    next: Annotation<string>({
      reducer: (x, y) => y ?? x ?? END,
      default: () => END,
    }),
  });
  ```

### **2. Création des Agents avec NestJS**
- **Agent Tavily** : Implémenté comme un service NestJS qui intègre l'API Tavily pour effectuer des recherches.
- **Cart Manager** : Gestion des produits via des services utilisant des fichiers JSON comme base de données temporaire.
- **Agent Supervisor** : Orchestration des tâches entre les agents.


### **3. Construction du Graphe**
- Un graphe d'exécution des agents est défini via **LangGraph**, reliant les différents agents en fonction de leurs responsabilités.
- Exemple TypeScript :
  ```typescript
  const workflow = new StateGraph(AgentState)
    .addNode("researcher", tavilyNode)
    .addNode("cart_manager", cartManagerNode)
    .addNode("supervisor", supervisorChain)
    .addEdge(START, "supervisor")
    .addConditionalEdges("supervisor", (x) => x.next);
  ```

### **4. Orchestration des Flux avec LangSmith**
- Les interactions entre les agents sont supervisées et ajustées via LangSmith.

---

## **Fonctionnalités Techniques**

1. **Endpoint Unique : `/invoke?query={user_query}`**
   - Fournit une interface utilisateur simple via une seule route API.

2. **Orchestration Multi-Agent** :
   - Les agents collaborent pour exécuter des tâches basées sur les requêtes des utilisateurs.

3. **Gestion d’État Partagée** :
   - Les messages et états des agents sont centralisés dans une structure commune.

4. **Logs et Visualisation** :
   - Les actions sont affichées en temps réel via une interface HTML/CSS.

---

## **Requêtes Exemples**

### **Ajouter un Produit :**
```bash
GET /invoke?query=Ajoute un sapin de Noël à mon panier
```
**Réponse :**  
```
Le produit "Sapin de Noël" a été ajouté à votre panier.
```

### **Rechercher un Produit et l’Ajouter :**
```bash
GET /invoke?query=Recherche un sapin de Noël chez Ikea et ajoute-le au panier
```
**Réponse :**  
```
Le produit "Sapin IKEA" a été trouvé et ajouté à votre panier.
```

### **Afficher le Panier :**
```bash
GET /invoke?query=Affiche mon panier
```
**Réponse :**  
```
Votre panier contient :
1. Sapin de Noël - [Lien IKEA](https://www.ikea.com)
```

---

## **Structure du Projet**

### **Répertoire Principal : `src/`**
- **`agents/`** : Contient les agents principaux.
  - `cartManager.agent.ts` : Gestion des produits du panier.
  - `tavily.agent.ts` : Recherche de produits via API Tavily.
  - `supervisor.agent.ts` : Coordination entre agents.
- **`modules/`** : Modules NestJS organisés pour chaque fonctionnalité.
- **`state/`** : Gestion centralisée des états.
- **`workflow/`** : Définition du graphe LangGraph.

### **Dossier Public : `public/`**
- Contient l’interface utilisateur avec animations.

- **`cart.json`** : Stockage des produits ajoutés au panier.

---

## **Installation**

### **Prérequis :**
- **Node.js** (v18 ou supérieur)
- **npm** (v9 ou supérieur)
- Une clé API OpenAI.

### **Étapes :**
1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/sergueigorbounov/Graph-Multi-Agent-Final.git
   cd Graph-Multi-Agent-Final
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   - Créez un fichier `.env` :
     ```env
     OPENAI_API_KEY=your_openai_api_key
     TAVELY_API_KEY=your_tavely_api_key
     ```

4. **Lancer l'application** :
   ```bash
   npm run start
   ```

5. **Ou visitez directement :**  
   👉 **[Graph Multi-Agent sur Vercel](https://graph-iaf4xjib0-sergueis-projects-5c54ca99.vercel.app)** 👈

---

## **Améliorations Futures**

1. **Base de Données Robuste** :
   - Passage de JSON à PostgreSQL pour une gestion persistante.

2. **Interface Utilisateur Complète** :
   - Création d'un frontend graphique réactif.

3. **Optimisation des Performances** :
   - Réduction des temps de réponse dans les workflows.

---

🎄 **Joyeux Noël et Bonne Année !**  
**Sergueï Gorbounov**.  
[**Lien GitHub**](https://github.com/sergueigorbounov/Graph-Multi-Agent-Final) | [**Lien Déployé sur Vercel**](https://graph-iaf4xjib0-sergueis-projects-5c54ca99.vercel.app) 🎅
