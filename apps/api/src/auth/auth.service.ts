import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'; // Giả sử bạn đã có PrismaService
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. Đăng ký tài khoản
  async register(email: string, password: string, fullName: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('Email đã tồn tại');

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        status: UserStatus.ACTIVE, // Tạm thời để ACTIVE để test, thực tế nên là PENDING chờ verify email
      },
    });
  }

  // 2. Validate User (Dùng cho Login Local)
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 3. Hàm tạo JWT Token
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
      },
    };
  }

  // 4. Xử lý Google Login
  async validateGoogleUser(profile: any) {
    const { emails, photos, id, displayName } = profile;
    const email = emails[0].value;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Nếu chưa có user thì tạo mới
      user = await this.prisma.user.create({
        data: {
          email,
          fullName: displayName,
          avatar: photos[0].value,
          googleId: id,
          status: UserStatus.ACTIVE,
          password: null, // Login Google không cần password
        },
      });
    } else if (!user.googleId) {
      // Nếu user đã tồn tại (đăng ký bằng email trước đó) -> update googleId để link tài khoản
      user = await this.prisma.user.update({
        where: { email },
        data: { googleId: id, avatar: user.avatar || photos[0].value },
      });
    }

    return user;
  }
}
