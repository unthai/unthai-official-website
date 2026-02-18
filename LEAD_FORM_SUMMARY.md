# 🚀 Lead Form Integration - Deployment Summary

## ✅ What Was Completed

### 1. n8n Workflow Created ✓
- **Workflow Name**: Unthai_LeadForm_v1
- **Workflow ID**: RnCfe6NWP5xgyIKF
- **Webhook URL**: https://n8n.unth.ai/webhook/unthai-leads
- **Status**: Active (Published) ✅

### 2. Workflow Structure

```
Webhook - Lead Form
  ↓
Extract & Process Lead Data (Code node)
  ↓
Google Sheets - Leads
  ↓
Success Response
```

### 3. Data Processing

The workflow extracts and processes:
- **name** - Full name of the lead
- **email** - Email address (validated and normalized)
- **interests** - Array of selected interests (converted to comma-separated string)
- **message** - Message content
- **timestamp** - Submission timestamp
- **source** - Traffic source (unthai_v1_website)

And generates:
- **lead_id** - Unique identifier (format: `YYYYMMDD-HHMMSS-name`)
- **domain** - Email domain
- **date_submitted** - Date in YYYY-MM-DD format
- **time_submitted** - Time in HH:MM:SS format
- **status** - Lead status (default: "New")

### 4. Google Sheet Configuration

**Sheet ID**: `1_zxFcmJbigrpQJiy2XKr4f45EGmSobjr7AoB1n3wlXs`
**Sheet URL**: https://docs.google.com/spreadsheets/d/1_zxFcmJbigrpQJiy2XKr4f45EGmSobjr7AoB1n3wlXs/edit

**Required Column Headers (Row 1):**
```
lead_id | name | email | domain | interests | message | timestamp | source | date_submitted | time_submitted | status
```

### 5. Test Result ✓

**Test Data Sent:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "interests": ["AI Content Engine", "Workflow Automation"],
  "message": "I am interested in learning more about your AI solutions.",
  "timestamp": "2026-01-30T06:30:00Z",
  "source": "unthai_v1_website"
}
```

**Response Received:**
```json
{
  "success": true,
  "message": "Thank you! We'll be in touch soon.",
  "leadId": "20260130-062751-john-doe"
}
```

---

## 📋 Integration Details

### Frontend Configuration

**File**: [src/components/LeadForm.jsx](src/components/LeadForm.jsx)

**Webhook URL** (already configured in [.env](./.env)):
```env
VITE_N8N_WEBHOOK_URL=https://n8n.unth.ai/webhook/unthai-leads
```

**Data Sent to Webhook:**
```javascript
{
  name: formData.name,
  email: formData.email,
  interests: formData.interests, // Array of selected interests
  message: formData.message,
  timestamp: new Date().toISOString(),
  source: 'unthai_v1_website'
}
```

### Interest Options Available

The form allows users to select from:
- AI Content Engine
- Autonomous Agents
- Workflow Automation
- Creative Automation
- AI Growth Strategy
- AI Voice Intelligence
- Other
- I'm not sure
- Buy you a coffee

---

## 🎯 What Each Piece Does

### 1. Frontend (LeadForm.jsx)
- Collects user input (name, email, interests, message)
- Validates email format
- Sends POST request to webhook
- Shows success/error feedback

### 2. n8n Workflow
**Flow**:
1. Webhook receives POST request
2. Code node extracts and processes data:
   - Validates email format
   - Validates required fields (name, email)
   - Creates unique lead ID
   - Converts interests array to comma-separated string
   - Extracts domain from email
   - Formats date and time
3. Google Sheets node saves data (auto-maps fields)
4. Success response returns to frontend

### 3. Google Sheet
**Stores**:
- Lead ID (unique identifier)
- Name, Email, Domain
- Interests (comma-separated)
- Message content
- Timestamp, Source
- Date & Time submitted
- Status (New/Contacted/Qualified/etc.)

---

## 🔍 Key Features

### Data Processing:
- ✅ Email validation (regex-based)
- ✅ Required field validation (name, email)
- ✅ Unique lead ID generation
- ✅ Domain extraction from email
- ✅ Interests array → comma-separated string conversion
- ✅ Date/time formatting
- ✅ Handles both `$json.email` and `$json.body.email` formats

### Response:
- ✅ Success message with lead ID
- ✅ CORS headers configured
- ✅ Error handling for validation failures

---

## 📊 Data Example

**Input:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@company.com",
  "interests": ["AI Content Engine", "Workflow Automation"],
  "message": "Looking for AI automation solutions",
  "timestamp": "2026-01-30T10:00:00Z",
  "source": "unthai_v1_website"
}
```

