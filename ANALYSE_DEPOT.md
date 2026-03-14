# Analyse du dépôt

## Vue d'ensemble
- Application full-stack TypeScript orientée "AI automation builder" pour générer des templates n8n via Gemini, les persister dans Firestore et les déployer dans n8n.
- Front-end React/Vite avec UI moderne (Tailwind + motion + lucide-react).
- Back-end Express unifié (`server.ts`) qui sert à la fois les API JSON et l'application Vite en mode développement.

## Stack technique identifiée
- **Front-end**: React 19, Vite 6, TypeScript, Tailwind CSS 4, Motion.
- **Back-end**: Express, CORS, Axios.
- **IA**: SDK `@google/genai` via la classe `AIAssistant`.
- **Persistance**: Firebase Firestore (SDK client initialisé dans `src/firebase.ts`, utilisé côté serveur dans `server.ts`).
- **Intégration cible**: API n8n via clé `X-N8N-API-KEY`.

## Architecture fonctionnelle
1. L'utilisateur saisit un prompt dans `AutomationBuilder`.
2. Le front appelle `AIAssistant.generateTemplate(prompt)` pour obtenir un template JSON.
3. Le template est envoyé à `POST /api/templates` puis stocké dans Firestore.
4. Le déploiement déclenche:
   - `POST /api/workflow/generate` (conversion template -> workflow n8n),
   - puis `POST /api/workflow/deploy` (création du workflow sur n8n).

## Points forts
- Séparation de responsabilités correcte côté domaine:
  - `WorkflowGenerator` pour la transformation,
  - `N8NConnector` pour les appels HTTP n8n,
  - `AIAssistant` pour la génération IA.
- Typage TypeScript déjà présent pour les structures métier (`AutomationTemplate`, `N8NWorkflow`, etc.).
- API backend claire et courte, facile à étendre.
- Lint TypeScript (`tsc --noEmit`) déjà configuré.

## Risques et limites observés
1. **Exposition potentielle de secrets côté client**
   - `AIAssistant` est instancié dans un composant React et lit `process.env.GEMINI_API_KEY`.
   - En pratique, côté navigateur, il faudrait passer par des variables `VITE_*` (potentiellement exposées) ou déporter la génération IA côté serveur pour garder la clé secrète.

2. **Instanciation répétée de l'assistant IA**
   - `const aiAssistant = new AIAssistant();` dans le corps du composant crée une nouvelle instance à chaque rendu.

3. **Gestion d'erreur minimale sur le front**
   - Les erreurs sont principalement `console.error`, sans retour utilisateur structuré (toast, bannière, états d'erreur détaillés).

4. **Validation d'entrée API limitée**
   - Les routes Express acceptent les payloads sans schéma de validation (Zod/Yup/JSON Schema), ce qui peut casser le runtime en cas d'input inattendu.

5. **Couplage front/back dans le même serveur**
   - Pratique pour démarrer, mais peut compliquer le scaling et la séparation des responsabilités en production.

## Recommandations prioritaires
1. **Déporter la génération Gemini côté serveur** (priorité haute)
   - Créer une route `POST /api/ai/generate-template` et garder `GEMINI_API_KEY` uniquement serveur.

2. **Ajouter validation + erreurs normalisées** (haute)
   - Schémas de validation pour `template`, `workflow` et réponses d'erreur homogènes.

3. **Améliorer l'UX d'erreur et de chargement** (moyenne)
   - États d'erreur visibles, retries, et messages plus actionnables.

4. **Stabiliser l'instanciation des services côté front** (moyenne)
   - Utiliser `useMemo`, un singleton, ou déplacer totalement l'appel IA vers le backend.

5. **Ajouter tests ciblés** (moyenne)
   - Unit tests sur `WorkflowGenerator` (substitution de variables, structure de sortie).
   - Tests d'intégration API pour `/api/workflow/generate`.

## Commandes de vérification exécutées
- `npm run lint` ✅ (TypeScript compile sans erreur)

