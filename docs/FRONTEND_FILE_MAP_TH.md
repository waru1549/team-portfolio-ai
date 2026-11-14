# Frontend File Map — แผนผังไฟล์และหน้าที่ของแต่ละไฟล์

เอกสารนี้อธิบายไฟล์ Frontend ที่มีอยู่ใน Repository ตามรายการที่ตรวจสอบในระหว่างพัฒนา ใช้เป็นคู่มือก่อนแก้ไขโค้ดและช่วยให้สมาชิกคนอื่นทราบว่าควรเริ่มดูจากไฟล์ใด

## 1. ภาพรวมการไหลของโปรแกรม

```text
src/main.tsx
   |
   v
src/App.tsx
   |
   +--> Portfolio route (/)
   |       |
   |       +--> PortfolioPage.tsx
   |               +--> Navbar.tsx
   |               +--> TeamHero.tsx
   |               +--> MemberSection.tsx
   |               |      +--> MemberCard.tsx
   |               +--> TeamContact.tsx
   |               +--> portfolioData.ts
   |
   +--> Chat route (/chat)
           |
           +--> ChatPage.tsx
                   +--> MessageBubble.tsx
                   +--> TypingIndicator.tsx
                   +--> ChatComposer.tsx
                   +--> chatApi.ts
                          +--> POST /api/chat
```

## 2. Root-level files

| Path | หน้าที่ | ควรแก้เมื่อใด |
|---|---|---|
| `.gitignore` | กำหนดไฟล์/โฟลเดอร์ที่ Git ไม่ควรติดตาม เช่น `.env`, `node_modules`, `dist` | เพิ่มชนิดไฟล์ชั่วคราวหรือ Secret ที่ไม่ควร Commit |
| `README.md` | หน้าแนะนำโครงการหลักบน GitHub | เปลี่ยนภาพรวม วิธีเริ่มต้น สถานะ หรือ Link เอกสาร |
| `.github/workflows/frontend-ci.yml` | GitHub Actions สำหรับติดตั้ง ตรวจ Lint รัน Tests และ Build Frontend | เปลี่ยนเงื่อนไข CI, Node version หรือคำสั่งตรวจคุณภาพ |
| `docs/chat-api-contract.md` | สัญญา API ระหว่าง Frontend กับ Backend | เปลี่ยน HTTP path, request/response, error shape หรือ validation |

## 3. Frontend configuration files

| Path | หน้าที่ | หมายเหตุ |
|---|---|---|
| `frontend/package.json` | รายการ dependencies และ scripts เช่น `dev`, `lint`, `test`, `build` | แก้ด้วย npm เมื่อเพิ่ม/ลบ package; ตรวจ lockfile ด้วย |
| `frontend/package-lock.json` | ล็อกเวอร์ชัน dependencies ที่ติดตั้ง | ควร Commit เมื่อ package เปลี่ยน |
| `frontend/vite.config.ts` | ตั้งค่า Vite plugins, proxy ไป Backend และ Vitest | Backend URL ใน Dev เชื่อมผ่าน `API_PROXY_TARGET` |
| `frontend/tsconfig.json` | TypeScript project references/config หลัก | เปลี่ยนเมื่อปรับ TypeScript project configuration |
| `frontend/tsconfig.app.json` | TypeScript configuration สำหรับแอป | ใช้ควบคุมการตรวจ TypeScript ของ Frontend |
| `frontend/tsconfig.node.json` | TypeScript configuration สำหรับไฟล์ฝั่ง Node/config | ใช้กับ config ที่ทำงานใน Node environment |
| `frontend/eslint.config.js` | กฎ ESLint สำหรับตรวจโค้ด | ปรับเมื่อจำเป็นต้องเปลี่ยน lint rules |
| `frontend/.gitignore` | Ignore สำหรับ Frontend เช่น `node_modules`, `dist`, `*.local` และไฟล์ Editor | ต้องไม่ทำให้ `.env.local` หลุดขึ้น Git |
| `frontend/.env.example` | ตัวอย่าง Environment Variables ที่ไม่มี Secret จริง | เป็นไฟล์ตัวอย่างที่ Commit ได้ |
| `frontend/README.md` | คู่มือใช้งาน Frontend โดยเฉพาะ | อัปเดตเมื่อคำสั่งหรือการตั้งค่า Frontend เปลี่ยน |
| `frontend/index.html` | HTML entry template ที่ Vite ใช้สร้างหน้าเว็บ | เปลี่ยน title/meta หรือ root element |

