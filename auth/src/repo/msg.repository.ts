// msg.repository.ts
import { Repository } from 'typeorm';
import { Msg } from 'src/user/entities/msg.entitiy'; // Adjust the path as needed


export class MsgRepository extends Repository<Msg> {
  // Additional repository-specific methods, if needed
}
