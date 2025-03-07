import { Application } from "./application";

export class Subscription {
    subscriptionId: number;
    userId: number;
    application: Application;
    subscriptionDate: Date;
    
    constructor(
      subscriptionId: number,
      userId: number,
      application: Application,
      subscriptionDate: Date
    ) {
      this.subscriptionId = subscriptionId;
      this.userId = userId;
      this.application = application;
      this.subscriptionDate = subscriptionDate;
    }
  }