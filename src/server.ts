import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { UserRouter } from './router/user.router';
import { ConfigServer } from './config/config';
import { Connection, DataSource, createConnection } from 'typeorm';

class ServerBootstrap extends ConfigServer{
    public app: express.Application = express();
    private port:number = this.getNumberEnv('PORT') || 8001;

    constructor(){
        super();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}));
        this.dbConnect();
        this.app.use(morgan('dev'));
        this.app.use(cors());

        this.app.use('/api', this.routers())
        this.listen()
    }

    routers(): Array<express.Router>{
        return [new UserRouter().router];
    }

    async dbConnect():Promise<void>{
        try{
             await new DataSource(this.typeORMConfig).initialize();
            console.log('🚀 Conectado a la base de datos');
        }catch(error){
            console.log('Error al conectar a la base de datos' + error)
        }
        
    }

    public listen(){
        this.app.listen(this.port, () => {
            console.log("Servidor escuchando en el puerto " + this.port)
        })
    }
}

new ServerBootstrap()