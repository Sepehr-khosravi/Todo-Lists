import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(config: ConfigService) {
        const jwtKey = config.get<string>("JWT_KEY");
        if(!jwtKey){
            throw new Error("JWT_Key is not here!!");
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtKey,
        });
    }
    async validate(payload: any) {
        return { userId: payload.userId, email: payload.email };
    }
}