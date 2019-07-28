import { Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

@Controller('api')

export class SetupController {

    @Get('/')
    private getMessage(req: Request, res: Response) {
        res.status(200).json({
            message: 'server controller is runnint well',
        });
    }
}
