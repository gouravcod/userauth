import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users: any[] = [];
  private userIdCounter = 1;

  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string) {
    const userExists = this.users.find(u => u.email === email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
        id: this.userIdCounter++,
        email,
        password: hashed,
      };
    this.users.push(newUser);
    return { message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } };
  }

  async validateUser(email: string, password: string) {
    const user = this.users.find(u => u.email === email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successful', token };
  }
    getUsers() {
        return this.users.map(user => ({ id: user.id, email: user.email }));
    }
  

    findManyByIds(ids: number[]) {
        const foundUser = this.users.filter(user => ids.includes(user.id));
  
        if (foundUser.length === 0) {
            throw new NotFoundException('No tasks found for the provided IDs');
          }
          return foundUser ;
    }   
}
         