# Suggested App Sections (Final Version)

यह document CRM application के सभी suggested sections को organize करता है। प्रत्येक section में detailed implementation notes और technical requirements included हैं।

---

## 📋 Section Categories

1. **Core Sections** - Must-have features for MVP
2. **Secondary Sections** - Nice-to-have enhancements
3. **Integration Sections** - Third-party service integrations
4. **UI/UX Enhancements** - Visual and interaction improvements

---

## 🎯 CORE SECTIONS (Priority: High)

### 1. Dashboard (✅ Implemented)
**Description**: Central hub with KPIs and overview metrics

**Status**: Already implemented with 4 main KPIs
- Lead Conversion %
- Campaign ROI
- Average Rating
- MTD Sales

**Components**:
- `src/pages/Dashboard.tsx` (✅ exists)
- `src/components/KPICard.tsx` (✅ exists)
- `src/services/kpiService.ts` (✅ exists)

**Data Mocks**: 
- `leadsMock.ts`, `salesMock.ts`, `campaignsMock.ts` (✅ exists)

**UI Notes**: Modern card-based layout with gradient backgrounds and trend indicators

---

### 2. Leads Management (✅ Implemented)
**Description**: Complete lead tracking and management system

**Status**: Fully functional with filtering and status updates

**Components**:
- `src/pages/LeadsList.tsx` (✅ exists)
- `src/components/leads/` (✅ exists)
- Lead filtering by status, source, priority

**Data Mocks**: 
- `leadsMock.ts` (✅ exists)

**UI Notes**: Table view with inline status updates and quick actions

---

### 3. WhatsApp Integration (✅ Implemented)
**Description**: WhatsApp Cloud API integration for sending messages

**Status**: Basic implementation with template sending

**Components**:
- `src/pages/WhatsAppPage.tsx` (✅ exists)
- `src/services/whatsapp.ts` (✅ exists)

**Data Mocks**: 
- `whatsappTemplatesMock.ts` (✅ exists)

**UI Notes**: Template selector with preview and variable input

---

### 4. Invoice Generator (✅ Implemented)
**Description**: PDF invoice creation and WhatsApp sharing

**Status**: Fully functional with jsPDF integration

**Components**:
- `src/pages/InvoicePage.tsx` (✅ exists)
- `src/services/invoiceService.ts` (✅ exists)

**Data Mocks**: 
- `invoicesMock.ts` (✅ exists)

**UI Notes**: Form-based invoice creation with PDF preview

---

### 5. Roles & Permissions (✅ Implemented)
**Description**: Simple RBAC system with 5 role types

**Status**: Frontend-only implementation complete

**Components**:
- `src/services/permissions.ts` (✅ exists)
- `src/layouts/MainLayout.tsx` (role-based nav filtering)

**Roles**:
- Owner: All permissions
- Admin: All except billing keys
- Sales: Leads, WhatsApp, Sales, Invoices, Reminders
- Support: Reviews, GBP Posts, Projects
- Viewer: Dashboard + Reports only

**Data Mocks**: 
- `staffMock.ts` (✅ exists with roles)

**UI Notes**: Dynamic sidebar navigation based on role permissions

---

### 6. AI Auto-Reply Customizer (⭕ To Implement)
**Description**: Customized auto-reply templates for different lead categories

**Priority**: HIGH (Differentiates from Grexa)

**Components to Create**:
- `src/pages/AutoReplyPage.tsx` (new)
- `src/components/autoreply/TemplateCard.tsx` (new)
- `src/components/autoreply/ToneSelector.tsx` (new)
- `src/services/autoReplyService.ts` (new)

**Data Mocks to Create**:
- `src/store/autoReplyTemplatesMock.ts` (new)
```typescript
interface AutoReplyTemplate {
  id: string;
  category: 'salon' | 'gym' | 'playground' | 'business' | 'general';
  tone: 'professional' | 'friendly' | 'emoji' | 'voice';
  language: 'hindi' | 'gujarati' | 'english' | 'auto';
  template: string;
  variables: string[];
  isActive: boolean;
}
```

**Technical Requirements**:
- AI SDK integration for auto-translation (call `ai_sdk__get_ai_sdk_docs`)
- Language detection and auto-translate capability
- Voice message reply option (future: Web Speech API)
- Emoji tone selector

**UI Notes**: 
- Card-based template gallery
- Category filter tabs (Salon/Gym/Playground/Business)
- Tone selector pills (Professional/Friendly/Emoji/Voice)
- Language toggle (Hindi/Gujarati/English/Auto)
- Preview panel with variable substitution

