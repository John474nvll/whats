#!/usr/bin/env bash
# finish_v4_release.sh
# Crea la rama v4, actualiza versiones mínimas, asegura workflows y empuja tag v4.0.0
# Ejecuta desde la raíz del repo clonada localmente.
#
# PRECONDICIONES:
# - Tener git configurado con permisos para push al repo.
# - Haber añadido todos los archivos y cambios que quieras incluir en la v4 en tu working tree,
#   o que la rama v3-pwa-retell ya contenga lo necesario.
#
# USO:
#   export GITHUB_PAT="ghp_xxx"   # opcional, solo necesario para gh release automatic
#   chmod +x scripts/finish_v4_release.sh
#   ./scripts/finish_v4_release.sh
#
set -euo pipefail

REPO_REMOTE=${REPO_REMOTE:-origin}
BASE_BRANCH=${BASE_BRANCH:-v3-pwa-retell}
V4_BRANCH="v4"
TAG="v4.0.0"
COMMIT_MSG="release: prepare v4 (PWA, integrations, CI, E2E)"

echo "==> Revisando repo remoto: ${REPO_REMOTE}"
git fetch ${REPO_REMOTE} || true

# Determine base branch source
if git rev-parse --verify "refs/remotes/${REPO_REMOTE}/${BASE_BRANCH}" >/dev/null 2>&1; then
  echo "==> Base branch ${BASE_BRANCH} found on remote. Creating branch ${V4_BRANCH} from ${REPO_REMOTE}/${BASE_BRANCH}"
  git checkout -B ${V4_BRANCH} ${REPO_REMOTE}/${BASE_BRANCH}
else
  if git show-ref --verify --quiet refs/heads/${BASE_BRANCH}; then
    echo "==> Base branch ${BASE_BRANCH} found locally. Creating branch ${V4_BRANCH} from local ${BASE_BRANCH}"
    git checkout -B ${V4_BRANCH} ${BASE_BRANCH}
  else
    echo "==> Base branch ${BASE_BRANCH} not found. Using current HEAD to create ${V4_BRANCH}"
    git checkout -B ${V4_BRANCH}
  fi
fi

# Helpful function: bump package.json version if exists
bump_pkg_version() {
  local path="$1"
  if [ -f "$path" ]; then
    echo " - Updating version in $path -> $TAG"
    # Use jq if available, otherwise sed fallback
    if command -v jq >/dev/null 2>&1; then
      tmp=$(mktemp)
      jq --arg v "$TAG" '.version = $v' "$path" > "$tmp"
      mv "$tmp" "$path"
    else
      # naive sed replace of "version": "old"
      perl -0777 -pe "s/\"version\"\\s*:\\s*\"[^\"]+\"/\"version\": \"$TAG\"/s" "$path" > "${path}.tmp" && mv "${path}.tmp" "$path"
    fi
    return 0
  fi
  return 1
}

echo "==> Bumping versions where applicable..."
bump_pkg_version "package.json" || true
bump_pkg_version "crm/package.json" || true
bump_pkg_version "whats/package.json" || true

# Ensure workflows include v4 in triggers (update build-and-release.yml if present)
WORKFLOW_DIR=".github/workflows"
BUILD_WORKFLOW="${WORKFLOW_DIR}/build-and-release.yml"
if [ -f "$BUILD_WORKFLOW" ]; then
  echo "==> Ensuring $BUILD_WORKFLOW triggers on v4 branch"
  # If 'on.push.branches' exists, ensure v4 is included; naive approach: add v4 if not present
  if grep -q "branches:" -n "$BUILD_WORKFLOW"; then
    if ! grep -q "v4" "$BUILD_WORKFLOW"; then
      echo " - Adding v4 to $BUILD_WORKFLOW triggers (naive append)"
      # Insert v4 under the first branches: list (best-effort)
      awk '
        BEGIN { added=0 }
        /branches:/ && added==0 {
          print; getline;
          # print existing line(s) and then add - v4
          print;
          print "      - v4";
          added=1;
          next
        }
        { print }
      ' "$BUILD_WORKFLOW" > "${BUILD_WORKFLOW}.tmp" && mv "${BUILD_WORKFLOW}.tmp" "$BUILD_WORKFLOW" || true
    fi
  fi
