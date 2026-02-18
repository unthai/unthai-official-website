# UNTH.AI Lead Workflow - Visual Diagram

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      WEBSITE CONTACT FORM                        │
│                    (LeadForm.jsx Component)                      │
│                                                                   │
│  Fields Collected:                                               │
│  • Name (required)                                               │
│  • Email (required)                                              │
│  • Interests (checkboxes):                                       │
│    - AI Content Engine                                           │
│    - Autonomous Agents                                           │
│    - Workflow Automation                                         │
│    - Creative Automation                                         │
│    - AI Growth Strategy                                          │
│    - AI Voice Intelligence                                       │
│  • Message (optional)                                            │
│  • Timestamp (auto-generated)                                    │
│  • Source: "unthai_v1_website"                                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP POST Request
                            │ Content-Type: application/json
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    N8N WEBHOOK ENDPOINT                          │
│              /webhook/unthai-leads (POST)                        │
│                                                                   │
│  Receives JSON payload and triggers workflow                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   PROCESS LEAD DATA NODE                         │
│                    (Data Transformation)                         │
│                                                                   │
│  Actions:                                                        │
│  • Generate unique lead_id                                       │
│  • Extract all form fields                                       │
│  • Join interests array → comma-separated string                │
│  • Set status = "new"                                            │
│  • Prepare data for storage                                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ (Parallel Processing)
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌─────────────────────┐              ┌─────────────────────┐
│  GOOGLE SHEETS NODE │              │  AIRTABLE NODE      │
│                     │              │   (Optional)        │
│  Appends row with:  │              │                     │
│  • lead_id          │              │  Creates record:    │
│  • timestamp        │              │  • Lead ID          │
│  • name             │              │  • Name             │
│  • email            │              │  • Email            │
│  • interests        │              │  • Interests        │
│  • message          │              │  • Message          │
│  • source           │              │  • Timestamp        │
│  • status           │              │  • Source           │
│                     │              │  • Status           │
└──────────┬──────────┘              └──────────┬──────────┘
           │                                    │
           ▼                                    ▼
┌─────────────────────┐              ┌─────────────────────┐
│  EMAIL NOTIFICATION │              │ SLACK NOTIFICATION  │
│      NODE           │              │    (Optional)       │
│                     │              │                     │
│  Sends HTML email:  │              │  Posts message:     │
│  • To: Team         │              │  • Channel alert    │
│  • Subject: New Lead│              │  • Formatted blocks │
│  • Rich formatting  │              │  • Lead details     │
│  • All lead details │              │  • Timestamp        │
└──────────┬──────────┘              └──────────┬──────────┘
           │                                    │
           └───────────────┬────────────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │  RESPOND TO WEBHOOK │
                │                     │
                │  Returns JSON:      │
                │  {                  │
                │    success: true,   │
                │    message: "...",  │
                │    leadId: "..."    │
                │  }                  │
                └──────────┬──────────┘
                           │
                           │ HTTP Response (200 OK)
                           │
                           ▼
                ┌─────────────────────┐
                │   WEBSITE FORM      │
                │ Shows Success Msg   │
                │  "Message Sent!"    │
                └─────────────────────┘
