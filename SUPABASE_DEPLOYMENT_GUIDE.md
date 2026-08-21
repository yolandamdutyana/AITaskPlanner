# Supabase Deployment Guide

## Overview

This guide walks you through deploying the LangChain-powered AI assistant to Supabase Edge Functions. Once deployed, your app will be fully functional with the new agent-based architecture.

---

## Prerequisites

Before you start, you need:

1. **Supabase Account** - [Sign up at supabase.com](https://supabase.com)
2. **Supabase Project** - Already created for your AITaskPlanner app
3. **OpenAI API Key** - From [OpenAI Dashboard](https://platform.openai.com/account/api-keys)
4. **GitHub Secrets** - For CI/CD automation (optional but recommended)

---

## Step 1: Get Your Supabase Credentials

### 1.1 Find Your Project ID

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your **AITaskPlanner** project
3. Go to **Settings** → **General**
4. Copy your **Project ID** (looks like: `abcdefghijklmnop`)
5. Also note your **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)

### 1.2 Create an Access Token

1. Go to **Settings** → **Access Tokens** (or [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens))
2. Click **Generate new token**
3. Name it: `GitHub Actions`
4. Expiration: Set for 90+ days (or longer)
5. Copy the token and save it securely

---

## Step 2: Configure GitHub Secrets (For Automated Deployment)

### 2.1 Add Secrets to GitHub

1. Go to your repository: `github.com/yolandamdutyana/AITaskPlanner`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

| Secret Name | Value |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | Your access token from Step 1.2 |
| `SUPABASE_PROJECT_ID` | Your project ID from Step 1.1 |

### 2.2 Verify Secrets Are Added

In the **Secrets** section, you should see:
- ✅ `SUPABASE_ACCESS_TOKEN`
- ✅ `SUPABASE_PROJECT_ID`

---

## Step 3: Configure Environment Variables in Supabase

### 3.1 Add OPENAI_API_KEY

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Edge Functions** (left sidebar)
4. Select the `ai-assistant` function
5. Click **Settings** (gear icon)
6. Under **Secrets**, click **Add new secret**
7. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `sk-...your-openai-key...`
8. Click **Save**

### 3.2 Verify the Secret

- You should see `OPENAI_API_KEY` listed under Secrets
- The value should be masked (showing only `sk-...`)

---

## Step 4: Deploy to Supabase

### Option A: Automatic Deployment (GitHub Actions)

This is the easiest method. The workflow will deploy automatically whenever you push to `main`.

**1. Merge your feature branch:**
```bash
git checkout main
git pull origin main
git merge feature/langchain-integration
git push origin main
```

**2. Watch the deployment:**
- Go to your repo: **Actions** tab
- Click the latest workflow run: **Deploy Supabase Edge Functions**
- Wait for the green ✅ checkmark

**3. Verify deployment:**
```bash
supabase functions list --project-id YOUR_PROJECT_ID
```

You should see `ai-assistant` listed as deployed.

---

### Option B: Manual Deployment (Local CLI)

If you prefer to deploy manually:

#### 4B.1 Install Supabase CLI

```bash
npm install -g supabase
# or
brew install supabase/tap/supabase
```

#### 4B.2 Login to Supabase

```bash
supabase login
```

You'll be prompted to:
1. Open a browser link
2. Generate an access token (same as Step 2)
3. Paste it into the terminal

#### 4B.3 Deploy the Function

```bash
supabase functions deploy ai-assistant --project-id YOUR_PROJECT_ID
```

Expected output:
```
✓ Deploying function 'ai-assistant'...
✓ Deployed ai-assistant (3.2 KB)
```

#### 4B.4 Test the Deployment

```bash
supabase functions invoke ai-assistant --project-id YOUR_PROJECT_ID \
  --body '{"feature":"chat","input":"Hello, how are you?"}'
```

---

## Step 5: Test Your Deployment

### 5.1 Test in Your App

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test a feature:**
   - Go to any page (Email, Meeting, Task, Research, or Chat)
   - Try generating content
   - Check if it works (no changes needed to frontend)

3. **Verify in Supabase:**
   - Go to **Edge Functions** in Supabase Dashboard
   - Select `ai-assistant`
   - Check the **Invocations** tab to see request logs

### 5.2 Check Logs

**In Supabase Dashboard:**
1. Go to **Edge Functions** → **ai-assistant**
2. Click **Invocations** tab
3. You should see your test requests with:
   - ✅ Status: `2xx` (success)
   - Request details
   - Response time

**Via CLI:**
```bash
supabase functions logs ai-assistant --project-id YOUR_PROJECT_ID
```

---

## Troubleshooting

### ❌ "401 Unauthorized" Error

**Cause:** Invalid API key or CORS issue

**Fix:**
1. Verify `OPENAI_API_KEY` is set correctly in Supabase Edge Function Secrets
2. Check the key is still valid at [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
3. Ensure you have OpenAI credit remaining

### ❌ "OPENAI_API_KEY is not configured"

**Cause:** Secret wasn't set in Supabase

**Fix:**
1. Go to Supabase Dashboard → Edge Functions → ai-assistant → Settings
2. Add the `OPENAI_API_KEY` secret (see Step 3)
3. Redeploy: `supabase functions deploy ai-assistant`

### ❌ Function Returns Empty Response

**Cause:** LangChain agent issue or LLM problem

**Fix:**
1. Check Supabase function logs for errors
2. Verify OpenAI API quota: [platform.openai.com/account/billing/usage](https://platform.openai.com/account/billing/overview)
3. Try a simpler input (e.g., "Hello" in the chatbot)

### ❌ GitHub Actions Deployment Fails

**Cause:** Missing or incorrect GitHub Secrets

**Fix:**
1. Verify both secrets are added: `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_ID`
2. Check the workflow run logs for detailed error messages
3. Manually deploy using Option B above

---

## Monitoring & Maintenance

### Check Function Health

```bash
# List all functions
supabase functions list --project-id YOUR_PROJECT_ID

# View recent invocations
supabase functions logs ai-assistant --project-id YOUR_PROJECT_ID --limit 50

# View specific log entries
supabase functions logs ai-assistant --project-id YOUR_PROJECT_ID --limit 10 --follow
```

### Monitor OpenAI Costs

1. Go to [OpenAI Dashboard](https://platform.openai.com/account/billing/usage)
2. Check monthly usage under "Usage"
3. Free tier users get $5 credit; paid users see actual costs
4. gpt-4o-mini is one of the cheapest models (~$0.15 per 1M tokens)

### Update Function Code

When you push changes to `supabase/functions/ai-assistant/`:
1. Push to GitHub
2. GitHub Actions automatically deploys
3. No manual steps needed!

---

## Next Steps After Deployment

✅ **Your AI assistant is now fully functional!**

### Recommended Follow-ups:

1. **Add Memory/Context** - Store conversation history in Supabase database
2. **Implement User Authentication** - Track usage per user
3. **Add Rate Limiting** - Prevent abuse
4. **Monitor Usage** - Set up alerts for high costs
5. **Add More Tools** - Integrate Wikipedia, web search, etc.

See `LANGCHAIN_INTEGRATION.md` for how to extend with more tools.

---

## Quick Reference

### Important URLs
- **Supabase Dashboard:** https://app.supabase.com
- **OpenAI API Dashboard:** https://platform.openai.com/account
- **GitHub Repository:** https://github.com/yolandamdutyana/AITaskPlanner

### Critical Commands
```bash
# Deploy
supabase functions deploy ai-assistant --project-id YOUR_PROJECT_ID

# View logs
supabase functions logs ai-assistant --project-id YOUR_PROJECT_ID

# Test locally
supabase functions serve

# List functions
supabase functions list --project-id YOUR_PROJECT_ID
```

### Environment Variables Needed
- `OPENAI_API_KEY` - In Supabase Edge Function Secrets
- `SUPABASE_PROJECT_ID` - In GitHub Secrets (for CI/CD)
- `SUPABASE_ACCESS_TOKEN` - In GitHub Secrets (for CI/CD)

---

## Support

If you encounter issues:

1. **Check Supabase function logs** - Most issues show up there
2. **Verify OpenAI API quota** - Free tier has limits
3. **Test with CLI** - `supabase functions invoke` can help debug
4. **Check GitHub Actions** - Review workflow run logs for deployment errors

---

**🎉 You're all set! Your AI assistant is now powered by LangChain and running on Supabase Edge Functions.**
