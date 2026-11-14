# Team Portfolio AI — ภาพรวมโครงการและคู่มือเริ่มต้น

> เอกสารแนะนำโครงการสำหรับสมาชิกในทีม ผู้ตรวจงาน และผู้ที่ต้องการทำความเข้าใจระบบก่อนแก้ไขโค้ด  
> สถานะเอกสารอ้างอิงจากผลการทำงานที่ยืนยันในแชตจนถึง Step 35

## 1. โครงการนี้คืออะไร

**Team Portfolio AI** เป็นโปรเจกต์ปลายภาค AIE312 สำหรับนำเสนอผลงานของสมาชิกในกลุ่มผ่านหน้า Group Portfolio และมีหน้า Chat สำหรับสื่อสารกับ AI ในรูปแบบแชต

แนวทางระบบที่กลุ่มกำลังพัฒนา:

1. **Group Portfolio** — แสดงข้อมูลกลุ่ม สมาชิก บทบาท ทักษะ และช่องทางติดต่อ
2. **AI Chat UI** — ให้ผู้ใช้พิมพ์ข้อความ ดูประวัติข้อความในหน้าจอ สถานะกำลังตอบ และข้อผิดพลาด
3. **Backend API** — ใช้ Express เป็นจุดรับคำขอจาก Frontend และเชื่อมต่อบริการ AI ตามการออกแบบของทีม
4. **Database** — ใช้ PostgreSQL เป็นฐานข้อมูลที่วางแผนไว้สำหรับจัดเก็บข้อมูลที่จำเป็น เช่น ประวัติการสนทนา

**สถานะสำคัญ:** Frontend และ API client ถูกพัฒนาแล้ว แต่ Express Backend, PostgreSQL integration และการเชื่อมต่อ AI จริงยังอยู่ระหว่างพัฒนา/รอการเชื่อมต่อ ดังนั้นอย่าอธิบายว่า AI Chat ใช้งานจริงครบวงจรแล้วจนกว่าจะทดสอบ Backend และ Database จริงผ่าน

## 2. เป้าหมายและขอบเขตปัจจุบัน

### งานที่ทำแล้วและมีผลตรวจยืนยัน

- React + TypeScript + Vite frontend
- หน้า Portfolio และหน้า Chat พร้อม routing
- แยก Component สำหรับส่วนหลักของ Portfolio และ Chat
- API service ด้วย `fetch()` สำหรับเรียก `POST /api/chat`
- API contract ใน `docs/chat-api-contract.md`
- Validation ฝั่ง Frontend, timeout และการจัดการ API error
- Automated tests รวม 25 tests ผ่าน
- ESLint และ Production Build ผ่าน
- GitHub Actions Frontend CI ผ่านทุกขั้นตอน
- GitHub repository และ Root README ถูก Push แล้ว

### งานที่ยังไม่ถือว่าเสร็จ

- Express API ที่ทำงานจริง
- การเชื่อมต่อ PostgreSQL และการจัดเก็บประวัติการสนทนา
- การเชื่อมต่อ LLM/AI provider และการทดสอบคำตอบจาก AI จริง
- การนำข้อมูลตัวอย่างของสมาชิกออกและใส่ข้อมูลจริงที่สมาชิกอนุญาตให้เผยแพร่
- Production deployment และการทดสอบระบบบน URL จริง
- Authentication/Authorization หากอาจารย์หรือข้อกำหนดระบบต้องการ (Frontend ปัจจุบันยังไม่ได้ยืนยันว่ามีระบบ Auth)

## 3. เทคโนโลยีที่ใช้

ตารางนี้แสดงเทคโนโลยีและเวอร์ชันที่ปรากฏในสภาพแวดล้อมตอนพัฒนา/ทดสอบของโปรเจกต์ ไม่ใช่คำแนะนำว่าเป็นเวอร์ชันล่าสุดของทุกแพ็กเกจ