---

### 7. Smart Notification System (⭕ To Implement)
**Description**: Rule-based notification system for activities

**Priority**: HIGH (Critical for team coordination)

**Components to Create**:
- `src/pages/NotificationsPage.tsx` (new)
- `src/components/notifications/RuleBuilder.tsx` (new)
- `src/components/notifications/NotificationRuleRow.tsx` (new)
- `src/services/notificationService.ts` (new)

**Data Mocks to Create**:
- `src/store/notificationRulesMock.ts` (new)
```typescript
interface NotificationRule {
  id: string;
  event: 'lead_added' | 'payment_pending' | 'review_added' | 'sale_completed';
  condition: string; // e.g., "payment_pending > 3 days"
  channels: ('whatsapp' | 'push' | 'sms')[];
  recipients: string[]; // staff IDs
  isActive: boolean;
  message: string;
}
```

**Technical Requirements**:
- Mock notification sender (no real FCM for MVP)
- Rule builder UI with conditions
- Per-user notification preferences
- Integration with existing WhatsApp service

**UI Notes**:
- Rule list with toggle switches
- Visual rule builder (if/then format)
- Channel selector (WhatsApp/Push/SMS)
- Recipient multi-select
- Test notification button

**Future Integration**: Firebase Cloud Messaging (FCM) for real push notifications

---

### 8. Expense Tracker + Profit Dashboard (⭕ To Implement)
**Description**: Expense tracking with automatic profit calculations

**Priority**: HIGH (Business-critical metrics)

**Components to Create**:
- `src/pages/ExpensesPage.tsx` (new)
- `src/components/expenses/ExpenseForm.tsx` (new)
- `src/components/expenses/ProfitChart.tsx` (new)
- `src/services/expenseService.ts` (new)

**Data Mocks to Create**:
- `src/store/expensesMock.ts` (new)
```typescript
interface Expense {
  id: string;
  date: string;
  category: 'rent' | 'utilities' | 'salary' | 'marketing' | 'materials' | 'other';
  amount: number;
  description: string;
  receipt?: string;
  createdBy: string;
}
```

**Technical Requirements**:
- Chart.js or Recharts for visualizations
- Monthly/yearly profit calculation
- Category-wise expense breakdown
- Integration with existing Sales data

**Calculations**:
```typescript
Net Profit = Total Sales - Total Expenses
Profit Margin % = (Net Profit / Total Sales) × 100
```

**UI Notes**:
- Expense entry form with date picker
- Category selector with icons
- Monthly profit trend chart (line/bar)
- Pie chart for expense categories
- Profit summary cards on Dashboard

---

### 9. Multi-Business Switcher (⭕ To Implement)
**Description**: Manage multiple businesses from single app

**Priority**: MEDIUM (For multi-location/brand owners)

**Components to Create**:
- `src/components/BusinessSwitcher.tsx` (new - in header)
- `src/contexts/BusinessContext.tsx` (new)
- `src/services/businessService.ts` (new)

**Data Mocks to Create**:
- `src/store/businessesMock.ts` (new)
```typescript
interface Business {
  id: string;
  name: string;
  type: 'gym' | 'playground' | 'flooring' | 'amc' | 'salon' | 'other';
  location: string;
  logo?: string;
  isActive: boolean;
}
```

**Technical Requirements**:
- Context API for current business state
- Separate localStorage keys per business
- Data isolation per business
- Future: Youware Backend with business_id column

**Data Separation**:
```typescript
// All existing stores need business_id
leads_{businessId}
sales_{businessId}
campaigns_{businessId}
expenses_{businessId}
```

**UI Notes**:
- Dropdown in header/sidebar
- Business logo + name display
- Quick switch with keyboard shortcut (Ctrl+B)
- Business settings page for management

---

## 🎨 SECONDARY SECTIONS (Priority: Medium)

### 10. AI Content Generator (⭕ To Implement)
**Description**: AI-powered marketing content creation

**Priority**: MEDIUM (Time-saving automation)

**Components to Create**:
- `src/pages/AIContentPage.tsx` (new)
- `src/components/ai/ContentTypeSelector.tsx` (new)
- `src/components/ai/GeneratedContent.tsx` (new)
- `src/services/aiContentService.ts` (new)

**Technical Requirements**:
- **MANDATORY**: Call `ai_sdk__get_ai_sdk_docs` with `framework: "react"`
- Use AI Integration Skill: `/skills/ai-integration/`
- Models: `openai-gpt-4o` or `claude-4-sonnet` for creative content

