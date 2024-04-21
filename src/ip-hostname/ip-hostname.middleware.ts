import { Injectable, Ip, NestMiddleware } from '@nestjs/common';
import { Console } from 'console';
import { NextFunction, Request, Response } from 'express'; 


@Injectable()
export class IpHostnameMiddleware implements NestMiddleware {

  async use(reqs: Request, res: Response, next: NextFunction) {
    try {
      const {hostname, IP} = await this.getRemoteAdress(reqs);

   
      reqs.ip = IP;
      reqs.hostname = hostname;

  


      next();
    } catch(error) {
      console.error(`erreurlors de la recuperation de IP et Hostname : ${error.message}`);
      next(error);
    }

  }


  private async getRemoteAdress(req: Request): Promise<{hostname: string; IP:string}> {
    const ipAddress = req.headers['X-forwarded-for'] as string | undefined;
    const hostname = req.hostname;

    if(ipAddress){
      const ips = ipAddress.split(' , ');
      return{ hostname, IP: ips[0].trim() };
    }else {
      return {hostname, IP: req.ip};

  }
}
}
