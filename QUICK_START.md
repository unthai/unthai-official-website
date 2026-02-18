# Quick Start: Lead Capture Workflow

## 5-Minute Setup

### 1. Import Workflow to n8n
```bash
# In n8n: Workflows → Import from File
# Select: n8n-lead-workflow.json
```

### 2. Get Webhook URL
```
Open workflow → Click "Webhook - Contact Form" node
Copy URL: https://your-n8n.com/webhook/unthai-leads
```

### 3. Set Environment Variable
```bash
# Create .env file
echo "VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/unthai-leads" > .env
```

### 4. Setup Google Sheet

**Create spreadsheet with columns:**
```
lead_id | timestamp | name | email | interests | message | source | status
```

**In n8n workflow:**
1. Click "Save to Google Sheets" node
2. Authenticate with Google
3. Select your spreadsheet
4. Done!

### 5. Setup Email Notifications

**Gmail Setup:**
1. Enable 2FA on Gmail
2. Create App Password: https://myaccount.google.com/apppasswords
3. In n8n "Send Email Notification" node:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - User: `your-email@gmail.com`
   - Password: `your-app-password`
   - From: `your-email@gmail.com`
   - To: `team-email@gmail.com`

### 6. Activate Workflow
```
Toggle "Active" switch in n8n workflow (top right)
```

### 7. Test
```bash
# Start dev server
npm run dev

# Visit http://localhost:5173
# Fill out contact form
# Check Google Sheets & Email
```

## That's It!

Your lead capture workflow is now live. Every form submission will:
- ✅ Save to Google Sheets
- ✅ Send email notification
- ✅ Return confirmation to website

## Optional: Enable Slack/Airtable

**Slack:**
1. Get webhook: https://api.slack.com/messaging/webhooks
2. Enable "Send Slack Notification" node
3. Replace URL in node configuration

**Airtable:**
1. Create base with Leads table
2. Get Personal Access Token
3. Enable "Save to Airtable" node
4. Configure credentials

---

**Need help?** See LEAD_WORKFLOW_SETUP.md for detailed guide.
