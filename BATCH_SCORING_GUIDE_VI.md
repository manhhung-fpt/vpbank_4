# Hướng Dẫn Sử Dụng Batch Credit Scoring (Tính Điểm Tín Dụng Hàng Loạt)

## Tổng Quan

Tính năng Batch Credit Scoring cho phép bạn upload file chứa thông tin của nhiều khách hàng và tính điểm tín dụng cho tất cả cùng một lúc. Hệ thống hỗ trợ các định dạng file phổ biến như CSV, Excel (XLSX, XLS) và JSON.

## Tính Năng Chính

### 1. Upload File Hàng Loạt
- Kéo thả hoặc click để chọn file
- Hỗ trợ định dạng: CSV, Excel, JSON
- Theo dõi tiến trình xử lý theo thời gian thực
- Xử lý tối đa hàng ngàn hồ sơ cùng lúc

### 2. Mẫu Có Sẵn
- Tải xuống file mẫu với 3 hồ sơ điền sẵn
- Mẫu 1: Nhân viên lương cố định (điểm cao)
- Mẫu 2: Freelancer (điểm trung bình)
- Mẫu 3: Sinh viên (điểm thấp hơn)

### 3. Phân Tích Toàn Diện
- Điểm tín dụng cho từng hồ sơ
- Phân loại rủi ro (Thấp/Trung bình/Cao)
- Xác suất phê duyệt
- Khuyến nghị (Phê duyệt/Xem xét/Từ chối)

### 4. Thống Kê Tổng Hợp
- Tổng số hồ sơ xử lý
- Điểm trung bình
- Phân bố rủi ro
- Tổng số tiền vay
- Tỷ lệ phê duyệt

### 5. Xuất Kết Quả
- Xuất kết quả ra file CSV
- Bao gồm tất cả thông tin chi tiết
- Dễ dàng chia sẻ và báo cáo

## Hướng Dẫn Sử Dụng

### Bước 1: Truy Cập Tính Năng

Có 3 cách để truy cập:

1. **Từ Menu Sidebar**: 
   - Nhấn vào "Batch Scoring" trong menu bên trái

2. **Từ URL**:
   - Truy cập: `http://localhost:3000/dashboard/batch-scoring`

3. **Phím tắt**:
   - Nhấn `Ctrl + K` (hoặc `Cmd + K` trên Mac)
   - Gõ "b s" và nhấn Enter

### Bước 2: Tải Xuống Mẫu

1. Nhấn nút **"Download Template"**
2. File CSV sẽ được tải xuống với tên `credit_application_template.csv`
3. Mở file bằng Excel hoặc Google Sheets
4. Xem 3 mẫu hồ sơ có sẵn để tham khảo

### Bước 3: Chuẩn Bị Dữ Liệu

#### Các Trường Bắt Buộc:

| Tên Trường | Mô Tả | Ví Dụ |
|------------|-------|-------|
| name | Họ và tên | Nguyễn Văn A |
| email | Email | nguyenvana@example.com |
| phone | Số điện thoại | +84123456789 |
| age | Tuổi (18-100) | 35 |
| employment_type | Loại công việc | Salaried, Freelancer, Self-Employed, Student |
| annual_income | Thu nhập hàng năm (VND) | 800000000 |
| years_employed | Số năm làm việc | 8 |
| existing_loans | Số khoản vay hiện tại | 1 |
| credit_history_length | Thời gian lịch sử tín dụng (tháng) | 96 |
| has_bank_account | Có tài khoản ngân hàng | true/false |
| monthly_expenses | Chi tiêu hàng tháng (VND) | 30000000 |
| loan_amount | Số tiền vay yêu cầu (VND) | 200000000 |
| loan_purpose | Mục đích vay | Home improvement |

#### Lưu Ý Quan Trọng:

✅ **Đúng định dạng:**
- Số tuổi: số nguyên từ 18-100
- Thu nhập: số dương, đơn vị VND
- has_bank_account: true hoặc false
- employment_type: chính xác theo danh sách

❌ **Tránh lỗi:**
- Không để trống các trường bắt buộc
- Không dùng ký tự đặc biệt trong email
- Thu nhập phải lớn hơn chi tiêu hàng tháng

### Bước 4: Upload File

1. **Cách 1 - Kéo thả**:
   - Kéo file từ thư mục vào vùng upload

2. **Cách 2 - Click chọn**:
   - Click vào vùng upload
   - Chọn file từ máy tính

3. **Kiểm tra**:
   - Tên file và kích thước sẽ hiển thị
   - Đảm bảo file đúng định dạng

