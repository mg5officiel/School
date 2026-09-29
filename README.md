# School — Gestion scolaire

Application de gestion d'un lycée secondaire général au Mali.

## Architecture

- **Backend** : Spring Boot, Java 21, PostgreSQL, JPA, Flyway, Spring Security, JWT RS256.
- **Frontend** : React + Vite + TypeScript + Tailwind CSS.
- **IA** : Spring AI + Gemini 2.5 Flash pour l'extraction de feuilles manuscrites de notes.
- **Stockage temporaire IA** : MinIO. L'image est supprimée après extraction.
- **PDF** : génération des bulletins côté backend.

## Sécurité

- Access token JWT : 15 minutes.
- Refresh token : 7 jours, rotation et stockage uniquement sous forme de hash.
- BCrypt pour les mots de passe.
- RBAC avec les rôles : ADMIN, PROVISEUR, ENSEIGNANT, SURVEILLANT, COMPTABLE, SECRETAIRE, SCENCEUR.
- Validation des entrées et gestion globale des erreurs.
- CORS et en-têtes de sécurité.
- Limitation simple à 60 requêtes/minute/IP.
- Les décisions scolaires sensibles sont auditées.

## Règles scolaires

- Trois trimestres maximum : PREMIER, DEUXIEME, TROISIEME.
- Une évaluation est soit une NOTE_CLASSE, soit une NOTE_TRIMESTRIELLE.
- Le bulletin annuel est distinct des bulletins trimestriels.
- Moyenne annuelle >= 10/20 : passage par défaut.
- Moyenne annuelle < 10/20 : redoublement par défaut.
- Le passage exceptionnel sous 10/20 est réservé au PROVISEUR et est audité.
- La classe cible est toujours choisie manuellement.

## Lancer le backend

1. Copier `backend/.env.example` vers `backend/.env` ou fournir les variables d'environnement.
2. Préparer PostgreSQL et la base `school`.
3. Fournir une paire de clés RSA privée/publique pour JWT.
4. Fournir la clé Gemini et les paramètres MinIO si l'import IA est utilisé.
5. Depuis `backend/` :

```bash
mvn spring-boot:run
```

Le backend écoute sur `http://localhost:8080`.

## Lancer le frontend

Depuis `frontend/` :

```bash
npm install
npm run dev
```

Créer `frontend/.env` à partir de `.env.example` si l'API n'est pas sur `http://localhost:8080`.

## Tests

Backend :

```bash
cd backend
mvn test
```

Frontend :

```bash
cd frontend
npm install
npm run build
```

Les workflows GitHub Actions vérifient séparément le backend et le frontend.

## Import de notes manuscrites

L'import accepte JPG/JPEG/PNG jusqu'à 5 Mo. Gemini extrait les données sous forme structurée. L'interface affiche le résultat pour validation humaine ; aucune note n'est persistée automatiquement par l'extraction.