| ส่วน | เทคโนโลยี | ใช้ทำอะไร |
|---|---|---|
| Frontend framework | React 19.3.1 | สร้าง UI แบบ Component |
| Language | TypeScript ~6.0.3 | เพิ่ม Type Safety |
| Build/dev server | Vite 8.3.6 | Development server และ Production build |
| CSS | Tailwind CSS 4.3.5 | Utility-first styling และ design tokens |
| Routing | React Router 8.5.1 | จัดการเส้นทาง Portfolio/Chat |
| Icons | lucide-react 1.70.0 | ไอคอนใน UI |
| API communication | Browser Fetch API | เรียก Backend ผ่าน HTTP |
| Unit/component tests | Vitest 5.1.0 | รันทดสอบอัตโนมัติ |
| React testing | React Testing Library, user-event, jest-dom | ทดสอบ Component จากมุมมองผู้ใช้ |
| DOM test environment | jsdom 31.0.0 | จำลอง DOM ในการทดสอบ |
| Code quality | ESLint 10.14.0 | ตรวจสอบรูปแบบและข้อผิดพลาดของโค้ด |
| Backend (planned) | Node.js + Express | สร้าง HTTP API |
| Database (planned) | PostgreSQL | เก็บข้อมูลถาวร |
| CI | GitHub Actions | ตรวจ Lint, Tests และ Build อัตโนมัติ |

สภาพแวดล้อมที่ใช้พัฒนา: Windows, PowerShell, VS Code, Node.js v24.21.0 และ npm 11.19.0

## 4. ภาพรวมสถาปัตยกรรม

```text
Browser
  |
  | React UI: PortfolioPage / ChatPage
  |
  +--> Portfolio data: src/data/portfolioData.ts
  |
  +--> ChatPage
         |
         +--> src/services/chatApi.ts
                 |
                 | POST /api/chat (JSON)
                 v
          Express Backend (ยังอยู่ระหว่างพัฒนา)
                 |
                 +--> AI provider (ยังไม่เชื่อมต่อจริง)
                 |
                 +--> PostgreSQL (ยังไม่เชื่อมต่อจริง)
```

ใน Local Development, Vite Proxy กำหนดเป้าหมาย Backend เป็น `http://localhost:3000` ผ่าน Environment Variable `API_PROXY_TARGET` และส่ง path `/api` ไปยัง Backend

## 5. โครงสร้าง Repository และหน้าที่ไฟล์

```text
team-portfolio-ai/
├── .github/
│   └── workflows/
│       └── frontend-ci.yml        # CI สำหรับตรวจ Frontend บน GitHub Actions
├── docs/
│   ├── chat-api-contract.md       # สัญญา request/response ระหว่าง Frontend กับ Backend
│   ├── PROJECT_OVERVIEW_TH.md    # ภาพรวมโครงการและหน้าที่ไฟล์
│   ├── FRONTEND_FILE_MAP_TH.md   # แผนผังไฟล์ Frontend แบบละเอียด
│   ├── FRONTEND_SETUP_HISTORY_TH.md # บันทึกการพัฒนา Step 01–35
│   └── TEAM_HANDOFF_TH.md        # คู่มือส่งต่องานให้ Backend/Database
├── frontend/
│   ├── public/                   # ไฟล์ Static ที่เสิร์ฟตรง
│   ├── src/
│   │   ├── assets/               # รูปภาพและ assets ที่ import ในโค้ด
│   │   ├── components/           # UI Components ที่นำกลับมาใช้ซ้ำ
│   │   ├── data/                 # ข้อมูล Portfolio
│   │   ├── pages/                # หน้าหลักของแอป
│   │   ├── services/             # การเรียก API
│   │   ├── types/                # TypeScript types/interfaces
│   │   ├── App.tsx               # Route และ app shell
│   │   ├── App.css               # CSS เฉพาะส่วน App ที่ยังใช้งาน
│   │   ├── index.css             # Global styles และ Tailwind theme
│   │   └── main.tsx              # Frontend entry point
│   ├── .env.example              # ตัวอย่าง Environment Variables
│   ├── .gitignore                # Ignore ของ Frontend
│   ├── package.json              # Dependencies และ scripts
│   ├── package-lock.json         # Lock dependencies ให้ติดตั้งซ้ำได้
│   ├── vite.config.ts            # Vite, proxy และ Vitest config
│   └── tsconfig*.json            # TypeScript configuration
├── .gitignore                    # Ignore ระดับ Repository
├── README.md                     # หน้าแนะนำโครงการบน GitHub
└── backend/ และ database/        # พื้นที่ที่วางแผนไว้; โฟลเดอร์ว่างไม่ถูก Git track
```

