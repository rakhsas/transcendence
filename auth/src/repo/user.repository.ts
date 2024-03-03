// msg.repository.ts
import { Repository } from 'typeorm';
import { User1 } from 'src/user/entities/user.entity';


export class UserRepository extends Repository<User1> {
  // Additional repository-specific methods, if needed
}
