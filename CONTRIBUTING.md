# Contributing to Hunar

Thank you for considering contributing to Hunar! This guide will help you get started.

## 🔧 Development Setup

### Prerequisites
- Flutter SDK ≥ 3.7.0
- Node.js ≥ 18.0
- Python ≥ 3.10
- PostgreSQL ≥ 15
- Docker (recommended)

### First-Time Setup

```bash
git clone https://github.com/your-org/hunar.git
cd hunar

# Install all dependencies
cd apps/api && npm install
cd ../web && npm install
cd ../mobile && flutter pub get
cd ../../services/ai && pip install -r requirements.txt
```

## 📐 Code Conventions

### Flutter / Dart
- **Architecture**: Feature-first folder structure
- **State Management**: Riverpod 2 (Notifier/AsyncNotifier — NOT StateNotifier)
- **Routing**: GoRouter with role-based auth guards
- **Colors**: Always from `AppColors` — no inline hex values
- **Text styles**: Always from `Theme.of(context).textTheme`
- **API calls**: Always through `ApiClient` — never raw HTTP
- **Icons**: LucideIcons from `lucide_icons_flutter`

### TypeScript / API
- **Framework**: Fastify with TypeScript
- **Validation**: Joi schemas on all endpoints
- **Auth**: JWT middleware with role guards
- **Error handling**: Centralized error handler

### Python / AI
- **Framework**: FastAPI with Pydantic models
- **Typing**: Full type annotations required
- **Tests**: Pytest with async support

## 🔀 Branch Naming

```
feature/    → New features (feature/voice-skill-extraction)
fix/        → Bug fixes (fix/auth-token-refresh)
refactor/   → Code improvements (refactor/provider-migration)
docs/       → Documentation (docs/api-reference)
test/       → Test additions (test/booking-flow)
```

## 📝 Pull Request Workflow

1. **Fork & Branch** — Create a feature branch from `main`
2. **Implement** — Write code following conventions above
3. **Test** — Run `flutter analyze` (0 issues) and `flutter test`
4. **PR** — Submit with descriptive title and linked issue
5. **Review** — Address feedback, squash commits
6. **Merge** — Maintainer merges via squash merge

### PR Checklist

- [ ] `flutter analyze` reports 0 issues
- [ ] All existing tests pass
- [ ] New features have tests
- [ ] Documentation updated if needed
- [ ] Screenshots/recordings for UI changes
- [ ] No hardcoded strings (use localization)
- [ ] No inline colors or text styles

## 🐛 Reporting Issues

Use GitHub Issues with these labels:
- `bug` — Something is broken
- `feature` — New feature request
- `docs` — Documentation improvement
- `performance` — Speed/memory issues
- `security` — Security vulnerabilities (use private reporting)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
