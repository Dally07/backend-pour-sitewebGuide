import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';


@Injectable()
export class DepartmentGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub; // Supposant que le champ `sub` contient l'ID de l'utilisateur dans le token JWT

    const user = await this.userService.findOne(userId);
    const departmentId = user.departementIdDepartement;

    const informationDepartmentId = request.body.departmentId; // Supposant que le champ soit présent dans le corps de la requête POST d'ajout d'information

    if (departmentId === informationDepartmentId) {
      return true;
    }

    return false;
  }
}