# NogDB GraphUI Web Requirement

## Console UI

* มีช่อง console เมื่อ execute query แล้วแสดงบน canvas
* มีเลขบรรทัด
* สามารถสั่ง execute query ได้เท่าที่ highlight ไว้
* ถ้าไม่ได้ highlight query ไว้ก็จะ execute ทั้งหมด
* สามารถดู history ได้
    * ถ้าเปลี่ยนหน้าหรือรีเฟรช history ก็จะหาย
    * สามารถลบทั้งหมดได้
    * สามารถลบทีละอันได้
    * แต่ละ history จะสามารถ
        * ลบ history
        * re-execute
            * กดจาก history แล้ว re-execute query นั้นให้เลย
            * เคลียร์ค่าใน console แล้วนำ query ที่กดจาก history ไปแสดงแทน
            * แสดงของใน canvas
            * เก็บใน history
        * copy to console
            * กดจาก history แล้วไปใส่ไว้ใน console ให้โดยขึ้นบรรทัดใหม่ต่อจากของเดิมที่มีอยู่แต่ยังไม่ execute ให้
* limit จำนวน node ที่แสดงได้

## Graph UI

* มีเมนูของ canvas
    * Add Node
        * list class ทั้งหมดใน DB เมื่อเลือกแล้ว next ไปจะแสดง attribute ตาม schema 
        * สามารถกำหนดค่าให้ attribute ได้
    * Clear canvas
    * Fullscreen
* มีแถบ properties แสดงทางซ้ายมือ
    * แสดงข้อมูลตาม schema ของ node หรือ relationship นั้นๆ 
    * สามารถกำหนด display format ได้ โดยจะเป็นการแสดงของแต่ละ class
* แสดง relationship เป็นเส้นมีหัวลูกศร และแสดง node เป็น วงกลม ใน canvas
* node setting สามารถกำหนดค่าได้ดังต่อไปนี้
    * display template
    * node size
    * node fill
* relationship setting สามารถกำหนดค่าได้ดังต่อไปนี้
    * display template
    * relationship color
* select relationship to
    * view information
    * edit attribute
    * remove relationship
        * มี confirm ว่าต้องการที่จะลบเส้นเชื่อมระหว่าง Node1 กับ Node2 นะ
* select node to
    * view information
    * edit attribute
    * remove node from canvas
    * delete node from database
    * query in/out relationship by class
    * create relationship เพื่อสร้าง relationship ได้ กดลากใส่ไปยังปลายทางได้
* zoom in/out canvas โดยการ mouse scroll
* drag canvas
* move node
* ปุ่มยกเลิกการ query ในเคสที่ query นาน