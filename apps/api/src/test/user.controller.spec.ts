import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { Res } from "@nestjs/common";

//INCOMPLETO
describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    findAll: jest.fn(()=>{

      return ["teste"]
    })
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService]
      })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

   // userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  it('should be defined',()=>{
    expect(userController).toBeDefined();
  })

  describe('Procure por todos usuários', () => {
    it('Deve retornar um array de usuários', async () => {
      expect(userController.findAll().toEqual()
    });
  });

  describe('Cadastrar usuários', () => {
    it('Deve retornar um objeto do usuário cadastrado', async () => {
      expect(userController.insertUser().toEqual()
    });
  });

  describe('Atualizar usuário', () => {
    it('Deve retornar um objeto do usuário atualizado', async () => {
      expect(userController.updateUser().toEqual()
    });
  });

  describe('Deletar usuário', () => {
    it('Deve retornar um objeto do usuário deletado', async () => {
      expect(userController.deleteUser().toEqual()
    });
  });

  describe('Login do usuário', () => {
    it('Deve retornar um cookie com o token do usuário', async () => {
      expect(userController.signIn().toEqual()
    });
  });
});