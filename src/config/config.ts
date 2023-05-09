import * as dotenv from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSourceOptions } from 'typeorm';


export abstract class ConfigServer {
    constructor() {
        const nodeNameEnv = this.cratePathEnv(this.nodeEnv);
        dotenv.config(
            {
                path: nodeNameEnv,
            }
        )
    }

    public getEnviroment(k: string): string | undefined{
        return process.env[k]
    }

    public getNumberEnv(k:string) : number{
        return Number(this.getEnviroment(k))
    }

    public get nodeEnv(): string{
        return this.getEnviroment('NODE_ENV')?.trim() || "";
    }

    public cratePathEnv(path: string):string{
        const arrEnv: Array<String> = ['env']
        if(path.length > 0){
            const stringToArray = path.split('.');
            arrEnv.unshift(...stringToArray)
        }
        return '.' + arrEnv.join('.')
    }

    public get typeORMConfig(): DataSourceOptions{
        
        return {
            type: "mysql",
            host: this.getEnviroment("MYSQL_HOST"),
            port: this.getNumberEnv("DB_PORT"),
            username: this.getEnviroment("MYSQL_USER"),
            password: this.getEnviroment("MYSQL_PASSWORD"),
            database: this.getEnviroment("MYSQL_DATABASE"),
            entities: [__dirname + "/../**/*.entity{.ts,.js}"],
            migrations: [__dirname + "../../migrations/*{.ts,.js}"],
            synchronize: true,
            logging: false,
            namingStrategy: new SnakeNamingStrategy(),
        }
    }
}