รายละเอียดระดับไฟล์อยู่ใน `FRONTEND_FILE_MAP_TH.md`

> หมายเหตุ: Git ไม่ติดตามโฟลเดอร์ว่าง ดังนั้น `backend/` และ `database/` อาจมีอยู่ในเครื่องของสมาชิก แต่ยังไม่ปรากฏใน GitHub จนกว่าจะมีไฟล์ภายใน

## 6. วิธีติดตั้งและรัน Frontend

### สิ่งที่ต้องมี

- Git
- Node.js 24 ตามสภาพแวดล้อมที่ทีมทดสอบ
- npm
- VS Code หรือ Editor ที่รองรับ TypeScript

### 6.1 Clone repository

```bash
git clone https://github.com/waru1549/team-portfolio-ai.git
cd team-portfolio-ai
```

### 6.2 ติดตั้ง Dependencies

```powershell
cd frontend
npm ci
```

ใช้ `npm ci` เพื่อให้ติดตั้งตาม `package-lock.json` ที่ Commit ไว้ ไม่ควรลบหรือแก้ lockfile โดยไม่มีเหตุผล

### 6.3 สร้าง Environment file

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

ค่าตั้งต้นที่ใช้ใน Local Development:

```env
API_PROXY_TARGET=http://localhost:3000
VITE_API_BASE_URL=
```

- `API_PROXY_TARGET` คือ URL ของ Express Backend ที่ Vite Proxy จะส่ง `/api` ไปหา
- `VITE_API_BASE_URL` เว้นว่างใน Local Development เพื่อใช้ Vite Proxy
- ห้ามใส่ Secret, API Key, Database Password หรือ Token จริงในตัวแปรที่ขึ้นต้นด้วย `VITE_` เพราะค่ากลุ่มนี้ถูกส่งไปยัง Browser ได้
- ห้าม Commit `.env.local`; ให้ Commit เฉพาะ `.env.example` ที่ไม่มี Secret

### 6.4 เปิด Development Server

```bash
npm run dev
```

เปิด URL ที่ Vite แสดงใน Terminal

### 6.5 คำสั่งตรวจคุณภาพ

รันภายใน `frontend/`:

```bash
npm run lint
npm run test
npm run build
npm run preview
```

`npm run preview` ใช้เปิด Production Build ที่สร้างด้วย `npm run build` ไม่ใช่ Backend Server

## 7. Chat API Contract ที่ Frontend คาดหวัง

เอกสารฉบับเต็ม: `docs/chat-api-contract.md`

**Method/Path**

```http
POST /api/chat
Content-Type: application/json
```

**Request**

```json
{
  "message": "สวัสดี",
  "conversationId": "optional-existing-conversation-id"
}
```

`conversationId` เป็น Optional ในคำขอแรก และใช้ส่งต่อเพื่ออ้างถึงบทสนทนาเดิมในคำขอถัดไป

**Success Response**

```json
{
  "reply": "สวัสดีครับ มีอะไรให้ช่วยไหม",
  "conversationId": "conversation-id-from-server"
}
```

