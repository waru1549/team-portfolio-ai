# Team Handoff Guide — คู่มือประสานงาน Frontend, Backend และ Database

เอกสารนี้จัดทำเพื่อให้สมาชิกแต่ละส่วนเข้าใจขอบเขตของ Frontend ปัจจุบันและวิธีเชื่อมต่อกัน โดยแยก **สิ่งที่มีอยู่แล้ว**, **สิ่งที่ Backend/Database ต้องทำ**, และ **สิ่งที่ทีมต้องตกลงร่วมกัน** ออกจากกัน

## 1. สถานะและขอบเขตของแต่ละส่วน

| ส่วน | สิ่งที่มีแล้ว | สิ่งที่ยังต้องทำ/ยืนยัน |
|---|---|---|
| Frontend | Portfolio UI, Chat UI, API service, types, tests, CI | ใส่ข้อมูลจริง, integration test กับ Backend, polish ตาม rubric |
| Backend | มี API contract ที่ Frontend คาดหวังและ Vite proxy target `localhost:3000` | สร้าง Express server, implement `POST /api/chat`, validation, error handling, AI provider connection |
| Database | PostgreSQL เป็นฐานข้อมูลที่วางแผนไว้ | ออกแบบ schema/migration, persistence, indexes, retention และ integration กับ Backend |
| AI integration | มี Chat UI และ API request flow | เลือก provider/model, prompt/context policy, backend-only secret, error/rate limit handling |
| Deployment | มี Frontend production build และ CI | เลือก hosting, ตั้ง environment variables, configure CORS/HTTPS, deploy และ smoke test |

อย่าสรุปว่าส่วน Backend/Database/AI เสร็จแล้วจากเอกสาร Frontend นี้ เอกสารนี้เป็นข้อตกลงฝั่ง Client ที่ Backend ต้อง implement ให้สอดคล้อง หรือเสนอเปลี่ยน contract ผ่านการคุยกับทีมก่อน

## 2. Frontend contract สำหรับ Chat API

### Endpoint ที่ Frontend เรียก

```http
POST /api/chat
Content-Type: application/json
```

### Request shape

```json
{
  "message": "ข้อความจากผู้ใช้",
  "conversationId": "optional-conversation-id"
}
```

- `message`: ข้อความที่ผู้ใช้ส่ง
- `conversationId`: ไม่มีในคำขอแรกได้; ใช้ส่งต่อเมื่อดำเนินบทสนทนาเดิม

### Success response shape

```json
{
  "reply": "ข้อความตอบกลับจาก Assistant",
  "conversationId": "conversation-id"
}
```