**Content Types**:
1. Google Business Post captions
2. WhatsApp campaign messages
3. Social media posts
4. Auto-generated hashtags
5. Product descriptions

**Data Mocks to Create**:
- `src/store/aiContentHistoryMock.ts` (new)

**UI Notes**:
- Content type selector (cards with icons)
- Input form for business keywords/context
- AI-generated preview with edit capability
- Copy to clipboard + Save to templates
- History of generated content

---

### 11. Voice Note to Lead (⭕ To Implement)
**Description**: Speech-to-text lead creation

**Priority**: MEDIUM (Convenience feature)

**Components to Create**:
- `src/components/leads/VoiceNoteButton.tsx` (new)
- Add to existing LeadsList page

**Technical Requirements**:
- Web Speech API (browser-native)
- Speech-to-text conversion
- NLP for extracting name, phone, interest
- Future: AI SDK for better parsing

**Flow**:
```
User speaks → "Ramesh Patel interested in 45mm artificial grass"
↓
Web Speech API converts to text
↓
AI parses: name="Ramesh Patel", interest="45mm artificial grass"
↓
Auto-fill lead form → Save
```

**UI Notes**:
- Mic button with pulse animation
- Real-time transcription display
- Confirmation before saving
- Fallback manual edit option

---

### 12. Task Management + Follow-Up Kanban (⭕ To Implement)
**Description**: Team task tracking with Kanban board

**Priority**: MEDIUM (Team collaboration)

**Components to Create**:
- `src/pages/TasksPage.tsx` (new)
- `src/components/tasks/KanbanBoard.tsx` (new)
- `src/components/tasks/TaskCard.tsx` (new)
- `src/services/taskService.ts` (new)