### Bước 5: Phân Tích

1. Nhấn nút **"Analyze Applications"**
2. Theo dõi tiến trình:
   - Uploading: Đang tải file lên
   - Processing: Đang xử lý dữ liệu
3. Chờ kết quả (thường < 30 giây)

### Bước 6: Xem Kết Quả

#### A. Thẻ Thống Kê (Summary Cards)

Hiển thị tổng quan:
- 📊 **Tổng số hồ sơ**: Số lượng hồ sơ đã xử lý
- 📈 **Điểm trung bình**: Điểm tín dụng trung bình
- 🔴 **Rủi ro cao**: Số hồ sơ rủi ro cao
- 🟡 **Rủi ro trung bình**: Số hồ sơ rủi ro trung bình
- 🟢 **Rủi ro thấp**: Số hồ sơ rủi ro thấp
- 💰 **Tổng tiền vay**: Tổng số tiền vay yêu cầu
- ✅ **Khuyến nghị phê duyệt**: Số hồ sơ nên phê duyệt

#### B. Bảng Chi Tiết (Results Table)

Mỗi hàng hiển thị:
- Họ tên khách hàng
- Điểm tín dụng (màu sắc theo mức độ)
- Loại rủi ro (badge màu)
- Xác suất phê duyệt (%)
- Khuyến nghị

**Xem Chi Tiết:**
- Click vào mũi tên (▶️) để mở rộng
- Xem các yếu tố ảnh hưởng điểm số:
  - 🟢 Yếu tố tích cực
  - 🔴 Yếu tố tiêu cực
  - ⚪ Yếu tố trung lập

### Bước 7: Xuất Kết Quả

1. Nhấn nút **"Export Results"**
2. File CSV sẽ được tải xuống
3. Tên file: `batch_analysis_[timestamp].csv`
4. Có thể mở bằng Excel để xem và in

## Diễn Giải Kết Quả

### Thang Điểm Tín Dụng

| Điểm | Phân Loại | Màu Hiển Thị | Ý Nghĩa |
|------|-----------|--------------|---------|
| 700-850 | Rủi ro Thấp | 🟢 Xanh lá | Tín dụng xuất sắc, rất đáng tin cậy |
| 600-699 | Rủi ro Trung Bình | 🟡 Vàng | Tín dụng tốt, cần xem xét thêm |
| 300-599 | Rủi ro Cao | 🔴 Đỏ | Tín dụng yếu, cần cải thiện |

### Khuyến Nghị

| Khuyến Nghị | Điều Kiện | Hành Động |
|-------------|-----------|-----------|
| ✅ **Phê Duyệt** | Xác suất ≥ 70% | Có thể phê duyệt tự động |
| 🔍 **Xem Xét** | Xác suất 40-69% | Cần đánh giá thủ công |
| ❌ **Từ Chối** | Xác suất < 40% | Không nên phê duyệt |

### Các Yếu Tố Quan Trọng

#### Yếu Tố Tích Cực (🟢):
- Thu nhập cao, ổn định
- Thời gian làm việc lâu
- Lịch sử tín dụng dài
- Ít khoản vay hiện tại
- Tỷ lệ chi tiêu/thu nhập thấp

#### Yếu Tố Tiêu Cực (🔴):
- Thu nhập thấp, không ổn định
- Mới bắt đầu công việc
- Không có lịch sử tín dụng
- Nhiều khoản vay hiện tại
- Chi tiêu cao so với thu nhập

## Ví Dụ Thực Tế

### Ví Dụ 1: Phân Tích 5 Hồ Sơ

**Input:**
- File CSV với 5 hồ sơ khách hàng
- Gồm: 2 nhân viên, 2 freelancer, 1 sinh viên

**Output:**
```
📊 Tổng số hồ sơ: 5
✅ Xử lý thành công: 5
📈 Điểm trung bình: 645
🟢 Rủi ro thấp: 2 hồ sơ
🟡 Rủi ro TB: 2 hồ sơ  
🔴 Rủi ro cao: 1 hồ sơ
💰 Tổng vay: 800.000.000 VND
✅ Khuyến nghị: 3 hồ sơ
```

### Ví Dụ 2: So Sánh Profile

| Khách Hàng | Điểm | Rủi ro | Khuyến Nghị | Lý Do |
|------------|------|--------|-------------|-------|
| Nguyễn Văn A | 780 | Thấp | Phê duyệt | Thu nhập cao, 8 năm kinh nghiệm |
| Trần Thị B | 625 | TB | Xem xét | Freelancer, thu nhập không ổn định |
| Lê Văn C | 450 | Cao | Từ chối | Sinh viên, lịch sử tín dụng ngắn |