## 4. Frontend source files

### 4.1 Application entry, routing และ styles

| Path | หน้าที่ |
|---|---|
| `frontend/src/main.tsx` | Entry point ของ React; เตรียม DOM root และ providers ระดับแอป เช่น Router |
| `frontend/src/App.tsx` | กำหนด App shell และเส้นทางหน้า Portfolio (`/`) กับ Chat (`/chat`) รวม fallback route |
| `frontend/src/App.css` | CSS ของ App ที่ยังคงอยู่ในโปรเจกต์; ก่อนแก้ควรค้นหาว่า selector ใดถูกใช้อยู่ |
| `frontend/src/index.css` | Global CSS, Tailwind import และ design tokens/theme ที่ใช้ร่วมกัน |

### 4.2 Portfolio page และ components

| Path | หน้าที่ | ข้อมูลที่ใช้ |
|---|---|---|
| `frontend/src/pages/PortfolioPage.tsx` | ประกอบหน้า Group Portfolio จากส่วนย่อย | `portfolioData.ts` |
| `frontend/src/components/layout/Navbar.tsx` | Navigation หลักและลิงก์ระหว่าง Portfolio/Chat | React Router |
| `frontend/src/components/portfolio/TeamHero.tsx` | Hero/บทนำของกลุ่ม | ข้อมูลกลุ่มจาก portfolio data |
| `frontend/src/components/portfolio/MemberSection.tsx` | แสดงรายการสมาชิกและ layout แบบ responsive | `members` จาก portfolio data |
| `frontend/src/components/portfolio/MemberCard.tsx` | การ์ดข้อมูลสมาชิกและการจัดกลุ่ม Skills ตาม Role | Member type/skill data |
| `frontend/src/components/portfolio/TeamContact.tsx` | แสดงช่องทางติดต่อและลิงก์ที่เกี่ยวข้อง | contact data |
| `frontend/src/data/portfolioData.ts` | แหล่งข้อมูล Portfolio แบบ typed เช่น ข้อมูลกลุ่ม สมาชิก ทักษะ Contact และ helper สำหรับสร้าง Portfolio context | ปัจจุบันมีข้อมูลตัวอย่าง ต้องแทนด้วยข้อมูลที่ทีมอนุมัติ |

**เมื่อต้องแก้ข้อมูลสมาชิก:** เริ่มที่ `portfolioData.ts` ก่อน อย่าใส่ชื่อ/ทักษะ/URL ซ้ำใน Component หากข้อมูลนั้นควรมาจาก data source กลาง

### 4.3 Chat components และ page

| Path | หน้าที่ |
|---|---|
| `frontend/src/pages/ChatPage.tsx` | จัดการ state หลักของ Chat เช่น messages, input, loading, conversation ID, error, retry และ New Chat; เรียก `sendChatMessage()` |
| `frontend/src/components/chat/MessageBubble.tsx` | แสดงข้อความแต่ละรายการ แยกผู้ใช้/Assistant และ timestamp |
| `frontend/src/components/chat/TypingIndicator.tsx` | แสดงสถานะกำลังตอบ/กำลังพิมพ์ |
| `frontend/src/components/chat/ChatComposer.tsx` | ช่องกรอกข้อความและปุ่มส่ง; จัดการ Enter/Shift+Enter และสถานะ disabled ตาม props |
| `frontend/src/types/chat.ts` | TypeScript types สำหรับบทสนทนาและ API request/response/error |
| `frontend/src/services/chatApi.ts` | API client ใช้ Fetch API เรียก `POST /api/chat`; ตรวจข้อมูล จัดการ timeout และแปลง error |

**ขอบเขตสำคัญ:** `ChatPage.tsx` เป็น UI/state orchestration; `chatApi.ts` เป็นชั้น HTTP service; Backend ไม่ควรต้องรู้รายละเอียดการจัดวาง UI ของ React

### 4.4 Assets และ public files

| Path | หน้าที่ |
|---|---|
| `frontend/src/assets/hero.png` | รูปภาพ Hero ที่ import จาก source code |
| `frontend/src/assets/react.svg` | Asset ตัวอย่าง React ที่อยู่ในโปรเจกต์ |
| `frontend/src/assets/vite.svg` | Asset ตัวอย่าง Vite ที่อยู่ในโปรเจกต์ |
| `frontend/public/favicon.svg` | Favicon สำหรับหน้าเว็บ |
| `frontend/public/icons.svg` | ไฟล์ SVG icons ที่เสิร์ฟจาก public directory |

