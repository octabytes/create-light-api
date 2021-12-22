import { Repository } from "typeorm";
import { Service as AutoInjection } from "typedi";
import Database from "../database";
import WelcomeEntity from "./entity/Welcome.entity";

interface IWelcomeRepo {
  getEntity(text: string): Promise<WelcomeEntity>;
  saveEntity(text: string): Promise<WelcomeEntity>;
}

@AutoInjection()
class WelcomeRepo implements IWelcomeRepo {
  private readonly welcomeRepo: Repository<WelcomeEntity>;

  constructor() {
    this.welcomeRepo = Database.getRepository(WelcomeEntity);
  }

  async getEntity(text: string): Promise<WelcomeEntity> {
    const welcomeEntity: WelcomeEntity = await this.welcomeRepo.findOne({
      text: text,
    });

    return welcomeEntity;
  }

  async saveEntity(text: string): Promise<WelcomeEntity> {
    const welcomeEntity = new WelcomeEntity();
    welcomeEntity.text = text;

    await this.welcomeRepo.save(welcomeEntity);

    return welcomeEntity;
  }
}

export default WelcomeRepo;
