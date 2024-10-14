// Đoạn code này chủ yếu sẽ sử dụng các hàm được định nghĩa từ hàm cha thông qua super từ đó trả về kết quả xác thực người dùng từ Google OAuth 2.0 sau đó có thể
// lưu trữ thông tin người dùng vào session hoặc xử lý thông tin người dùng trong hệ thống.
import { ExecutionContext, Injectable } from '@nestjs/common'; // Import các thành phần cần thiết từ NestJS
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard từ Passport để sử dụng các chiến lược xác thực (authentication strategy)

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  // Tạo guard bằng cách mở rộng từ AuthGuard và chỉ định chiến lược là 'google'
  async canActivate(context: ExecutionContext) {
    try {
      // Gọi phương thức `canActivate` từ lớp cha AuthGuard để kích hoạt guard này, trả về kết quả boolean (true nếu thành công)
      const activate = (await super.canActivate(context)) as boolean;

      // Lấy request từ context của HTTP để truy cập thông tin yêu cầu của người dùng (request)
      const request = context.switchToHttp().getRequest();

      // Gọi phương thức logIn từ Passport để lưu trữ thông tin người dùng vào session nếu cần
      await super.logIn(request);

      return activate; // Trả về giá trị boolean xác định guard có được kích hoạt thành công hay không
    } catch (error) {
      return false; // Nếu có lỗi xảy ra, trả về false, ngăn chặn quá trình tiếp tục
    }
  }
}
