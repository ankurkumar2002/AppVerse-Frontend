import { Category } from "./category";
import { Subscription } from "./subscription";

export class Application {
    applicationId: number;
    applicationName: string;
    description: string;
    applicationUrl: string;
    applicationIconUrl: string;
    vendor: string;
    features: string;
    price: number;
    category: Category | null;
    screenshots: string;
    createdAt: Date;
    updatedAt: Date;
    subscriptions: Subscription[];
  
    constructor(
      applicationId: number,
      applicationName: string,
      description: string,
      applicationUrl: string,
      applicationIconUrl: string,
      vendor: string,
      features: string,
      price: number,
      category: Category,
      screenshots: string,
      createdAt: Date,
      updatedAt: Date,
      subscriptions: Subscription[]
    ) {
      this.applicationId = applicationId;
      this.applicationName = applicationName;
      this.description = description;
      this.applicationUrl = applicationUrl;
      this.applicationIconUrl = applicationIconUrl;
      this.vendor = vendor;
      this.features = features;
      this.price = price;
      this.category = category;
      this.screenshots = screenshots;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.subscriptions = subscriptions;
    }
  }