**Stored in Google Sheet:**
| lead_id | name | email | domain | interests | message | timestamp | source | date_submitted | time_submitted | status |
|---------|------|-------|--------|-----------|---------|-----------|--------|----------------|----------------|--------|
| 20260130-100000-jane-smith | Jane Smith | jane.smith@company.com | company.com | AI Content Engine, Workflow Automation | Looking for AI automation solutions | 2026-01-30T10:00:00Z | unthai_v1_website | 2026-01-30 | 10:00:00 | New |

---

## 🧪 Testing

### Test Locally:

```bash
# Start dev server
npm run dev

# Open browser
# Navigate to: http://localhost:5173
# Scroll to "Start Your Project" form
# Fill out form and submit
```

### Test in Production:

1. Go to: https://unth.ai/
2. Scroll to "Start Your Project" section
3. Fill out the form:
   - Enter name
   - Enter email
   - Select interests
   - Enter message
4. Click "Send Message"
5. Verify:
   - ✅ Success message appears
   - ✅ Data appears in Google Sheet
   - ✅ No errors in browser console (F12)

### Test Webhook Directly:

```bash
curl -X POST https://n8n.unth.ai/webhook/unthai-leads \
  -H "Content-Type: application/json" \
  -H "Origin: https://unth.ai" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "interests": ["AI Content Engine"],
    "message": "This is a test message",
    "timestamp": "2026-01-30T12:00:00Z",
    "source": "test"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Thank you! We'll be in touch soon.",
  "leadId": "20260130-120000-test-user"
}
```

---

## 🚨 Common Issues & Solutions

### Issue: Workflow not responding
**Fix**: Make sure workflow is ACTIVATED in n8n (toggle ON)

### Issue: Data not appearing in sheet
**Fix**:
1. Check Google Sheets OAuth2 credentials are connected
2. Verify column headers match exactly
3. Check n8n execution history for errors

### Issue: CORS Error
**Fix**: Workflow already has CORS configured for:
```
https://unth.ai,http://localhost:5173,http://localhost:4173
```

### Issue: Interests showing as "[object Object]"
**Fix**: Already handled! Code converts array to comma-separated string

---

## 📈 What to Monitor

### Success Metrics:
- Leads per day/week/month
- Conversion rate (form views → submissions)
- Most popular interests selected
- Response time to leads

### Health Checks:
- n8n workflow execution history (check for errors)
- Google Sheet update frequency
- Browser console errors on website

---

## 🎉 Ready to Deploy!

**Current Status:**
- ✅ n8n workflow created and activated
- ✅ Google Sheet configured
- ✅ Frontend code already configured (LeadForm.jsx)
- ✅ Environment variables set (.env)
- ✅ Tested and working

**Your production website** at https://unth.ai/ already has the LeadForm component with the correct webhook URL configured!

The workflow is **LIVE and OPERATIONAL** right now! 🚀

---

## 🔗 Quick Links

- **n8n Workflow**: https://n8n.unth.ai/workflow/RnCfe6NWP5xgyIKF
- **Google Sheet**: https://docs.google.com/spreadsheets/d/1_zxFcmJbigrpQJiy2XKr4f45EGmSobjr7AoB1n3wlXs/edit
- **Production Site**: https://unth.ai/
- **Webhook URL**: https://n8n.unth.ai/webhook/unthai-leads

---

## 📁 Files Reference

- [LeadForm.jsx](src/components/LeadForm.jsx) - Frontend lead form component
- [.env](./.env) - Environment variables (webhook URLs)
- [n8n-lead-workflow.json](n8n-lead-workflow.json) - Original workflow (if you need to re-import)

---

**Everything is configured and working!** 🎯

Your lead form is now capturing leads and storing them in Google Sheets automatically.
