import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto, LoginDto } from './dto/auth.dto'; // Bạn tự tạo DTO nhé

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // --- ĐĂNG KÝ ---
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password, body.fullName);
  }

  // --- ĐĂNG NHẬP LOCAL ---
  // Flow: Client gửi user/pass -> Server check -> Server trả về JWT
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      return { message: 'Tài khoản hoặc mật khẩu không đúng' };
    }
    return this.authService.login(user);
  }

  // --- ĐĂNG NHẬP GOOGLE ---
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    // req.user chứa thông tin user trả về từ GoogleStrategy
    const result = await this.authService.login(req.user);

    // Redirect về Frontend kèm token (hoặc set cookie)
    // Ví dụ redirect về trang chủ kèm token trên URL (cách đơn giản nhất để demo)
    return res.redirect(
      `${process.env.CLIENT_URL || 'http://localhost:3000'}/home?token=${result.access_token}`,
    );
  }

  // --- ĐĂNG XUẤT ---
  // Với JWT, server không lưu session, nên "Logout" thực chất là phía Client xóa token.
  // API này chỉ mang tính chất thông báo hoặc clear cookie nếu bạn dùng cookie.
  @Post('logout')
  logout(@Res() res) {
    // Nếu dùng cookie: res.clearCookie('jwt');
    return res.json({ message: 'Đăng xuất thành công' });
  }

  // --- TEST API ĐƯỢC BẢO VỆ ---
  @Get('profile')
  @UseGuards(AuthGuard('jwt')) // Yêu cầu phải có Token hợp lệ mới gọi được
  getProfile(@Req() req) {
    return req.user; // Trả về thông tin user từ token
  }
}