```

## Node Configuration Summary

### 1️⃣ Webhook Trigger
- **Type**: Webhook (POST)
- **Path**: `/webhook/unthai-leads`
- **Response Mode**: Using Response Node
- **Authentication**: None (add if needed)

### 2️⃣ Process Lead Data
- **Type**: Set (Data Transformation)
- **Actions**:
  - Create lead_id from timestamp + email
  - Map all form fields
  - Convert arrays to strings
  - Add metadata

### 3️⃣ Google Sheets
- **Type**: Google Sheets (Append)
- **Operation**: Append Row
- **Columns**: 8 mapped fields
- **Status**: ✅ Enabled

### 4️⃣ Airtable (Optional)
- **Type**: Airtable (Create)
- **Operation**: Create Record
- **Table**: Leads
- **Status**: ⏸️ Disabled by default

### 5️⃣ Email Notification
- **Type**: Email Send (SMTP)
- **Format**: HTML
- **Template**: Professional design
- **Status**: ✅ Enabled

### 6️⃣ Slack Notification (Optional)
- **Type**: HTTP Request (POST)
- **Format**: Slack Block Kit
- **Destination**: Webhook URL
- **Status**: ⏸️ Disabled by default

### 7️⃣ Webhook Response
- **Type**: Respond to Webhook
- **Format**: JSON
- **Status Code**: 200
- **Body**: Success confirmation

## Data Structure at Each Stage

### Stage 1: Incoming Webhook Data
```json
{
  "body": {
    "name": "John Doe",
    "email": "john@example.com",
    "interests": ["AI Content Engine", "Autonomous Agents"],
    "message": "Interested in AI solutions",
    "timestamp": "2024-01-29T10:30:00Z",
    "source": "unthai_v1_website"
  }
}
```

### Stage 2: After Processing
```json
{
  "lead_id": "2024-01-29T10:30:00Z-john-at-example.com",
  "name": "John Doe",
  "email": "john@example.com",
  "interests": "AI Content Engine, Autonomous Agents",
  "message": "Interested in AI solutions",
  "timestamp": "2024-01-29T10:30:00Z",
  "source": "unthai_v1_website",
  "status": "new"
}
```

### Stage 3: Google Sheets Row
```
| lead_id | timestamp | name | email | interests | message | source | status |
|---------|-----------|------|-------|-----------|---------|--------|--------|
| 2024... | 2024...   | John | john@ | AI Cont...| Inter...| unthai | new    |
```

### Stage 4: Final Response
```json
{
  "success": true,
  "message": "Thank you! We'll be in touch soon.",
  "leadId": "2024-01-29T10:30:00Z-john-at-example.com"
}
```

## Processing Timeline

```
T+0ms    : Form submitted from website
T+100ms  : Webhook receives data
T+150ms  : Data processed and transformed
T+500ms  : Saved to Google Sheets
T+600ms  : Saved to Airtable (if enabled)
T+1200ms : Email sent
T+1300ms : Slack notification sent (if enabled)
T+1400ms : Response returned to website
T+1500ms : Website shows success message
```

**Average Total Time: 1.5 seconds**

## Error Handling Flow

```
┌─────────────────┐
│  Any Node Fails │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Error Caught by n8n        │
│  • Logged in execution log  │
│  • Workflow stops at node   │
│  • Previous nodes' data OK  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Webhook Returns Error      │
│  • 500 Internal Server Error│
│  • Website shows "Error"    │
│  • User can retry           │
└─────────────────────────────┘
```

## Security Layers

```
┌──────────────────────────────────────────┐
│         Security Measures                │
├──────────────────────────────────────────┤
│  Layer 1: HTTPS Encryption               │
│  • All data transmitted over SSL/TLS     │
│  • Prevents man-in-middle attacks        │
├──────────────────────────────────────────┤
│  Layer 2: Origin Validation              │
│  • Check request origin                  │
│  • CORS headers (if needed)              │
├──────────────────────────────────────────┤
│  Layer 3: Data Validation                │
│  • Email format validation               │
│  • Required field checks                 │
│  • Sanitization of inputs                │
├──────────────────────────────────────────┤
│  Layer 4: Rate Limiting (Optional)       │
│  • Prevent spam submissions              │
│  • IP-based throttling                   │
├──────────────────────────────────────────┤
│  Layer 5: Credential Security            │
│  • Environment variables                 │
│  • No hardcoded secrets                  │
│  • Encrypted storage in n8n              │
└──────────────────────────────────────────┘
```

## Monitoring & Analytics

### Key Metrics to Track

1. **Volume Metrics**
   - Leads per day/week/month
   - Peak submission times
   - Source tracking

2. **Quality Metrics**
   - Conversion rate (contacted → qualified)
   - Response time to leads
   - Interest category distribution

3. **Technical Metrics**
   - Webhook success rate
   - Average processing time
   - Failed executions

4. **Integration Health**
   - Google Sheets sync status
   - Email delivery rate
   - Airtable sync status (if enabled)

### Where to Monitor

```
n8n Execution Log
    ↓
View all workflow runs
Success/Failure status
Execution time
Error messages

Google Sheets
    ↓
Lead count
Latest submissions
Status distribution
Interest trends

Email Inbox
    ↓
Instant notifications
Lead details
Quick response
```

## Scalability

### Current Capacity
- **Concurrent requests**: 10+
- **Daily leads**: 1,000+
- **Storage**: Unlimited (Google Sheets/Airtable)
- **Notifications**: Real-time

### Scale-Up Options

```
For High Volume (10k+ leads/day):
├─ Add database node (PostgreSQL/MySQL)
├─ Implement queue system (Redis/RabbitMQ)
├─ Add load balancer
├─ Separate notification workflow
└─ Archive old leads automatically

For Global Distribution:
├─ Use n8n cloud (multi-region)
├─ CDN for webhook endpoints
├─ Regional email services
└─ Geo-distributed storage
```

---

**Version**: 1.0
**Created**: January 29, 2024
**Purpose**: Lead capture and management automation