fi

# Create or update finish-integration-v4 workflow that can be used to re-run tasks if needed
FINISH_WORKFLOW="${WORKFLOW_DIR}/finish-integration-v4.yml"
mkdir -p "${WORKFLOW_DIR}"
cat > "${FINISH_WORKFLOW}" <<'YAML'
name: Finish Integration v4 (subtree + scaffolding)
on:
  workflow_dispatch:
permissions:
  contents: write
jobs:
  finish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Setup git
        run: |
          git config user.name "automation-bot"
          git config user.email "automation@local"
      - name: Ensure branch v4 exists
        run: |
          BRANCH="v4"
          if git rev-parse --verify origin/${BRANCH} >/dev/null 2>&1; then
            git checkout -B ${BRANCH} origin/${BRANCH}
          else
            git checkout -B ${BRANCH}
            git push origin ${BRANCH}
          fi
      - name: Done
        run: echo "v4 integration workflow ready"
YAML

echo "==> Created workflow ${FINISH_WORKFLOW}"

# Add LICENSE/CHANGELOG if not present
if [ ! -f CHANGELOG.md ]; then
  echo "==> Creating CHANGELOG.md (starter)"
  cat > CHANGELOG.md <<'MD'
# Changelog

## v4.0.0 - $(date +"%Y-%m-%d")
- Consolidated PWA integration
- WhatsApp and Twilio modules finalized
- Retell agent worker + queue
- Cypress E2E and Jenkins pipeline
- CI workflows updated
MD
fi

# Final commit
echo "==> Staging changes..."
git add -A

if git diff --staged --quiet; then
  echo "==> No staged changes to commit. Skipping commit."
else
  echo "==> Committing changes..."
  git commit -m "${COMMIT_MSG}"
fi

echo "==> Pushing branch ${V4_BRANCH} to remote ${REPO_REMOTE}..."
git push ${REPO_REMOTE} ${V4_BRANCH} --set-upstream

# Tagging
if git rev-parse --verify "refs/tags/${TAG}" >/dev/null 2>&1; then
  echo "==> Tag ${TAG} already exists locally. Deleting and recreating."
  git tag -d ${TAG} || true
fi
git tag -a ${TAG} -m "Release ${TAG}"
git push ${REPO_REMOTE} --tags

echo "==> Branch ${V4_BRANCH} pushed and tag ${TAG} created."

# Optionally create GH Release if gh CLI present and GITHUB_PAT set
if command -v gh >/dev/null 2>&1 && [ -n "${GITHUB_PAT:-}" ]; then
  echo "==> Creating GitHub release ${TAG} via gh CLI..."
  gh release create ${TAG} --title "v4.0.0" --notes "Automated v4 release prepared by script." || true
  echo "==> GitHub release create attempted."
else
  echo "==> gh CLI not available or GITHUB_PAT not set; skip creating GitHub Release."
fi

echo "==> v4 preparation finished. Verify on GitHub: branch ${V4_BRANCH}, tag ${TAG}."
echo "==> Next steps (recommended):"
echo "   - In GitHub, review the branch v4 and run CI (Actions) or trigger finish-integration-v4 workflow if needed."
echo "   - Configure any required Secrets (OPENAI_API_KEY, TWILIO_*, WHATSAPP_*, DATABASE_URL, NEXTAUTH_SECRET, REDIS_URL, FIREBASE_SERVICE_ACCOUNT, ADMIN_API_KEY)."
echo "   - Run migrations and start worker (Redis) in your staging/prod environment."