ไฟล์ `react.svg` และ `vite.svg` เป็นไฟล์ตัวอย่างจาก scaffolding; ก่อนลบควรค้นหา references ว่ายังถูกใช้งานหรือไม่

## 5. Test files และสิ่งที่ทดสอบ

| Test file | ขอบเขตทดสอบ | จำนวนที่ยืนยันล่าสุด |
|---|---|---:|
| `frontend/src/services/chatApi.test.ts` | API success/error, validation และ timeout | 9 |
| `frontend/src/components/chat/MessageBubble.test.tsx` | แสดงข้อความ user/assistant และ timestamp | 3 |
| `frontend/src/components/chat/ChatComposer.test.tsx` | input, send, Enter, Shift+Enter และ loading/disabled state | 7 |
| `frontend/src/pages/ChatPage.test.tsx` | empty state, prompt, success, loading, error/retry, conversation ID และ New Chat | 6 |
| **รวม** | | **25** |

เมื่อเปลี่ยน Component หรือ service ที่มี test อยู่ ให้แก้/เพิ่ม test ที่เกี่ยวข้องในไฟล์คู่กัน และรัน:

```bash
npm run test
npm run lint
npm run build
```

## 6. Environment และ Backend connection

ไฟล์ `frontend/.env.example` มีตัวแปรสำคัญ:

```env
API_PROXY_TARGET=http://localhost:3000
VITE_API_BASE_URL=
```

- `API_PROXY_TARGET`: Vite proxy target สำหรับ `/api` ใน Dev
- `VITE_API_BASE_URL`: Base URL ที่ API service ใช้ในกรณีตั้ง URL โดยตรง; ใน Dev ปล่อยว่างเพื่อใช้ proxy
- `.env.local`: ไฟล์เฉพาะเครื่อง ห้าม Commit

การเปลี่ยน Backend port หรือ host ต้องปรับ `.env.local` ของเครื่องผู้พัฒนา ไม่ควร hardcode localhost ซ้ำในหลาย Component

## 7. จุดเริ่มต้นเมื่อได้รับงานแก้ไข

| ลักษณะงาน | เริ่มดูไฟล์ |
|---|---|
| แก้ชื่อกลุ่ม/สมาชิก/ทักษะ/Contact | `src/data/portfolioData.ts` |
| ปรับหน้า Portfolio | `src/pages/PortfolioPage.tsx` และ Component ใน `components/portfolio/` |
| ปรับ Navigation | `src/components/layout/Navbar.tsx` และ `src/App.tsx` |
| ปรับข้อความ/รูปแบบ Bubble | `src/components/chat/MessageBubble.tsx` |
| ปรับช่องพิมพ์/ปุ่มส่ง | `src/components/chat/ChatComposer.tsx` |
| ปรับ loading indicator | `src/components/chat/TypingIndicator.tsx` |
| ปรับ flow, errors, retry, New Chat | `src/pages/ChatPage.tsx` |
| เปลี่ยน API payload/response/timeout | `src/services/chatApi.ts`, `src/types/chat.ts`, `docs/chat-api-contract.md` และ tests |
| เปลี่ยนสี/spacing/global styles | `src/index.css` และ Component ที่เกี่ยวข้อง |
| เปลี่ยน proxy หรือ Vitest config | `vite.config.ts` |
| เพิ่ม dependency หรือ script | `package.json` แล้วตรวจ `package-lock.json` |
| เปลี่ยน CI checks | `.github/workflows/frontend-ci.yml` |

## 8. สิ่งที่ไม่ควรทำ

- อย่าเรียก Fetch API กระจายจากทุก Component; ใช้ service layer ที่ `services/chatApi.ts`
- อย่าใส่ Secret ลง Frontend หรือ `VITE_*`
- อย่าเปลี่ยน API contract โดยไม่แจ้ง Backend และแก้เอกสาร/types/tests พร้อมกัน
- อย่าลบไฟล์ asset ตัวอย่างโดยไม่ตรวจ references
- อย่าถือว่าข้อมูลตัวอย่างใน Portfolio เป็นข้อมูลสมาชิกจริง
- อย่าถือว่า API client ที่ผ่าน Unit Tests แปลว่า Backend/AI integration ทำงานจริงแล้ว