### Error response shape

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "ข้อความอธิบายข้อผิดพลาด"
  }
}
```

### สิ่งที่ Frontend client ทำอยู่

- เรียก `POST /api/chat` ด้วย JSON
- ตรวจ `message` ว่ามีข้อความและไม่เกิน 2,000 ตัวอักษร
- ตรวจ `conversationId` หากมีค่า
- กำหนด timeout 30 วินาทีด้วย AbortController
- จัดการ Network, HTTP และ invalid response errors
- นำ `conversationId` จาก response ไปใช้กับข้อความถัดไป
- มี UI สำหรับ loading, error และ retry

### สิ่งที่ Backend ต้องทำ แม้ Frontend จะทำแล้ว

1. Validate body และชนิดข้อมูลที่ server-side ทุกครั้ง
2. ปฏิเสธข้อความว่างหรือยาวเกิน limit ที่ทีมตกลงกัน
3. ตรวจสอบว่า `conversationId` ใช้งานได้และผู้ร้องขอมีสิทธิ์เข้าถึง หากมีระบบตัวตน/authorization
4. คืน success JSON ด้วย field `reply` และ `conversationId` ให้ตรง contract
5. คืน error JSON ด้วย `error.code` และ `error.message` อย่างสม่ำเสมอ
6. จัดการ provider timeout, rate limit, provider error และ internal error โดยไม่ส่งข้อมูลลับหรือ stack trace ให้ Client
7. เก็บ API keys/provider secrets ฝั่ง server เท่านั้น
8. กำหนด CORS/HTTPS/rate limiting ตาม environment ที่ deploy
9. เพิ่ม Backend tests สำหรับ validation, success, provider failure และ database failure

> ความยาวข้อความ 2,000 ตัวอักษรและ timeout 30 วินาทีเป็นค่าที่ Frontend ใช้อยู่ ณ ตอนจัดทำเอกสาร ควรคุยกันก่อนเปลี่ยนค่าให้เป็นมาตรฐานร่วม

## 3. ข้อแนะนำสำหรับ Database Member

Frontend ไม่เชื่อม PostgreSQL โดยตรง และไม่ควรนำ Database connection string หรือ password เข้า Browser การเชื่อมต่อควรผ่าน Backend เท่านั้น

หัวข้อที่ทีม Backend/Database ควรออกแบบร่วมกัน:

- ตาราง conversation และ message หรือ schema ทางเลือกที่ทีมตกลง
- Primary Key และ Foreign Key ของ conversation/message
- การเชื่อม message กับ conversation
- บทบาทผู้สร้าง/เจ้าของบทสนทนา หากระบบมี user identity
- ลำดับเวลา, created_at, ordering และ pagination ของข้อความ
- Index สำหรับค้นหาข้อความตาม conversation และเวลา
- Transaction strategy เพื่อไม่ให้บันทึกข้อมูลครึ่งเดียว
- การจัดการข้อมูลซ้ำเมื่อ Client retry (idempotency strategy หากจำเป็น)
- Data retention/deletion และ privacy requirements
- Migration/seed/test data และ backup strategy ตามระดับที่งานกำหนด

**ยังไม่มี schema ที่ยืนยันใน Frontend** ดังนั้นอย่าอ้างชื่อ table/column ว่าเป็นของจริงจนกว่า Database Member จะกำหนดและส่ง ERD/migration ที่ทีมอนุมัติ

## 4. แนวทาง AI/LLM integration

การเรียก AI provider ควรทำจาก Backend ไม่ควรเรียกจาก Browser โดยตรงด้วย secret key

Backend ควรรับผิดชอบ:

- จัดการ system prompt และ context ที่อนุญาตให้โมเดลเห็น
- ส่ง conversation history ที่จำเป็นตามข้อกำหนดและ token budget
- แยกข้อมูล Portfolio ที่อนุญาตให้ใช้เป็น knowledge/context จากข้อมูลส่วนตัวที่ไม่ควรเปิดเผย
- ป้องกัน prompt injection ตามขอบเขตความสามารถและข้อมูลที่ AI เข้าถึง
- จำกัด rate/cost และจัดการ timeout/provider errors
- ไม่ส่ง API key หรือ internal configuration กลับ Frontend

ถ้าต้องการให้ AI ตอบคำถามเกี่ยวกับสมาชิก ให้ทีมกำหนดแหล่งข้อมูลที่เชื่อถือได้ เช่น Portfolio data ที่ผ่านการอนุมัติ และกำหนดว่าข้อมูลใดเปิดเผยได้

## 5. Development URLs และ Environment

### Frontend local

ตัวอย่างคำสั่ง:

```powershell
cd frontend
Copy-Item .env.example .env.local
npm ci
npm run dev
```

ค่าตัวอย่างใน `.env.local`:

```env
API_PROXY_TARGET=http://localhost:3000
VITE_API_BASE_URL=
```

Backend ควรเปิดรับคำขอที่ port `3000` ใน Local Development ตามค่า proxy นี้ หรือให้ Frontend Member เปลี่ยน `API_PROXY_TARGET` ให้ตรงกับ port ที่ตกลงกัน

### Production

- ตั้ง `VITE_API_BASE_URL` เป็น public API base URL ที่ไม่ใช่ secret เมื่อจำเป็นต้องเรียก Backend โดยตรง
- API secrets, LLM keys และ Database credentials ต้องตั้งใน Backend hosting environment เท่านั้น
- ตรวจ CORS ให้ยอมรับ origin ของ Frontend ที่ deploy
- ใช้ HTTPS และตรวจ endpoint จริงหลัง deploy

## 6. Definition of Done สำหรับการเชื่อมต่อ Frontend กับ Backend

ถือว่า Chat API integration ผ่านเมื่อทีมทดสอบครบอย่างน้อย:

- [ ] Backend รันได้ตาม URL/port ที่ตกลง
- [ ] `POST /api/chat` รับ JSON request ตาม contract
- [ ] ส่งข้อความครั้งแรกแล้วคืน `reply` และ `conversationId`
- [ ] ส่งข้อความครั้งถัดไปพร้อม `conversationId` เดิมแล้วทำงานต่อบทสนทนาได้
- [ ] Frontend แสดงคำตอบจริงจาก Backend ไม่ใช่ Mock
- [ ] Loading state หายไปเมื่อ request จบ
- [ ] Backend error ทำให้ Frontend แสดง error state ที่อ่านเข้าใจได้
- [ ] Retry ทำงานได้โดยไม่ทำให้ UI ค้าง
- [ ] Timeout/network failure แสดงสถานะที่เหมาะสม
- [ ] Validation ทำงานทั้ง Client และ Server
- [ ] หากใช้ PostgreSQL: ข้อมูลถูกบันทึกและอ่านกลับได้หลัง refresh/เริ่ม session ใหม่ตาม design
- [ ] Tests ของ Frontend และ Backend ผ่าน
- [ ] ไม่มี Secret ใน Git history หรือ Browser bundle

## 7. Definition of Done สำหรับ Portfolio data

- [ ] ชื่อกลุ่มและคำอธิบายผ่านการยืนยันจากสมาชิกทุกคน
- [ ] มีสมาชิกครบ 3 คนตามข้อมูลกลุ่ม
- [ ] ชื่อ บทบาท หน้าที่ และ skills ถูกต้อง
- [ ] ภาพ/URL/Contact ได้รับอนุญาตให้เผยแพร่
- [ ] เปลี่ยนข้อมูลใน `frontend/src/data/portfolioData.ts` เป็นแหล่งข้อมูลหลัก
- [ ] ไม่มี placeholder ชื่อ Alex/Blair/Casey หรือ URL ตัวอย่างหลงเหลือ
- [ ] `npm run lint`, `npm run test`, `npm run build` ผ่าน

## 8. ข้อตกลงการแก้ API Contract

หาก Backend ต้องเปลี่ยน path, field, status code หรือ error format:

1. แจ้งสมาชิก Frontend ก่อนแก้ API
2. เสนอ request/response ตัวอย่างใหม่
3. แก้ `docs/chat-api-contract.md` ให้เป็นแหล่งอ้างอิงกลาง
4. แก้ TypeScript types ใน `frontend/src/types/chat.ts`
5. แก้ service ใน `frontend/src/services/chatApi.ts`
6. แก้/เพิ่ม tests ทั้งฝั่ง Client และ Server
7. ทดสอบ integration ร่วมกัน
8. Commit changes ที่เกี่ยวข้องและให้ CI ผ่าน

ไม่ควรเปลี่ยน contract เงียบ ๆ เพราะอาจทำให้ Frontend และ Backend ใช้ field คนละชุด

## 9. ตารางประสานงานสำหรับกลุ่ม

กรอกชื่อจริงและหน้าที่ที่กลุ่มตกลงกัน ไม่ควรถือว่าตัวอย่างด้านล่างเป็นการมอบหมายจริง

| ส่วนงาน | ผู้รับผิดชอบ | สิ่งที่ต้องส่งมอบ | สถานะ |
|---|---|---|---|
| Frontend / UI / UX | สมาชิกผู้พัฒนา Frontend | React pages/components, API client, UI tests | Frontend milestone ผ่าน; integration รอ Backend |
| Backend / Express | ให้กลุ่มระบุ | API implementation, validation, AI provider integration | รออัปเดตจากผู้รับผิดชอบ |
| Database / PostgreSQL | ให้กลุ่มระบุ | ERD, migrations, persistence, test data | รออัปเดตจากผู้รับผิดชอบ |
| Integration / Deployment | ตกลงร่วมกัน | End-to-end tests, environment setup, deployed URL | Pending |

## 10. เอกสารอ้างอิงภายใน Repository

- `docs/chat-api-contract.md` — contract ที่ Frontend ใช้อยู่
- `docs/PROJECT_OVERVIEW_TH.md` — ภาพรวมและการเริ่มต้นใช้งาน
- `docs/FRONTEND_FILE_MAP_TH.md` — หน้าที่ของแต่ละไฟล์
- `docs/FRONTEND_SETUP_HISTORY_TH.md` — ขั้นตอนที่ทำตั้งแต่ Step 01–35