**Error Response**

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "ข้อความแจ้งข้อผิดพลาด"
  }
}
```

รายละเอียดสำคัญจาก Frontend ปัจจุบัน:

- Frontend ตรวจข้อความว่างและจำกัดความยาวไม่เกิน 2,000 ตัวอักษร
- API client กำหนด timeout 30 วินาที
- Frontend จัดการ Network/HTTP/Response errors และรองรับการ Retry ตาม UI
- การตรวจสอบฝั่ง Frontend ไม่ทดแทน Validation ฝั่ง Backend; Express ต้องตรวจข้อมูลซ้ำทุกครั้ง
- Backend ควรคืน `conversationId` ตาม contract เพื่อให้ Frontend ส่งต่อในบทสนทนาถัดไป
- หากเปลี่ยนชื่อ field, path หรือ error shape ต้องประสานทีมและปรับ `docs/chat-api-contract.md`, types, service และ tests พร้อมกัน

## 8. Testing และ CI

มี Automated Tests รวม **25 tests** ตามผลรันที่ยืนยัน:

| Test file | จำนวน |
|---|---:|
| `src/services/chatApi.test.ts` | 9 |
| `src/components/chat/MessageBubble.test.tsx` | 3 |
| `src/components/chat/ChatComposer.test.tsx` | 7 |
| `src/pages/ChatPage.test.tsx` | 6 |
| **รวม** | **25** |

GitHub Actions Workflow: `.github/workflows/frontend-ci.yml`

Workflow รันเมื่อมี Push หรือ Pull Request ที่แตะ `frontend/**` หรือไฟล์ Workflow และสามารถสั่ง Manual ได้ผ่าน `workflow_dispatch`

ลำดับ CI:

1. Checkout Repository
2. Setup Node.js 24
3. `npm ci`
4. `npm run lint`
5. `npm run test`
6. `npm run build`

ผลที่ยืนยันจาก GitHub Actions สำหรับ Commit `574f8bd`: ทุกขั้นตอนผ่าน

## 9. Git workflow สำหรับสมาชิก

ตรวจสถานะก่อนเริ่ม:

```bash
git status
 git pull origin main
```

แนวทางทำงานที่แนะนำ:

1. ดึงการเปลี่ยนแปลงล่าสุดจาก `main` ก่อนเริ่มงาน
2. ทำงานใน Branch ของตนเอง แทนการแก้ `main` โดยตรงเมื่อทำงานร่วมกัน
3. รัน Lint, Tests และ Build ก่อนส่งงาน
4. Commit ด้วยข้อความที่สื่อความหมาย เช่น `feat: add conversation history` หรือ `fix: handle empty chat response`
5. Push Branch และเปิด Pull Request ให้ทีมตรวจ

คำสั่งตรวจสอบก่อนส่ง:

```bash
npm run lint
npm run test
npm run build
git diff --check
git status
```

หากยังไม่ได้ตกลง Branching Strategy กับทีม ให้คุยกันก่อนเริ่มแก้ไฟล์พร้อมกัน

## 10. ความปลอดภัยและข้อควรระวัง

- ห้าม Commit `.env.local`, API Keys, Passwords, Tokens หรือ Database Credentials
- ห้ามใส่ Secret ใน Frontend หรือ `VITE_*` variables
- Backend ต้องตรวจ request ซ้ำ แม้ Frontend มี Validation แล้ว
- อย่าเปิดเผยข้อมูลส่วนบุคคลของสมาชิกโดยไม่ได้รับอนุญาต
- ข้อมูลสมาชิกใน `portfolioData.ts` ยังเป็นข้อมูลตัวอย่างจนกว่าจะเปลี่ยนเป็นข้อมูลจริงที่กลุ่มอนุมัติ
- อย่าอ้างว่า AI, Database หรือ Deployment ใช้งานจริงจนกว่าจะทดสอบ integration จริง

## 11. เอกสารที่เกี่ยวข้อง

- `README.md` — แนะนำโครงการฉบับย่อบนหน้าแรก GitHub
- `frontend/README.md` — วิธีใช้งาน Frontend
- `docs/chat-api-contract.md` — สัญญาการสื่อสารกับ Chat API
- `docs/FRONTEND_FILE_MAP_TH.md` — หน้าที่ของไฟล์และ Component
- `docs/FRONTEND_SETUP_HISTORY_TH.md` — ประวัติขั้นตอนตั้งแต่ Step 01–35
- `docs/TEAM_HANDOFF_TH.md` — แนวทางประสานงานกับ Backend และ Database

---

**เจ้าของงาน Frontend/UI/UX ในประวัติการพัฒนานี้:** สมาชิกผู้จัดทำ Frontend  
**จำนวนสมาชิกกลุ่ม:** 3 คน ตามข้อมูลที่แจ้งไว้  
**Repository:** https://github.com/waru1549/team-portfolio-ai