**Data Mocks to Create**:
- `src/store/tasksMock.ts` (new)
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done';
  linkedTo?: { type: 'lead' | 'project'; id: string };
  assignedTo: string; // staff ID
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}
```

**Technical Requirements**:
- Drag-and-drop (react-beautiful-dnd or @dnd-kit)
- Filter by assignee, linked entity, priority
- Due date reminders

**UI Notes**:
- Three columns: Pending → In Progress → Done
- Card with assignee avatar + due date badge
- Drag-to-reorder within column
- Quick add task button
- Link to lead/project from card

---

### 13. AI Report Generator (⭕ To Implement)
**Description**: Conversational AI for instant reports

**Priority**: LOW (Advanced feature)

**Components to Create**:
- `src/pages/AIReportPage.tsx` (new)
- `src/components/ai/ChatInterface.tsx` (new)
- `src/services/aiReportService.ts` (new)

**Technical Requirements**:
- **MANDATORY**: Call `ai_sdk__get_ai_sdk_docs` with `framework: "react"`
- Use AI Integration Skill: `/skills/ai-integration/`
- Model: `openai-gpt-4o` for data analysis
- Chart generation from AI responses

**Example Queries**:
- "Show me this month's lead conversion %"
- "Compare sales between January and February"
- "Which lead source has best conversion?"

**UI Notes**:
- Chat interface (bottom input + message bubbles)
- AI responses with embedded charts
- Quick query suggestions
- Export report as PDF

---

### 14. Auto WhatsApp Review Link (⭕ To Implement)
**Description**: Automatic review request after sale completion

**Priority**: LOW (Automation enhancement)

**Components to Create**:
- Add to existing automation service
- `src/services/reviewRequestService.ts` (new)

**Technical Requirements**:
- Trigger: Sale status changes to "Paid"
- WhatsApp template with customer name + review link
- Google Review link shortener

**Flow**:
```
Sale.status = "Paid"
↓
reviewRequestService.send(saleId)
↓
WhatsApp template: "Hi {name}, thanks for your purchase! Please review us: {short_link}"
```

**Integration**: Extends existing WhatsApp service and automation system

---

### 15. Offline Mode + Sync (⭕ To Implement)
**Description**: Work offline with background sync

**Priority**: LOW (Advanced PWA feature)

**Technical Requirements**:
- Service Worker for offline caching
- IndexedDB for offline data storage
- Background Sync API
- Conflict resolution strategy

**Data Flow**:
```
Online: API → State → UI
Offline: UI → IndexedDB (queued)
Back Online: IndexedDB → API (sync) → Clear queue
```

**Components to Create**:
- `src/services/offlineService.ts` (new)
- `src/hooks/useOfflineSync.ts` (new)

**UI Notes**:
- Offline indicator in header
- Sync status badge
- Queue count display
- Manual sync button

---

## 🔗 INTEGRATION SECTIONS

### 16. Google Reviews Integration (⏳ Planned)
**Description**: Fetch and respond to Google reviews

**Components**:
- Reviews listing page
- AI-powered reply suggestions
- Rating trend analysis

**Requirements**:
- Google My Business API
- AI SDK for reply generation

---

### 17. Google Business Profile (GBP) Posts (⏳ Planned)
**Description**: Manage GBP posts from CRM

**Components**:
- Post scheduler
- Performance metrics
- Media library

**Data Mocks**: `gbpPostsMock.ts` (✅ exists)

---

### 18. Campaigns Management (⏳ Planned)
**Description**: Marketing campaign tracking

**Components**:
- Campaign builder
- ROI tracking
- Multi-channel distribution

**Data Mocks**: `campaignsMock.ts` (✅ exists)

---

### 19. Projects/Kanban Board (⏳ Planned)
**Description**: Project management with Kanban view

**Components**:
- Project cards
- Status tracking
- Timeline view

**Data Mocks**: `projectsMock.ts` (✅ exists)

---

## 🎨 UI/UX ENHANCEMENTS

### 20. Dark/Light Theme Toggle (⭕ To Implement)
**Description**: Theme switcher for user preference

**Technical Requirements**:
- Tailwind dark mode (class strategy)
- localStorage for theme persistence
- `src/contexts/ThemeContext.tsx` (new)

**UI Notes**:
- Sun/Moon icon toggle in header
- Smooth transition animation
- Apply to all components

---

### 21. Custom App Icon & Branding (⭕ To Implement)
**Description**: Personalized branding

**Assets Needed**:
- Company logo (Lion 🦁)
- Favicon (16x16, 32x32, 192x192)
- PWA manifest icons

**Files to Update**:
- `public/favicon.ico`
- `yw_manifest.json` (icons array)
- `index.html` (meta tags)

---

### 22. QR Code Share Screen (⭕ To Implement)
**Description**: Generate QR for WhatsApp enquiry

**Components to Create**:
- `src/pages/QRSharePage.tsx` (new)
- QR code generator (qrcode.react)

**QR Content**:
```
WhatsApp: wa.me/91XXXXXXXXXX?text=I'm interested in...
Website: https://yourcompany.com
Google Profile: https://g.page/...
Catalog: https://catalog.yourcompany.com
```

**UI Notes**:
- Large QR code display
- Download QR as PNG
- Share options
- Custom message text

---

### 23. One-Tap Action Buttons (⭕ To Implement)
**Description**: Quick access to key actions

**Locations**:
- Lead card footer
- Sale detail page
- Dashboard quick actions

**Buttons**:
- "Visit Website" → Opens company website
- "View Catalog" → Opens product catalog
- "Google Profile" → Opens GMB listing
- "WhatsApp" → Opens WhatsApp chat

**UI Notes**: Icon buttons with tooltips

---

## 📊 IMPLEMENTATION ROADMAP

### Phase 1: Core Enhancements (Week 1-2)
1. **AI Auto-Reply Customizer** (HIGH priority)
   - Setup AI SDK integration
   - Build template management UI
   - Implement language auto-translation

2. **Smart Notification System** (HIGH priority)
   - Create rule builder UI
   - Mock notification service
   - Integrate with existing events

3. **Expense Tracker + Profit Dashboard** (HIGH priority)
   - Expense entry form
   - Profit calculations
   - Chart visualizations

### Phase 2: Business Management (Week 3)
4. **Multi-Business Switcher** (MEDIUM priority)
   - Business context setup
   - Data isolation
   - Switcher UI

5. **Task Management + Kanban** (MEDIUM priority)
   - Kanban board
   - Task CRUD operations
   - Drag-and-drop

### Phase 3: AI Features (Week 4)
6. **AI Content Generator** (MEDIUM priority)
   - Content type selector
   - AI integration
   - Template saving

7. **Voice Note to Lead** (MEDIUM priority)
   - Speech recognition
   - NLP parsing
   - Lead auto-creation

### Phase 4: Advanced & Integrations (Week 5+)
8. **AI Report Generator** (LOW priority)
9. **Auto Review Request** (LOW priority)
10. **Offline Mode** (LOW priority)
11. **UI/UX Enhancements** (Ongoing)

---

## 🔧 TECHNICAL IMPLEMENTATION NOTES

### AI SDK Integration
For features 6, 10, 13 (Auto-Reply, Content Generator, Report Generator):

1. **FIRST STEP**: Call `ai_sdk__get_ai_sdk_docs` with `framework: "react"`
2. **Follow Skill**: Use `/skills/ai-integration/` documentation
3. **Models to Use**:
   - Content Generation: `openai-gpt-4o` or `claude-4-sonnet`
   - Translation: `gemini-2.5-flash` (fast + cost-effective)
   - Analysis: `openai-gpt-4o` (best for data insights)

### Backend Integration (Future)
When ready to move from mock data to persistent storage:

1. **Setup Youware Backend**: 
   - Call `get_backend_guide` for documentation
   - Create project database
   - Design schema for all entities

2. **Key Tables**:
   - `businesses` (for multi-business support)
   - `expenses` (new)
   - `tasks` (new)
   - `notification_rules` (new)
   - `autoreply_templates` (new)
   - Add `business_id` foreign key to all existing tables

3. **Authentication**:
   - Use Youware User Info
   - Implement role-based access control server-side

### State Management
- Continue using Zustand for global state
- Create separate stores for new features:
  - `useExpenseStore`
  - `useTaskStore`
  - `useNotificationStore`
  - `useAutoReplyStore`
  - `useBusinessStore`

### Performance Considerations
- Lazy load AI features (code splitting)
- Implement virtual scrolling for large lists
- Debounce search/filter operations
- Cache AI responses (avoid redundant API calls)

---

## 📝 DATA MOCK EXAMPLES

### Auto-Reply Template Mock
```typescript
// src/store/autoReplyTemplatesMock.ts
export const autoReplyTemplatesMock: AutoReplyTemplate[] = [
  {
    id: '1',
    category: 'gym',
    tone: 'professional',
    language: 'hindi',
    template: 'नमस्ते {{name}}, आपकी {{service}} में रुचि के लिए धन्यवाद। हमारी टीम जल्द ही आपसे संपर्क करेगी।',
    variables: ['name', 'service'],
    isActive: true
  },
  {
    id: '2',
    category: 'playground',
    tone: 'friendly',
    language: 'english',
    template: 'Hi {{name}}! 🎉 Thanks for your interest in {{service}}. Our team will reach out soon!',
    variables: ['name', 'service'],
    isActive: true
  }
];
```

### Notification Rule Mock
```typescript
// src/store/notificationRulesMock.ts
export const notificationRulesMock: NotificationRule[] = [
  {
    id: '1',
    event: 'lead_added',
    condition: 'always',
    channels: ['whatsapp', 'push'],
    recipients: ['staff-1'], // Owner ID
    isActive: true,
    message: 'New lead added: {{leadName}} - {{leadSource}}'
  },
  {
    id: '2',
    event: 'payment_pending',
    condition: 'days_overdue > 3',
    channels: ['whatsapp'],
    recipients: ['staff-1', 'staff-2'],
    isActive: true,
    message: 'Payment pending for {{customerName}} - ₹{{amount}} ({{daysOverdue}} days)'
  }
];
```

---

## 🎯 SUCCESS METRICS

### Key Performance Indicators
1. **User Engagement**
   - Daily active users
   - Features usage frequency
   - Task completion rate

2. **Business Impact**
   - Lead conversion improvement
   - Time saved with automation
   - Profit margin visibility

3. **Technical Health**
   - Page load time < 2s
   - Build size < 500KB (gzipped)
   - Zero critical bugs

---

## 🚀 GETTING STARTED

### For Immediate Implementation
Start with **Phase 1** features:

1. **AI Auto-Reply**: Most differentiating feature
   - Call `ai_sdk__get_ai_sdk_docs` first
   - Build template UI
   - Integrate AI translation

2. **Smart Notifications**: Critical for team
   - Build rule builder
   - Mock implementation
   - Test with existing data

3. **Expense Tracker**: Business need
   - Simple CRUD form
   - Chart library integration
   - Profit calculations

### For Backend Migration
When ready for production:

1. Enable Youware Backend MCP tool
2. Call `get_backend_guide`
3. Create database schema
4. Migrate mock stores to API calls
5. Add authentication flow

---

## 📚 RELATED DOCUMENTATION

- **AI Integration**: `/skills/ai-integration/SKILL.md`
- **Backend Setup**: `/skills/backend-integration/SKILL.md`
- **Component Library**: `src/components/README.md`
- **Type Definitions**: `src/types/README.md`

---

**Last Updated**: 2025-11-12  
**Document Version**: 1.0 (Final)  
**Status**: Ready for implementation
