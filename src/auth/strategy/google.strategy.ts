import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20'; // Sử dụng 'passport-google-oauth20' để cấu hình chiến lược Google OAuth 2.0
import { AuthService } from '../auth.service'; // Import AuthService để xử lý nghiệp vụ liên quan đến xác thực
import { Injectable } from '@nestjs/common'; // Injectable được dùng để NestJS quản lý lớp này như một provider
import { ConfigService } from '@nestjs/config'; // ConfigService để lấy các biến môi trường cho cấu hình OAuth

@Injectable() // Đánh dấu lớp này là Injectable để NestJS có thể tiêm các service khác vào
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService, // Inject AuthService để sử dụng trong quá trình xác thực người dùng
    private config: ConfigService, // Inject ConfigService để lấy các biến cấu hình từ file .env
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'), // Lấy clientID từ file .env để định danh ứng dụng với Google
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'), // Lấy clientSecret từ file .env để bảo mật xác thực
      callbackURL: config.get('GOOGLE_REDIRECT_URI'), // URL mà Google sẽ gọi lại sau khi người dùng đăng nhập thành công
      scope: ['profile', 'email'], // Các quyền mà ứng dụng yêu cầu (profile và email của người dùng)
    });
  }

  // Hàm này sẽ được gọi sau khi người dùng đăng nhập thành công với Google
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // Kiểm tra và lấy thông tin cần thiết từ profile
    const email = profile.emails?.[0]?.value;
    const familyName = profile.name?.familyName || '';
    const givenName = profile.name?.givenName || '';
    const photo = profile.photos?.[0]?.value || '';

    // In ra accessToken, refreshToken và profile để kiểm tra (nếu cần)
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Profile:', profile);

    // Xác thực hoặc tạo người dùng
    const user = await this.authService.validateUser(
      email,
      familyName,
      givenName,
      photo,
    );

    // Trả về user đã xác thực hoặc null nếu không thành công
    return user || null;
  }
}