## Xử Lý Lỗi

### Lỗi Thường Gặp

#### 1. File Không Đúng Định Dạng
**Lỗi:** "Invalid file type"
**Giải pháp:**
- Chỉ dùng file CSV, XLSX, XLS hoặc JSON
- Kiểm tra phần mở rộng file

#### 2. Dữ Liệu Không Hợp Lệ
**Lỗi:** "Validation error"
**Giải pháp:**
- Kiểm tra các trường bắt buộc
- Đảm bảo đúng kiểu dữ liệu
- So sánh với file mẫu

#### 3. File Quá Lớn
**Lỗi:** "File too large"
**Giải pháp:**
- Chia nhỏ file thành nhiều batch
- Mỗi batch nên < 1000 hồ sơ

#### 4. Backend Không Chạy
**Lỗi:** "Cannot connect to server"
**Giải pháp:**
```powershell
cd backend
python main.py
```

## Tips & Tricks

### 1. Chuẩn Bị Dữ Liệu Tốt
- Dùng file mẫu làm template
- Kiểm tra dữ liệu trước khi upload
- Loại bỏ các hàng trống

### 2. Xử Lý Hiệu Quả
- Upload batch 100-500 hồ sơ mỗi lần
- Không upload quá nhiều cùng lúc
- Chờ batch trước xong rồi mới upload tiếp

### 3. Phân Tích Kết Quả
- Sắp xếp theo điểm số để ưu tiên
- Lọc theo loại rủi ro
- Tập trung vào hồ sơ "Xem xét"

### 4. Lưu Trữ
- Export kết quả sau mỗi batch
- Lưu file với tên có ngày tháng
- Backup dữ liệu quan trọng

## Testing

### Test Backend API

```powershell
# Chạy test script
.\test-batch-scoring.ps1
```

Script sẽ:
1. Kiểm tra backend đang chạy
2. Tạo file test với 5 mẫu
3. Test download template
4. Test upload và phân tích
5. Lưu kết quả ra file

### Test Manual

1. **Download Template:**
   ```
   GET http://localhost:8000/api/credit/batch-template
   ```

2. **Upload File:**
   ```
   POST http://localhost:8000/api/credit/batch-score
   Content-Type: multipart/form-data
   file: [your_file.csv]
   ```

## Câu Hỏi Thường Gặp (FAQ)

### Q1: Có thể upload bao nhiêu hồ sơ cùng lúc?
**A:** Khuyến nghị 100-1000 hồ sơ mỗi batch. Hệ thống có thể xử lý nhiều hơn nhưng sẽ mất nhiều thời gian.

### Q2: File Excel có được hỗ trợ?
**A:** Có, hỗ trợ cả XLSX và XLS. Backend cần cài đặt `openpyxl`:
```bash
pip install openpyxl
```

### Q3: Dữ liệu có được lưu lại không?
**A:** Có, tất cả hồ sơ thành công sẽ được lưu vào database để tra cứu sau.

### Q4: Có thể xuất kết quả ra Excel không?
**A:** Hiện tại xuất ra CSV. Bạn có thể mở CSV bằng Excel và lưu lại dưới định dạng XLSX.

### Q5: Làm sao biết hồ sơ nào bị lỗi?
**A:** Trong kết quả có hiển thị:
- `success`: Số hồ sơ xử lý thành công
- `failed`: Số hồ sơ bị lỗi
- Các hồ sơ lỗi sẽ bị bỏ qua, không ảnh hưởng hồ sơ khác

### Q6: Có thể tùy chỉnh tiêu chí chấm điểm không?
**A:** Tiêu chí chấm điểm được cấu hình trong backend (`backend/services/credit_scoring.py`). Liên hệ developer để điều chỉnh.

## Hỗ Trợ

### Báo Lỗi
Nếu gặp lỗi, vui lòng cung cấp:
1. Thông báo lỗi chính xác
2. File dữ liệu (nếu có thể)
3. Các bước đã thực hiện
4. Screenshot (nếu có)

### Liên Hệ
- GitHub Issues: https://github.com/manhhung-fpt/vpbank_4/issues
- Email: [your-email@example.com]

## Tài Liệu Tham Khảo

1. [BATCH_SCORING_README.md](./BATCH_SCORING_README.md) - Chi tiết kỹ thuật
2. [README.md](./README.md) - Tài liệu tổng quan dự án
3. [API_EXAMPLES.md](./API_EXAMPLES.md) - Ví dụ API
