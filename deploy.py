import os
import subprocess
import requests
import json

# -----------------------------
# CONFIGURATION
# -----------------------------

RENDER_API_KEY = os.getenv("RENDER_API_KEY")
CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
EXPO_TOKEN = os.getenv("EXPO_TOKEN")

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(REPO_ROOT, "artifacts", "web")
API_DIR = os.path.join(REPO_ROOT, "artifacts", "api-server")
MOBILE_DIR = os.path.join(REPO_ROOT, "artifacts", "mobile")

# -----------------------------
# DEPLOY EXPRESS API TO RENDER
# -----------------------------

def deploy_render_api():
    print("Deploying API to Render...")

    url = "https://api.render.com/v1/services"

    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "name": "knights-api",
        "type": "web",
        "repo": "https://github.com/goredoh/knights-of-nostalgia",
        "branch": "main",
        "rootDir": "artifacts/api-server",
        "envVars": {
            "NODE_ENV": "production"
        },
        "buildCommand": "pnpm install && pnpm build",
        "startCommand": "node dist/index.js"
    }

    r = requests.post(url, headers=headers, json=payload)
    print("Render response:", r.text)

# -----------------------------
# DEPLOY WEB TO CLOUDFLARE PAGES
# -----------------------------

def deploy_cloudflare_pages():
    print("Deploying Web to Cloudflare Pages...")

    # Build web app
    subprocess.run(["pnpm", "install"], cwd=WEB_DIR)
    subprocess.run(["pnpm", "build"], cwd=WEB_DIR)

    # Upload build artifact
    url = f"https://api.cloudflare.com/client/v4/accounts/{CLOUDFLARE_ACCOUNT_ID}/pages/projects/knights-web/deployments"

    headers = {
        "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
    }

    files = {
        "manifest": ("manifest.json", json.dumps({"version": 1}), "application/json"),
        "files": ("files.zip", open(os.path.join(WEB_DIR, "dist.zip"), "rb"), "application/zip")
    }

    r = requests.post(url, headers=headers, files=files)
    print("Cloudflare response:", r.text)

# -----------------------------
# DEPLOY MOBILE APP VIA EXPO EAS
# -----------------------------

def deploy_expo_mobile():
    print("Publishing Expo app...")

    subprocess.run([
        "eas", "update", "--branch", "production", "--message", "Automated deploy"
    ], cwd=MOBILE_DIR)

# -----------------------------
# MAIN
# -----------------------------

if __name__ == "__main__":
    deploy_render_api()
    deploy_cloudflare_pages()
    deploy_expo_mobile()

    print("All deployments complete.")
