# Singulabs-Auto-Bot
Công cụ tự động hóa đa ví cho các tác vụ so sánh hình ảnh AI. Bot này hỗ trợ nhiều cấu hình ví và proxy cho hoạt động phân tán.

## 🌟 Tính năng

- Hỗ trợ nhiều ví
- Hỗ trợ proxy HTTP/SOCKS
- Tự động tải xuống và so sánh hình ảnh
- Hoạt động liên tục với độ trễ có thể cấu hình
- Ghi nhật ký chi tiết với mã màu
- Tự động phục hồi lỗi
- Xử lý hết hạn mã thông báo

## 📋 Điều kiện tiên quyết

- Node.js (v16 trở lên)
- npm (Trình quản lý gói nút)
- Ví hoạt động có khóa riêng
- (Tùy chọn) Proxy HTTP/SOCKS

## 🚀 Cài đặt

1. Sao chép kho lưu trữ này 
``` bash
bản sao git https://github.com/adnht3k52/Singulabs-Auto-Bot.git
cd Singulabs-Auto-Bot
```
2. Cài đặt phụ thuộc:
``` bash
cài đặt npm
```

## 📁 Cấu trúc tệp

Tạo các tệp sau trong thư mục dự án của bạn:
1. `pk.txt` - Private keys (one per line):
```
privatekey1
privatekey2
privatekey3
```

2. (Optional) `proxy.txt` - Proxy list (one per line):
```
http://user:pass@host:port
socks5://user:pass@host:port
```
## ⚙️ Cấu hình

Bot sử dụng một số tệp cấu hình:

### Khóa riêng (`pk.txt`)
- Một khóa riêng trên mỗi dòng
- Các dòng bắt đầu bằng # bị bỏ qua
- Loại bỏ khoảng trắng và ký tự đặc biệt

### Proxy (`proxy.txt`)
- Một proxy trên mỗi dòng
- Hỗ trợ proxy HTTP và SOCKS
- Định dạng: `protocol://user:pass@host:port`
- Các dòng bắt đầu bằng # bị bỏ qua

## 🖥️ Cách sử dụng

1. Khởi động bot:
``` bash
bắt đầu npm
```

2. Theo dõi đầu ra của bàn điều khiển để biết:
- Trạng thái khởi tạo ví
- Số lần đăng nhập
- Thu nhập điểm
- Thông báo lỗi

## 🔄 Chu kỳ hoạt động

Đối với mỗi ví, bot:
1. Khởi tạo kết nối
2. Đăng nhập và nhận mã thông báo xác thực
3. Tải hình ảnh ngẫu nhiên
4. Tải lên hình ảnh gốc
5. Thực hiện so sánh hình ảnh
6. Theo dõi thu nhập điểm
7. Chờ độ trễ được cấu hình
8. Lặp lại chu kỳ
## ⚠️ Xử lý lỗi

Bot bao gồm một số cơ chế xử lý lỗi:
- Tự động đăng nhập lại khi hết hạn mã thông báo
- Phục hồi lỗi proxy
- Xử lý lỗi mạng
- Quản lý lỗi hệ thống tập tin

## 📊 Đăng nhập

Bot sử dụng đầu ra của bảng điều khiển được mã hóa màu:
- 🟦 Màu xanh: Thông tin chu kỳ
- 🟨 Màu vàng: Cập nhật quy trình
- 🟩 Màu xanh lá cây: Thông điệp thành công
- 🟥 Đỏ: Thông báo lỗi

## 🔧 Khắc phục sự cố

Các vấn đề thường gặp và giải pháp:

1. **Lỗi kết nối**
   - Kiểm tra kết nối internet
   - Xác minh cấu hình proxy
   - Đảm bảo điểm cuối RPC có thể truy cập được

2. **Lỗi xác thực**
   - Xác minh định dạng khóa riêng
   - Kiểm tra số dư ví
   - Đảm bảo cấu hình mạng chính xác

3. **Lỗi xử lý hình ảnh**
   - Kiểm tra dung lượng ổ đĩa
   - Xác minh quyền tập tin
   - Đảm bảo thư mục tạm thời có thể ghi được
   
## 📱 Contact

For support or updates:
- Telegram: [@Samcvn](https://t.me/samcvn)

## ⚖️ Giấy phép

Dự án này được cấp phép theo Giấy phép MIT.

## ⚠️ Tuyên bố từ chối trách nhiệm

Bot này chỉ dành cho mục đích giáo dục. Người dùng có trách nhiệm:
- Tuân thủ các điều khoản dịch vụ
- Sử dụng mạng và chi phí
- Quyền riêng tư và bảo mật dữ liệu
- Bất kỳ hậu quả nào của việc sử dụng

---
Được tạo bởi SamcVN
