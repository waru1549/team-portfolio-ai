# เอกสารประกอบ Team Portfolio AI

โฟลเดอร์นี้รวมเอกสารสำหรับทำความเข้าใจ พัฒนา และส่งต่องานของโครงการ Team Portfolio AI

## เลือกอ่านตามจุดประสงค์

| เอกสาร | เหมาะสำหรับ | เนื้อหา |
|---|---|---|
| [`PROJECT_OVERVIEW_TH.md`](PROJECT_OVERVIEW_TH.md) | สมาชิกใหม่/อาจารย์/ผู้ตรวจงาน | โครงการทำอะไร ใช้เครื่องมืออะไร สถานะปัจจุบัน วิธีติดตั้งและรัน |
| [`FRONTEND_FILE_MAP_TH.md`](FRONTEND_FILE_MAP_TH.md) | สมาชิกที่ต้องแก้ Frontend | หน้าที่ของแต่ละไฟล์/Component และควรเริ่มแก้จากจุดใด |
| [`FRONTEND_SETUP_HISTORY_TH.md`](FRONTEND_SETUP_HISTORY_TH.md) | ผู้ต้องการดูประวัติการสร้าง | บันทึกขั้นตอน Step 01–35 ตั้งแต่สร้างโปรเจกต์จน Push ขึ้น GitHub |
| [`TEAM_HANDOFF_TH.md`](TEAM_HANDOFF_TH.md) | สมาชิก Backend/Database และผู้ทำ Integration | API contract, ขอบเขต Backend/Database, สิ่งที่ต้องตกลงร่วมกัน และ Definition of Done |
| [`chat-api-contract.md`](chat-api-contract.md) | Frontend/Backend developer | Request/response และ error contract ของ Chat API ที่ Frontend คาดหวัง |

## แนวทางการอ่าน

1. เริ่มจาก `PROJECT_OVERVIEW_TH.md` เพื่อเข้าใจภาพรวม
2. อ่าน `FRONTEND_FILE_MAP_TH.md` เพื่อหาไฟล์ที่เกี่ยวข้องกับงาน
3. อ่าน `TEAM_HANDOFF_TH.md` ก่อนเชื่อม Frontend กับ Backend/Database
4. ใช้ `FRONTEND_SETUP_HISTORY_TH.md` เป็นบันทึกขั้นตอนที่ทำแล้วและเพิ่มบันทึกใหม่เมื่อพัฒนาเพิ่ม

## ข้อควรระวัง

- สถานะในเอกสารเป็นข้อมูล ณ รอบการพัฒนาที่บันทึกไว้ ต้องปรับปรุงเมื่อมีการเปลี่ยนโค้ด
- แยกสถานะ Implemented, In Development และ Pending ให้ชัดเจน
- ห้ามนำ API keys, passwords, tokens หรือ database credentials มาใส่ในเอกสารหรือ commit ลง Git
- `chat-api-contract.md` เป็นสัญญาที่ Frontend ใช้อยู่ หากเปลี่ยนต้องประสาน Frontend และ Backend พร้อมกัน
