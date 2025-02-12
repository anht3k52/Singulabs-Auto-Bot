# Singulabs-Auto-Bot
ông cụ tự động hóa nhiều ví cho các tác vụ so sánh hình ảnh AI. Bot này hỗ trợ nhiều ví và cấu hình proxy cho hoạt động phân tán.

🌟 Tính năng
Hỗ trợ nhiều ví
Hỗ trợ proxy HTTP/SOCKS
Tự động tải xuống và so sánh hình ảnh
Hoạt động liên tục với độ trễ có thể cấu hình
Ghi nhật ký chi tiết với mã màu
Tự động phục hồi lỗi
Xử lý hết hạn mã thông báo
📋 Điều kiện tiên quyết
Node.js (v16 trở lên)
npm (Trình quản lý gói Node)
Ví hoạt động với khóa riêng
(Tùy chọn) Proxy HTTP/SOCKS
🚀 Cài đặt
Sao chép kho lưu trữ này
git clone https://github.com/anht3k52/Singulabs-Auto-Bot.git
cd Singulabs-Auto-Botcd Singulabs-Auto-Bot
Cài đặt các phụ thuộc:
npm install
📁 Cấu trúc tập tin
Tạo các tập tin sau trong thư mục dự án của bạn:

pk.txt- Khóa riêng (mỗi dòng một khóa):
privatekey1
privatekey2
privatekey3
(Tùy chọn) proxy.txt- Danh sách proxy (mỗi dòng một danh sách):
http://user:pass@host:port
socks5://user:pass@host:port

⚙️ Cấu hình
Bot sử dụng một số tệp cấu hình:

Khóa riêng tư ( pk.txt)
Một khóa riêng tư trên mỗi dòng
Các dòng bắt đầu bằng # sẽ bị bỏ qua
Xóa bất kỳ khoảng trắng hoặc ký tự đặc biệt nào
Proxy ( proxy.txt)
Một proxy trên mỗi dòng
Hỗ trợ proxy HTTP và SOCKS
Định dạng:protocol://user:pass@host:port
Các dòng bắt đầu bằng # sẽ bị bỏ qua
🖥️ Cách sử dụng
Khởi động bot:
npm start
Theo dõi đầu ra của bảng điều khiển để biết:
Trạng thái khởi tạo ví
Cố gắng đăng nhập
Điểm kiếm được
Thông báo lỗi
🔄 Chu kỳ hoạt động
Đối với mỗi ví, bot:

Khởi tạo kết nối
Đăng nhập và lấy mã thông báo xác thực
Tải xuống hình ảnh ngẫu nhiên
Tải lên hình ảnh gốc
Thực hiện so sánh hình ảnh
Theo dõi điểm kiếm được
Chờ độ trễ được cấu hình
Lặp lại chu kỳ
⚠️Xử lý lỗi
Bot bao gồm một số cơ chế xử lý lỗi:

Tự động đăng nhập lại khi mã thông báo hết hạn
Phục hồi lỗi proxy
Xử lý lỗi mạng
Quản lý lỗi hệ thống tập tin
📊 Ghi nhật ký
Bot sử dụng đầu ra giao diện điều khiển được mã hóa màu:

🟦 Màu xanh: Thông tin chu kỳ
🟨 Vàng: Cập nhật quy trình
🟩 Màu xanh lá cây: Tin nhắn thành công
🟥 Đỏ: Thông báo lỗi
🔧 Xử lý sự cố
Các vấn đề thường gặp và giải pháp:

Lỗi kết nối

Kiểm tra kết nối internet
Xác minh cấu hình proxy
Đảm bảo điểm cuối RPC có thể truy cập được
Lỗi xác thực

Xác minh định dạng khóa riêng tư
Kiểm tra số dư ví
Đảm bảo cấu hình mạng chính xác
Lỗi xử lý hình ảnh

Kiểm tra dung lượng đĩa
Xác minh quyền của tệp
Đảm bảo thư mục tạm thời có thể ghi được

⚖️ Giấy phép
Dự án này được cấp phép theo Giấy phép MIT.

⚠️Tuyên bố miễn trừ trách nhiệm
Bot này chỉ dành cho mục đích giáo dục. Người dùng chịu trách nhiệm

Tuân thủ các điều khoản dịch vụ
Sử dụng mạng và chi phí
Quyền riêng tư và bảo mật dữ liệu
Bất kỳ hậu quả nào của việc sử dụng
Được tạo ra với ❤️ bởi SamC Company
